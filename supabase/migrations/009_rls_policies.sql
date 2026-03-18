-- Enable RLS on all tables
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings     ENABLE ROW LEVEL SECURITY;

-- services: public read, admin write
CREATE POLICY "public can view active services"
  ON services FOR SELECT USING (is_active = true);

CREATE POLICY "admin can manage services"
  ON services FOR ALL USING (is_admin());

-- stylists: public read, admin write
CREATE POLICY "public can view active stylists"
  ON stylists FOR SELECT USING (is_active = true);

CREATE POLICY "admin can manage stylists"
  ON stylists FOR ALL USING (is_admin());

-- availability_slots: public read, admin write
CREATE POLICY "public can view availability"
  ON availability_slots FOR SELECT USING (true);

CREATE POLICY "admin can manage availability"
  ON availability_slots FOR ALL USING (is_admin());

-- appointments: anyone can INSERT, only admin can SELECT/UPDATE
CREATE POLICY "anyone can create appointment"
  ON appointments FOR INSERT WITH CHECK (true);

CREATE POLICY "admin can view all appointments"
  ON appointments FOR SELECT USING (is_admin());

CREATE POLICY "admin can update appointments"
  ON appointments FOR UPDATE USING (is_admin());

-- gallery_items: public read active, admin write
CREATE POLICY "public can view active gallery items"
  ON gallery_items FOR SELECT USING (is_active = true);

CREATE POLICY "admin can manage gallery items"
  ON gallery_items FOR ALL USING (is_admin());

-- testimonials: public read active, admin write
CREATE POLICY "public can view active testimonials"
  ON testimonials FOR SELECT USING (is_active = true);

CREATE POLICY "admin can manage testimonials"
  ON testimonials FOR ALL USING (is_admin());

-- admin_users: admin only
CREATE POLICY "admin can view admin users"
  ON admin_users FOR SELECT USING (is_admin());

CREATE POLICY "admin can manage admin users"
  ON admin_users FOR ALL USING (is_admin());

-- site_settings: public read, admin write
CREATE POLICY "public can view site settings"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "admin can manage site settings"
  ON site_settings FOR ALL USING (is_admin());
