import type { Metadata } from "next"
import { LoginForm } from "./LoginForm"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin Login | Velour Beauty Studio",
  description: "Sign in to the Velour Beauty Studio admin dashboard",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-plum/5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold/10" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-plum mb-4 shadow-lg">
            <span className="text-gold font-serif text-2xl font-semibold">V</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-plum">Admin Login</h1>
          <p className="mt-1 text-sm text-plum/60 font-sans">
            Velour Beauty Studio Dashboard
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  )
}
