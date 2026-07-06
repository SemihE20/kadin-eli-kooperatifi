-- ==========================================
-- Kadın Eli Kooperatifi — Veritabanı Migration
-- Supabase SQL Editor'de çalıştırın
-- ==========================================

-- ==========================================
-- 1) PROFILES (Supabase Auth ile entegre)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address JSONB,           -- ShippingAddress JSON objesi
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Yeni kullanıcı kayıt olduğunda otomatik profil oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$

BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auth.users'a yeni kayıt geldiğinde çalışır
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 2) CATEGORIES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 3) PRODUCTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category TEXT CHECK (category IN ('bitki', 'gida', 'fidan')),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_seasonal BOOLEAN NOT NULL DEFAULT false,
  season_info TEXT,          -- Mevsim bilgisi (ör: "Mart - Mayıs")
  usage_info TEXT,           -- Kullanım bilgisi
  storage_info TEXT,         -- Saklama koşulları
  weight NUMERIC(8,2),
  image_url TEXT,            -- Ana ürün görseli
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 4) PRODUCT_IMAGES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false
);

-- ==========================================
-- 5) ORDERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'beklemede'
    CHECK (status IN ('beklemede', 'onaylandi', 'kargoda', 'teslim_edildi', 'iptal')),
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_address JSONB,
  payment_method TEXT CHECK (payment_method IN ('havale_eft', 'kapida_odeme')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Otomatik sipariş numarası oluşturma
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'KE-' || TO_CHAR(now(), 'YYYYMMDD') || '-' ||
                        LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 6) ORDER_ITEMS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);

-- ==========================================
-- 7) REVIEWS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Aynı ürüne aynı kullanıcı yalnızca bir yorum yapabilir
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_user_product
  ON public.reviews(product_id, user_id);

-- ==========================================
-- 8) NEWSLETTER_SUBSCRIBERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) KURALLARI
-- ==========================================

