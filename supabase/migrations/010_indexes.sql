CREATE INDEX idx_appointments_date   ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_availability_stylist_date ON availability_slots(stylist_id, date);
CREATE INDEX idx_availability_unbooked ON availability_slots(date, is_booked) WHERE is_booked = false;
CREATE INDEX idx_gallery_category    ON gallery_items(category) WHERE is_active = true;
CREATE INDEX idx_services_category   ON services(category) WHERE is_active = true;
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_active = true;
