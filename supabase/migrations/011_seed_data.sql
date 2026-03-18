-- Site settings
INSERT INTO site_settings (key, value) VALUES
  ('business_name',    '"Velour Beauty Studio"'),
  ('whatsapp_number',  '"94771234567"'),
  ('address',          '"123 Galle Road, Colombo 03, Sri Lanka"'),
  ('google_maps_url',  '"https://maps.google.com"'),
  ('opening_hours',    '{"mon_fri": "9:00 AM - 7:00 PM", "sat": "9:00 AM - 5:00 PM", "sun": "Closed"}'),
  ('instagram_url',    '"https://instagram.com/velourbeautystudio"'),
  ('facebook_url',     '"https://facebook.com/velourbeautystudio"');

-- Demo stylists
INSERT INTO stylists (name, role, bio, specialties, display_order) VALUES
  ('Amaya Perera',    'Senior Stylist',      'Amaya brings 8 years of expertise in hair transformation and color artistry.', ARRAY['hair', 'bridal'], 1),
  ('Dilini Fernando', 'Nail Technician',     'Dilini is passionate about nail art and delivers flawless, long-lasting designs.', ARRAY['nails'], 2),
  ('Sachini Jayawardena', 'Beauty Therapist', 'Sachini specializes in skin treatments and makeup for every occasion.', ARRAY['skin', 'makeup'], 3);

-- Demo services
INSERT INTO services (name, description, category, price_lkr, duration_min, display_order) VALUES
  ('Haircut & Blow Dry',    'Precision cut tailored to your face shape, finished with a professional blow dry.', 'hair',   3500,  60, 1),
  ('Hair Coloring',         'Full color or highlights using premium products for vibrant, lasting results.',        'hair',   8500, 120, 2),
  ('Keratin Treatment',     'Smooth, frizz-free hair for up to 3 months with our signature keratin formula.',      'hair',  15000, 180, 3),
  ('Classic Manicure',      'Shape, buff, and polish for perfectly groomed hands.',                                'nails',  2000,  45, 4),
  ('Gel Nail Extension',    'Long-lasting gel extensions with your choice of design.',                             'nails',  5500,  90, 5),
  ('Deep Cleansing Facial', 'A thorough cleanse to remove impurities and restore your natural glow.',             'skin',   4500,  75, 6),
  ('Bridal Package',        'Complete bridal look including hair styling, makeup, and nail care.',                 'bridal', 35000, 360, 7),
  ('Party Makeup',          'Glamorous makeup looks for any special occasion.',                                    'makeup', 6000,  90, 8);

-- Demo testimonials
INSERT INTO testimonials (customer_name, service_name, rating, review_text, is_featured, display_order) VALUES
  ('Nimesha R.',    'Bridal Package',        5, 'Absolutely magical experience! The team made me feel like royalty on my wedding day. Every detail was perfect.',               true, 1),
  ('Tharushi S.',   'Keratin Treatment',     5, 'My hair has never looked better! Smooth, shiny and completely frizz-free. Will definitely be coming back.',                   true, 2),
  ('Kavindi M.',    'Deep Cleansing Facial', 5, 'Such a relaxing experience. My skin felt brand new afterwards. Sachini is incredibly skilled and attentive.',                  true, 3),
  ('Hansani P.',    'Gel Nail Extension',    5, 'Dilini''s nail art is stunning. I get compliments everywhere I go. The quality lasts for weeks without chipping.',             true, 4),
  ('Rashmi A.',     'Hair Coloring',         5, 'Amaya perfectly matched the color I wanted from a reference photo. The result was even better than I imagined!',              true, 5),
  ('Sanduni W.',    'Party Makeup',          5, 'Looked stunning at my cousin''s wedding. The makeup stayed perfect the entire day and night. Highly recommend!',               true, 6);

-- Demo availability slots (next 7 days for each stylist)
-- Stylist 1: Mon-Sat, 9am-6pm, 1h slots
INSERT INTO availability_slots (stylist_id, date, start_time, end_time)
SELECT
  s.id,
  CURRENT_DATE + n,
  t::time,
  (t::time + INTERVAL '1 hour')
FROM stylists s
CROSS JOIN generate_series(1, 7) n
CROSS JOIN (VALUES ('09:00'), ('10:00'), ('11:00'), ('13:00'), ('14:00'), ('15:00'), ('16:00')) AS slots(t)
WHERE EXTRACT(DOW FROM CURRENT_DATE + n) BETWEEN 1 AND 6;
