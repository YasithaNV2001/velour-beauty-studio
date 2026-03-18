-- ============================================================
-- VELOUR BEAUTY STUDIO — FULL RESET & SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- Drop existing tables if re-running (safe reset)
DROP TABLE IF EXISTS availability_slots CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS gallery_items CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS stylists CASCADE;
DROP FUNCTION IF EXISTS set_updated_at CASCADE;
DROP FUNCTION IF EXISTS is_admin CASCADE;

-- ============================================================
-- FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- TABLES
-- ============================================================

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
  BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION set_updated_at();

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
  BEFORE UPDATE ON stylists FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE availability_slots (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz DEFAULT now(),
  stylist_id   uuid NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
  date         date NOT NULL,
  start_time   time NOT NULL,
  end_time     time NOT NULL,
  is_booked    boolean DEFAULT false,
  UNIQUE (stylist_id, date, start_time)
);

CREATE TABLE appointments (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now(),
  service_id           uuid REFERENCES services(id) ON DELETE SET NULL,
  stylist_id           uuid REFERENCES stylists(id) ON DELETE SET NULL,
  slot_id              uuid REFERENCES availability_slots(id) ON DELETE SET NULL,
  customer_name        text NOT NULL,
  customer_email       text,
  customer_phone       text NOT NULL,
  appointment_date     date NOT NULL,
  appointment_time     time NOT NULL,
  status               text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes                text,
  admin_notes          text,
  total_price_lkr      integer,
  confirmation_sent_at timestamptz
);
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

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
  BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();

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

CREATE TABLE admin_users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  email      text NOT NULL,
  role       text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff'))
);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
$$;

CREATE TABLE site_settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text UNIQUE NOT NULL,
  value      jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- GRANTS (critical — fixes permission denied errors)
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON services, stylists, availability_slots, gallery_items, testimonials, site_settings
  TO anon, authenticated;

GRANT INSERT ON appointments TO anon, authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylists           ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can view active services"      ON services           FOR SELECT USING (is_active = true);
CREATE POLICY "admin can manage services"            ON services           FOR ALL    USING (is_admin());
CREATE POLICY "public can view active stylists"      ON stylists           FOR SELECT USING (is_active = true);
CREATE POLICY "admin can manage stylists"            ON stylists           FOR ALL    USING (is_admin());
CREATE POLICY "public can view availability"         ON availability_slots FOR SELECT USING (true);
CREATE POLICY "admin can manage availability"        ON availability_slots FOR ALL    USING (is_admin());
CREATE POLICY "anyone can create appointment"        ON appointments       FOR INSERT WITH CHECK (true);
CREATE POLICY "admin can view all appointments"      ON appointments       FOR SELECT USING (is_admin());
CREATE POLICY "admin can update appointments"        ON appointments       FOR UPDATE USING (is_admin());
CREATE POLICY "public can view active gallery items" ON gallery_items      FOR SELECT USING (is_active = true);
CREATE POLICY "admin can manage gallery items"       ON gallery_items      FOR ALL    USING (is_admin());
CREATE POLICY "public can view active testimonials"  ON testimonials       FOR SELECT USING (is_active = true);
CREATE POLICY "admin can manage testimonials"        ON testimonials       FOR ALL    USING (is_admin());
CREATE POLICY "admin can view admin users"           ON admin_users        FOR SELECT USING (is_admin());
CREATE POLICY "admin can manage admin users"         ON admin_users        FOR ALL    USING (is_admin());
CREATE POLICY "public can view site settings"        ON site_settings      FOR SELECT USING (true);
CREATE POLICY "admin can manage site settings"       ON site_settings      FOR ALL    USING (is_admin());

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_appointments_date          ON appointments(appointment_date);
CREATE INDEX idx_appointments_status        ON appointments(status);
CREATE INDEX idx_availability_stylist_date  ON availability_slots(stylist_id, date);
CREATE INDEX idx_availability_unbooked      ON availability_slots(date, is_booked) WHERE is_booked = false;
CREATE INDEX idx_gallery_category           ON gallery_items(category) WHERE is_active = true;
CREATE INDEX idx_services_category          ON services(category) WHERE is_active = true;
CREATE INDEX idx_testimonials_featured      ON testimonials(is_featured) WHERE is_active = true;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO site_settings (key, value) VALUES
  ('business_name',   '"Velour Beauty Studio"'),
  ('whatsapp_number', '"94771234567"'),
  ('address',         '"123 Galle Road, Colombo 03, Sri Lanka"'),
  ('google_maps_url', '"https://maps.google.com"'),
  ('opening_hours',   '{"mon_fri": "9:00 AM - 7:00 PM", "sat": "9:00 AM - 5:00 PM", "sun": "Closed"}'),
  ('instagram_url',   '"https://instagram.com/velourbeautystudio"'),
  ('facebook_url',    '"https://facebook.com/velourbeautystudio"');

