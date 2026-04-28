require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sql = `
CREATE TABLE IF NOT EXISTS rebuttals (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id  uuid NOT NULL REFERENCES scammer_profiles(id) ON DELETE CASCADE,
  name        text,
  email       text,
  content     text NOT NULL,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS rebuttals_profile_id_idx ON rebuttals (profile_id);
CREATE INDEX IF NOT EXISTS rebuttals_status_idx ON rebuttals (status);

-- RLS: anyone can read approved rebuttals; only service role can insert/update
ALTER TABLE rebuttals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved rebuttals" ON rebuttals;
CREATE POLICY "Public read approved rebuttals"
  ON rebuttals FOR SELECT
  USING (status = 'approved');
`;

async function run() {
  const { error } = await supabase.rpc('exec_sql', { query: sql }).single();
  if (error) {
    // exec_sql may not exist — print SQL to copy-paste instead
    console.log('Could not auto-run SQL. Please run this in the Supabase SQL editor:\n');
    console.log(sql);
  } else {
    console.log('✓ rebuttals table created');
  }
}

run();
