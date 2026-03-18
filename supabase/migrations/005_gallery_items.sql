CREATE TABLE gallery_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),
  title            text,
  category         text CHECK (category IN ('hair', 'skin', 'nails', 'bridal', 'makeup')),
  before_image_url text,
  after_image_url  text,
  is_active        boolean DEFAULT true,
  display_order    integer DEFAULT 0
);

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
