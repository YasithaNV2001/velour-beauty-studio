"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setAuthError(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message
      )
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-cream-dark p-8">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Error alert */}
        {authError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
          >
            <AlertCircle className="size-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{authError}</span>
          </div>
        )}

        {/* Email field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-plum font-medium text-sm">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@velour.lk"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              "h-10 border-cream-dark focus-visible:border-gold focus-visible:ring-gold/30",
              errors.email && "border-red-400 focus-visible:border-red-400"
            )}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-xs text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-plum font-medium text-sm">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={cn(
                "h-10 border-cream-dark pr-10 focus-visible:border-gold focus-visible:ring-gold/30",
                errors.password && "border-red-400 focus-visible:border-red-400"
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/40 hover:text-plum/70 transition-colors focus-visible:outline-none focus-visible:text-plum"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" role="alert" className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-plum text-cream hover:bg-plum-light font-medium text-sm mt-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Signing in…</span>
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-plum/40">
        Velour Beauty Studio &mdash; Admin Portal
      </p>
    </div>
  )
}