-- Yardımcı fonksiyon: Kullanıcının rolünü döndürür
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ---------- PROFILES ----------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiller herkese açık okuma" ON public.profiles;
CREATE POLICY "Profiller herkese açık okuma"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Kullanıcılar kendi profilini günceller" ON public.profiles;
CREATE POLICY "Kullanıcılar kendi profilini günceller"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ---------- CATEGORIES ----------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kategoriler herkese açık okuma" ON public.categories;
CREATE POLICY "Kategoriler herkese açık okuma"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Kategoriler sadece admin ekler" ON public.categories;
CREATE POLICY "Kategoriler sadece admin ekler"
  ON public.categories FOR INSERT
  WITH CHECK (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Kategoriler sadece admin günceller" ON public.categories;
CREATE POLICY "Kategoriler sadece admin günceller"
  ON public.categories FOR UPDATE
  USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Kategoriler sadece admin siler" ON public.categories;
CREATE POLICY "Kategoriler sadece admin siler"
  ON public.categories FOR DELETE
  USING (public.get_user_role() = 'admin');


-- ---------- PRODUCTS ----------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ürünler herkese açık okuma" ON public.products;
CREATE POLICY "Ürünler herkese açık okuma"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Ürün ekleme sadece admin" ON public.products;
CREATE POLICY "Ürün ekleme sadece admin"
  ON public.products FOR INSERT
  WITH CHECK (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Ürün güncelleme sadece admin" ON public.products;
CREATE POLICY "Ürün güncelleme sadece admin"
  ON public.products FOR UPDATE
  USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Ürün silme sadece admin" ON public.products;
CREATE POLICY "Ürün silme sadece admin"
  ON public.products FOR DELETE
  USING (public.get_user_role() = 'admin');


-- ---------- PRODUCT_IMAGES ----------
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ürün görselleri herkese açık okuma" ON public.product_images;
CREATE POLICY "Ürün görselleri herkese açık okuma"
  ON public.product_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Ürün görseli ekleme sadece admin" ON public.product_images;
CREATE POLICY "Ürün görseli ekleme sadece admin"
  ON public.product_images FOR INSERT
  WITH CHECK (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Ürün görseli güncelleme sadece admin" ON public.product_images;
CREATE POLICY "Ürün görseli güncelleme sadece admin"
  ON public.product_images FOR UPDATE
  USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Ürün görseli silme sadece admin" ON public.product_images;
CREATE POLICY "Ürün görseli silme sadece admin"
  ON public.product_images FOR DELETE
  USING (public.get_user_role() = 'admin');


-- ---------- ORDERS ----------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kullanıcı kendi siparişlerini görür" ON public.orders;
CREATE POLICY "Kullanıcı kendi siparişlerini görür"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kullanıcı sipariş oluşturur" ON public.orders;
CREATE POLICY "Kullanıcı sipariş oluşturur"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kullanıcı kendi siparişini günceller" ON public.orders;
CREATE POLICY "Kullanıcı kendi siparişini günceller"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin tüm siparişleri görür" ON public.orders;
CREATE POLICY "Admin tüm siparişleri görür"
  ON public.orders FOR SELECT
  USING (public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Admin tüm siparişleri günceller" ON public.orders;
CREATE POLICY "Admin tüm siparişleri günceller"
  ON public.orders FOR UPDATE
  USING (public.get_user_role() = 'admin');


-- ---------- ORDER_ITEMS ----------
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kullanıcı kendi sipariş kalemlerini görür" ON public.order_items;
CREATE POLICY "Kullanıcı kendi sipariş kalemlerini görür"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Kullanıcı sipariş kalemi ekler" ON public.order_items;
CREATE POLICY "Kullanıcı sipariş kalemi ekler"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admin tüm sipariş kalemlerini görür" ON public.order_items;
CREATE POLICY "Admin tüm sipariş kalemlerini görür"
  ON public.order_items FOR SELECT
  USING (public.get_user_role() = 'admin');


-- ---------- REVIEWS ----------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Yorumlar herkese açık okuma" ON public.reviews;
CREATE POLICY "Yorumlar herkese açık okuma"
  ON public.reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Giriş yapmış kullanıcı yorum ekler" ON public.reviews;
CREATE POLICY "Giriş yapmış kullanıcı yorum ekler"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kullanıcı kendi yorumunu günceller" ON public.reviews;
CREATE POLICY "Kullanıcı kendi yorumunu günceller"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kullanıcı kendi yorumunu siler" ON public.reviews;
CREATE POLICY "Kullanıcı kendi yorumunu siler"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin yorum siler" ON public.reviews;
CREATE POLICY "Admin yorum siler"
  ON public.reviews FOR DELETE
  USING (public.get_user_role() = 'admin');


-- ---------- NEWSLETTER_SUBSCRIBERS ----------
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Herkes bülten abonesi olabilir" ON public.newsletter_subscribers;
CREATE POLICY "Herkes bülten abonesi olabilir"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin bülten abonelerini görür" ON public.newsletter_subscribers;
CREATE POLICY "Admin bülten abonelerini görür"
  ON public.newsletter_subscribers FOR SELECT
  USING (public.get_user_role() = 'admin');


-- ==========================================
-- INDEXLER (Performans)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);


-- ==========================================
-- BAŞLANGIÇ VERİLERİ
-- ==========================================

-- Varsayılan kategoriler
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Tıbbi ve Aromatik Bitkiler', 'bitki', 'Doğal ortamda yetişen tıbbi ve aromatik bitkiler', 1),
  ('Gıda Ürünleri', 'gida', 'El yapımı, doğal gıda ürünleri', 2),
  ('Fidan ve Tohum', 'fidan', 'Meyve fidanları, tohum çeşitleri', 3)
ON CONFLICT (slug) DO NOTHING;


-- ==========================================
-- TAMAMLANDI ✓
-- ==========================================
-- Bu scripti Supabase Dashboard > SQL Editor'de çalıştırın.
-- Tüm tablolar, RLS kuralları ve indexler oluşturulacaktır.
