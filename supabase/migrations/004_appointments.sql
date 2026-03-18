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
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
