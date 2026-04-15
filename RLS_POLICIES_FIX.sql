-- Update RLS Policies for Activity Logging
-- Run these queries in Supabase SQL Editor if you're seeing 400 errors

-- 1. Allow unauthenticated activity log inserts (for initial setup)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "allow_insert_activity_logs" ON activity_logs;

-- Create more permissive policy for development
CREATE POLICY "allow_insert_activity_logs"
  ON activity_logs
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 2. Allow reading activity logs
DROP POLICY IF EXISTS "allow_read_activity_logs" ON activity_logs;

CREATE POLICY "allow_read_activity_logs"
  ON activity_logs
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 3. Fix items table RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_read_items" ON items;
CREATE POLICY "allow_read_items"
  ON items
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "allow_insert_items" ON items;
CREATE POLICY "allow_insert_items"
  ON items
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 4. Fix products table RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_read_products" ON products;
CREATE POLICY "allow_read_products"
  ON products
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "allow_insert_products" ON products;
CREATE POLICY "allow_insert_products"
  ON products
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 5. Fix transactions table RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_read_transactions" ON transactions;
CREATE POLICY "allow_read_transactions"
  ON transactions
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "allow_insert_transactions" ON transactions;
CREATE POLICY "allow_insert_transactions"
  ON transactions
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Verification: Check all policies
SELECT table_name, policy_name, definition FROM pg_policies 
WHERE table_name IN ('activity_logs', 'items', 'products', 'transactions')
ORDER BY table_name, policy_name;
