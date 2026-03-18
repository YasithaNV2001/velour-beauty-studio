// Auto-generate with: supabase gen types typescript --local > lib/supabase/types.ts
// Placeholder types — update after running migrations

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Tables: {
      services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          category: "hair" | "skin" | "nails" | "bridal" | "makeup"
          price_lkr: number
          duration_min: number
          image_url: string | null
          is_active: boolean
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          category: "hair" | "skin" | "nails" | "bridal" | "makeup"
          price_lkr: number
          duration_min: number
          image_url?: string | null
          is_active?: boolean
          display_order?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: "hair" | "skin" | "nails" | "bridal" | "makeup"
          price_lkr?: number
          duration_min?: number
          image_url?: string | null
          is_active?: boolean
          display_order?: number
        }
        Relationships: []
      }
      stylists: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          role: string
          bio: string | null
          photo_url: string | null
          specialties: string[]
          instagram_url: string | null
          is_active: boolean
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          role: string
          bio?: string | null
          photo_url?: string | null
          specialties?: string[]
          instagram_url?: string | null
          is_active?: boolean
          display_order?: number
        }
        Update: {
          id?: string
          name?: string
          role?: string
          bio?: string | null
          photo_url?: string | null
          specialties?: string[]
          instagram_url?: string | null
          is_active?: boolean
          display_order?: number
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          id: string
          created_at: string
          stylist_id: string
          date: string
          start_time: string
          end_time: string
          is_booked: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          stylist_id: string
          date: string
          start_time: string
          end_time: string
          is_booked?: boolean
        }
        Update: {
          id?: string
          stylist_id?: string
          date?: string
          start_time?: string
          end_time?: string
          is_booked?: boolean
        }
        Relationships: []
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          service_id: string | null
          stylist_id: string | null
          slot_id: string | null
          customer_name: string
          customer_email: string | null
          customer_phone: string
          appointment_date: string
          appointment_time: string
          status: "pending" | "confirmed" | "completed" | "cancelled"
          notes: string | null
          admin_notes: string | null
          total_price_lkr: number | null
          confirmation_sent_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          service_id?: string | null
          stylist_id?: string | null
          slot_id?: string | null
          customer_name: string
          customer_email?: string | null
          customer_phone: string
          appointment_date: string
          appointment_time: string
          status?: "pending" | "confirmed" | "completed" | "cancelled"
          notes?: string | null
          admin_notes?: string | null
          total_price_lkr?: number | null
          confirmation_sent_at?: string | null
        }
        Update: {
          id?: string
          service_id?: string | null
          stylist_id?: string | null
          slot_id?: string | null
          customer_name?: string
          customer_email?: string | null
          customer_phone?: string
          appointment_date?: string
          appointment_time?: string
          status?: "pending" | "confirmed" | "completed" | "cancelled"
          notes?: string | null
          admin_notes?: string | null
          total_price_lkr?: number | null
          confirmation_sent_at?: string | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string | null
          category: "hair" | "skin" | "nails" | "bridal" | "makeup" | null
          before_image_url: string | null
          after_image_url: string | null
          is_active: boolean
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string | null
          category?: "hair" | "skin" | "nails" | "bridal" | "makeup" | null
          before_image_url?: string | null
          after_image_url?: string | null
          is_active?: boolean
          display_order?: number
        }
        Update: {
          id?: string
          title?: string | null
          category?: "hair" | "skin" | "nails" | "bridal" | "makeup" | null
          before_image_url?: string | null
          after_image_url?: string | null
          is_active?: boolean
          display_order?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          created_at: string
          customer_name: string
          service_name: string | null
          rating: number
          review_text: string
          avatar_url: string | null
          is_featured: boolean
          is_active: boolean
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          customer_name: string
          service_name?: string | null
          rating: number
          review_text: string
          avatar_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          display_order?: number
        }
        Update: {
          id?: string
          customer_name?: string
          service_name?: string | null
          rating?: number
          review_text?: string
          avatar_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          display_order?: number
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          created_at: string
          email: string
          role: "admin" | "staff"
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          role?: "admin" | "staff"
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "staff"
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
  }
}

// Convenience types
export type Service = Database["public"]["Tables"]["services"]["Row"]
export type Stylist = Database["public"]["Tables"]["stylists"]["Row"]
export type AvailabilitySlot = Database["public"]["Tables"]["availability_slots"]["Row"]
export type Appointment = Database["public"]["Tables"]["appointments"]["Row"]
export type GalleryItem = Database["public"]["Tables"]["gallery_items"]["Row"]
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"]
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"]
