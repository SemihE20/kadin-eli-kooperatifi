-- ==========================================
-- Kadın Eli Kooperatifi — Profiles Rol Güvenliği
-- Supabase SQL Editor'de çalıştırın
-- ==========================================
--
-- Mevcut "Kullanıcılar kendi profilini günceller" politikası, bir kullanıcının
-- kendi `role` sütununu da değiştirmesine izin veriyordu (ör. tarayıcı konsolundan
-- `supabase.from('profiles').update({ role: 'admin' })` çağrısıyla admin olabilirdi).
-- Bu migration, rol değişikliğini yalnızca adminlerin (veya service_role anahtarının)
-- yapabilmesini sağlayan bir trigger ekler ve adminlerin başka kullanıcıların
-- profilini güncelleyebilmesi için ayrı bir RLS politikası tanımlar.

-- Rolü sadece admin (veya service_role) değiştirebilir; aksi halde eski değeri korur
CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND public.get_user_role() IS DISTINCT FROM 'admin'
     AND auth.role() IS DISTINCT FROM 'service_role' THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_role_change_admin_only ON public.profiles;
CREATE TRIGGER enforce_role_change_admin_only
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_escalation();

-- Adminler herhangi bir kullanıcının profilini güncelleyebilsin
-- (mevcut politika yalnızca auth.uid() = id şartıyla kendi profiline izin veriyordu)
DROP POLICY IF EXISTS "Admin tüm profilleri günceller" ON public.profiles;
CREATE POLICY "Admin tüm profilleri günceller"
  ON public.profiles FOR UPDATE
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- ==========================================
-- TAMAMLANDI ✓
-- ==========================================
