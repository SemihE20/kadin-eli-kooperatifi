-- ==========================================
-- Kadın Eli Kooperatifi — Ürün Görselleri Storage Bucket
-- Supabase SQL Editor'de çalıştırın
-- ==========================================
--
-- Admin panelinden yüklenen (arka planı kaldırılmış) ürün görsellerinin
-- saklanacağı public-read, admin-write bir Storage bucket'ı oluşturur.

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Herkes görselleri okuyabilir (ürün sayfalarında gösterilecek)
DROP POLICY IF EXISTS "Ürün görselleri herkese açık okuma (storage)" ON storage.objects;
CREATE POLICY "Ürün görselleri herkese açık okuma (storage)"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Sadece admin yükleyebilir
DROP POLICY IF EXISTS "Ürün görseli yükleme sadece admin (storage)" ON storage.objects;
CREATE POLICY "Ürün görseli yükleme sadece admin (storage)"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.get_user_role() = 'admin');

-- Sadece admin güncelleyebilir
DROP POLICY IF EXISTS "Ürün görseli güncelleme sadece admin (storage)" ON storage.objects;
CREATE POLICY "Ürün görseli güncelleme sadece admin (storage)"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.get_user_role() = 'admin');

-- Sadece admin silebilir
DROP POLICY IF EXISTS "Ürün görseli silme sadece admin (storage)" ON storage.objects;
CREATE POLICY "Ürün görseli silme sadece admin (storage)"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.get_user_role() = 'admin');

-- ==========================================
-- TAMAMLANDI ✓
-- ==========================================
