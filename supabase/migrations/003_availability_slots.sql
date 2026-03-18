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