INSERT INTO stylists (name, role, bio, specialties, display_order) VALUES
  ('Amaya Perera',        'Senior Stylist',    'Amaya brings 8 years of expertise in hair transformation and color artistry.',         ARRAY['hair','bridal'], 1),
  ('Dilini Fernando',     'Nail Technician',   'Dilini is passionate about nail art and delivers flawless, long-lasting designs.',     ARRAY['nails'],         2),
  ('Sachini Jayawardena', 'Beauty Therapist',  'Sachini specializes in skin treatments and makeup for every occasion.',               ARRAY['skin','makeup'], 3);

INSERT INTO services (name, description, category, price_lkr, duration_min, display_order) VALUES
  ('Haircut & Blow Dry',    'Precision cut tailored to your face shape, finished with a professional blow dry.',     'hair',    3500,  60, 1),
  ('Hair Coloring',         'Full color or highlights using premium products for vibrant, lasting results.',          'hair',    8500, 120, 2),
  ('Keratin Treatment',     'Smooth, frizz-free hair for up to 3 months with our signature keratin formula.',        'hair',   15000, 180, 3),
  ('Classic Manicure',      'Shape, buff, and polish for perfectly groomed hands.',                                  'nails',   2000,  45, 4),
  ('Gel Nail Extension',    'Long-lasting gel extensions with your choice of design.',                               'nails',   5500,  90, 5),
  ('Deep Cleansing Facial', 'A thorough cleanse to remove impurities and restore your natural glow.',               'skin',    4500,  75, 6),
  ('Bridal Package',        'Complete bridal look including hair styling, makeup, and nail care.',                   'bridal', 35000, 360, 7),
  ('Party Makeup',          'Glamorous makeup looks for any special occasion.',                                      'makeup',  6000,  90, 8);

INSERT INTO testimonials (customer_name, service_name, rating, review_text, is_featured, display_order) VALUES
  ('Nimesha R.',  'Bridal Package',        5, 'Absolutely magical experience! The team made me feel like royalty on my wedding day. Every detail was perfect.',    true, 1),
  ('Tharushi S.', 'Keratin Treatment',     5, 'My hair has never looked better! Smooth, shiny and completely frizz-free. Will definitely be coming back.',         true, 2),
  ('Kavindi M.',  'Deep Cleansing Facial', 5, 'Such a relaxing experience. My skin felt brand new afterwards. Sachini is incredibly skilled and attentive.',       true, 3),
  ('Hansani P.',  'Gel Nail Extension',    5, 'Dilini''s nail art is stunning. I get compliments everywhere I go. The quality lasts for weeks without chipping.',  true, 4),
  ('Rashmi A.',   'Hair Coloring',         5, 'Amaya perfectly matched the color I wanted from a reference photo. The result was even better than I imagined!',   true, 5),
  ('Sanduni W.',  'Party Makeup',          5, 'Looked stunning at my cousin''s wedding. The makeup stayed perfect the entire day and night. Highly recommend!',    true, 6);

INSERT INTO gallery_items (title, category, before_image_url, after_image_url, display_order) VALUES
  ('Hair Color Transformation', 'hair',   'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600', 1),
  ('Bridal Updo',               'bridal', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600', 2),
  ('Gel Nail Art',              'nails',  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', 3),
  ('Skin Glow Treatment',       'skin',   'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600', 4),
  ('Keratin Smoothing',         'hair',   'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600', 5),
  ('Party Glam Makeup',         'makeup', 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600', 6);

-- Availability slots: next 7 days for all stylists
INSERT INTO availability_slots (stylist_id, date, start_time, end_time)
SELECT
  s.id,
  CURRENT_DATE + n,
  t::time,
  (t::time + INTERVAL '1 hour')
FROM stylists s
CROSS JOIN generate_series(1, 7) n
CROSS JOIN (VALUES ('09:00'),('10:00'),('11:00'),('13:00'),('14:00'),('15:00'),('16:00')) AS slots(t)
WHERE EXTRACT(DOW FROM CURRENT_DATE + n) BETWEEN 1 AND 6;
