-- ==========================================
-- 002: Blog Yazıları (posts) Tablosu
-- Supabase SQL Editor'de çalıştırın (001'den sonra)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.posts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  summary      TEXT,
  content      TEXT        NOT NULL DEFAULT '',
  cover_image  TEXT,
  category     TEXT        NOT NULL DEFAULT 'Genel',
  author       TEXT        NOT NULL DEFAULT 'Kooperatif Ekibi',
  read_time    INTEGER     NOT NULL DEFAULT 5,
  is_published BOOLEAN     NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at otomatik güncelleme (update_updated_at_column 001'de tanımlandı)
DROP TRIGGER IF EXISTS set_posts_updated_at ON public.posts;
CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog yazıları yayınlandıysa herkese açık"
  ON public.posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin tüm blog yazılarını görür"
  ON public.posts FOR SELECT
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Admin blog yazısı ekler"
  ON public.posts FOR INSERT
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "Admin blog yazısı günceller"
  ON public.posts FOR UPDATE
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Admin blog yazısı siler"
  ON public.posts FOR DELETE
  USING (public.get_user_role() = 'admin');

-- ==========================================
-- İNDEXLER
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_posts_slug         ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON public.posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_category     ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
