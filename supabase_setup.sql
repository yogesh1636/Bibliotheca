-- =====================================================
-- WebReader - Supabase Database Setup
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

-- 1. CREATE TABLES
-- =====================================================

-- Books Table
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage INTEGER DEFAULT 0,
  description TEXT,
  cover_image VARCHAR(500),
  category VARCHAR(100),
  isbn VARCHAR(20) UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items Table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist Table
CREATE TABLE wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Books Table (Public Read)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Books are viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can modify books" ON books FOR ALL USING (auth.role() = 'authenticated');

-- Profiles Table (User-specific)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Cart Items Table (User-specific)
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders Table (User-specific)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items Table (User-specific via orders)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Wishlist Table (User-specific)
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- 3. CREATE FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-create profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Order number generation
CREATE SEQUENCE order_sequence START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
         LPAD(NEXTVAL('order_sequence')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 4. INSERT SAMPLE DATA
-- =====================================================

INSERT INTO books (title, author, price, original_price, discount_percentage, description, cover_image, category, featured) VALUES
('Bakemonogatari', 'Nisio Isin', 499.00, 599.00, 17, 'A supernatural mystery novel', 'covers/bakemonogatari.jpeg', 'Fiction', true),
('Classroom of the Elite', 'Syougo Kinugasa', 399.00, 499.00, 20, 'A psychological thriller set in an elite school', 'covers/classroomofelites.png', 'Fiction', true),
('It Starts With Us', 'Colleen Hoover', 299.00, 399.00, 25, 'A romantic drama sequel', 'covers/itstartswithus.jpeg', 'Romance', true),
('No Longer Human', 'Osamu Dazai', 349.00, 449.00, 22, 'A classic Japanese novel', 'covers/nolongerhuman.jpeg', 'Fiction', false),
('Out', 'Natsuo Kirino', 399.00, 499.00, 20, 'A dark crime thriller', 'covers/out.jpeg', 'Fiction', false),
('The Wind-Up Bird Chronicle', 'Haruki Murakami', 599.00, 799.00, 25, 'A surreal masterpiece', 'covers/thewindupbird.png', 'Fiction', true),
('SAO Alicization', 'Reki Kawahara', 599.00, 699.00, 14, 'Virtual reality adventure', 'covers/SAOAlici.jpeg', 'Fantasy', true),
('Atomic Habits', 'James Clear', 499.00, 599.00, 17, 'Transform your life with tiny changes', 'covers/atomichabits.jpg', 'Self-Help', false);

-- =====================================================
-- Setup Complete! 
-- Your WebReader database is ready to use.
-- =====================================================