-- Signature Connect Inventory System - Supabase Schema
-- Created: April 15, 2026

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('Admin', 'Staff')) DEFAULT 'Staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table (inventory items with serial numbers)
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number TEXT NOT NULL UNIQUE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('IN_STORE', 'IN_FIELD', 'RETURNED', 'FAULTY')) DEFAULT 'IN_STORE',
  assigned_to TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE,
  serial_number TEXT NOT NULL REFERENCES items(serial_number) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name TEXT,
  condition TEXT,
  approval_status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs table (audit trail)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'LOGIN',
    'LOGOUT',
    'VIEW_PRODUCT',
    'VIEW_ITEM',
    'SCAN_QR',
    'ADD_STOCK',
    'ISSUE_ITEM',
    'RETURN_ITEM',
    'MARK_FAULTY'
  )),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  serial_number TEXT REFERENCES items(serial_number) ON DELETE CASCADE,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_items_product_id ON items(product_id);
CREATE INDEX idx_items_serial_number ON items(serial_number);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_transactions_serial_number ON transactions(serial_number);
CREATE INDEX idx_transactions_product_id ON transactions(product_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_product_id ON activity_logs(product_id);
CREATE INDEX idx_activity_logs_serial_number ON activity_logs(serial_number);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Row Level Security (RLS) - Enable it
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- RLS Policies for products (authenticated users can view)
CREATE POLICY "Authenticated users can view products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for items (authenticated users can view)
CREATE POLICY "Authenticated users can view items" ON items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert items" ON items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update item status" ON items
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for transactions
CREATE POLICY "Authenticated users can view transactions" ON transactions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for activity_logs
CREATE POLICY "Authenticated users can view activity logs" ON activity_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert activity logs" ON activity_logs
  FOR INSERT WITH CHECK (true);

-- Function: Add new user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Log transaction as activity
CREATE OR REPLACE FUNCTION public.log_activity_on_transaction()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  product_name TEXT;
  item_serial TEXT;
  action_message TEXT;
BEGIN
  -- Get user name
  SELECT u.name INTO user_name FROM users u WHERE u.id = NEW.user_id;
  
  -- Get product name
  SELECT p.name INTO product_name FROM products p WHERE p.id = NEW.product_id;
  
  -- Get serial number
  SELECT i.serial_number INTO item_serial FROM items i WHERE i.serial_number = NEW.serial_number;
  
  -- Generate message based on action
  CASE NEW.action
    WHEN 'ADD_STOCK' THEN
      action_message := user_name || ' added stock: ' || product_name;
    WHEN 'ISSUE_ITEM' THEN
      action_message := user_name || ' issued ' || item_serial || ' to ' || COALESCE(NEW.customer_name, 'unknown');
    WHEN 'RETURN_ITEM' THEN
      action_message := user_name || ' returned ' || item_serial || ' (' || COALESCE(NEW.condition, 'unknown') || ')';
    WHEN 'MARK_FAULTY' THEN
      action_message := user_name || ' marked ' || item_serial || ' as faulty';
    ELSE
      action_message := user_name || ' ' || NEW.action;
  END CASE;
  
  -- Insert activity log
  INSERT INTO activity_logs (
    user_id,
    user_name,
    action,
    product_id,
    serial_number,
    description,
    metadata
  ) VALUES (
    NEW.user_id,
    user_name,
    NEW.action,
    NEW.product_id,
    NEW.serial_number,
    action_message,
    jsonb_build_object('transaction_id', NEW.id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Log all transactions
CREATE TRIGGER trigger_log_activity_on_transaction
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_activity_on_transaction();
