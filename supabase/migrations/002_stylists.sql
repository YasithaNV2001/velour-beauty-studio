CREATE TABLE stylists (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now(),
  name           text NOT NULL,
  role           text NOT NULL,
  bio            text,
  photo_url      text,
  specialties    text[] DEFAULT '{}',
  instagram_url  text,
  is_active      boolean DEFAULT true,
  display_order  integer DEFAULT 0
);

CREATE TRIGGER update_stylists_updated_at
  BEFORE UPDATE ON stylists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
