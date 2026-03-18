CREATE TABLE admin_users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  email      text NOT NULL,
  role       text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff'))
);

-- Helper function used in all RLS policies
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
$$;
