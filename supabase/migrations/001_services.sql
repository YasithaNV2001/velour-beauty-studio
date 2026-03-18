-- Reusable trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TABLE services (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now(),
  name           text NOT NULL,
  description    text,
  category       text NOT NULL CHECK (category IN ('hair', 'skin', 'nails', 'bridal', 'makeup')),
  price_lkr      integer NOT NULL CHECK (price_lkr > 0),
  duration_min   integer NOT NULL CHECK (duration_min > 0),
  image_url      text,
  is_active      boolean DEFAULT true,
  display_order  integer DEFAULT 0
);

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
