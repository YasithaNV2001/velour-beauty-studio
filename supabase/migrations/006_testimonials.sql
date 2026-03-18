CREATE TABLE testimonials (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz DEFAULT now(),
  customer_name text NOT NULL,
  service_name  text,
  rating        integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text   text NOT NULL,
  avatar_url    text,
  is_featured   boolean DEFAULT false,
  is_active     boolean DEFAULT true,
  display_order integer DEFAULT 0
);
