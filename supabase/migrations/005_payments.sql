-- ==========================================
-- Kadın Eli Kooperatifi — Ödeme Entegrasyonu
-- Supabase SQL Editor'de çalıştırın
-- ==========================================
--
-- Checkout akışına kredi/banka kartı (iyzico veya test/mock modu) ödeme
-- seçeneği ekler ve misafir (giriş yapmamış) siparişler için gerekli
-- INSERT politikalarını tanımlar. Sipariş kaydı bizzat /api/checkout/pay
-- route'u tarafından service-role istemciyle (RLS'i bypass ederek)
-- oluşturulur; bu politikalar yine de savunma derinliği ve olası
-- client-taraflı ekleme senaryoları için tutulur.

-- Ödeme yöntemi seçeneklerine kredi/banka kartını ekle
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('havale_eft', 'kapida_odeme', 'kredi_karti'));

-- Ödeme sağlayıcısından dönen işlem referansını saklamak için sütun
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- ---------- Misafir Sipariş — INSERT politikaları ----------
DROP POLICY IF EXISTS "Misafir sipariş oluşturabilir" ON public.orders;
CREATE POLICY "Misafir sipariş oluşturabilir"
  ON public.orders FOR INSERT
  WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "Misafir sipariş kalemi ekleyebilir" ON public.order_items;
CREATE POLICY "Misafir sipariş kalemi ekleyebilir"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id IS NULL
    )
  );

-- ==========================================
-- TAMAMLANDI ✓
-- ==========================================
