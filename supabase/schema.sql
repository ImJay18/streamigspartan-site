-- ============================================================
-- STREAMING SPARTAN — Supabase Schema
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- 1. PLATFORMS
-- ============================================================
CREATE TABLE IF NOT EXISTS platforms (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  logo_url      TEXT NOT NULL,
  plan_type     TEXT NOT NULL DEFAULT 'Premium',
  features      TEXT[] NOT NULL DEFAULT '{}',
  price         DECIMAL(10,2) NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COMBOS
-- ============================================================
CREATE TABLE IF NOT EXISTS combos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  platform_names  TEXT[] NOT NULL DEFAULT '{}',
  platform_logos  TEXT[] NOT NULL DEFAULT '{}',
  price           DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price  DECIMAL(10,2) NOT NULL DEFAULT 0,
  badge_text      TEXT NOT NULL DEFAULT '',
  badge_color     TEXT NOT NULL DEFAULT 'purple',
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  active          BOOLEAN NOT NULL DEFAULT true,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. SITE SETTINGS (clave-valor)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. FAQS
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TRIGGERS — updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER platforms_updated_at BEFORE UPDATE ON platforms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER combos_updated_at BEFORE UPDATE ON combos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 6. RLS — Row Level Security
-- ============================================================
ALTER TABLE platforms     ENABLE ROW LEVEL SECURITY;
ALTER TABLE combos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs          ENABLE ROW LEVEL SECURITY;

-- Lectura pública (landing page)
CREATE POLICY "public_read_platforms"     ON platforms     FOR SELECT USING (true);
CREATE POLICY "public_read_combos"        ON combos        FOR SELECT USING (true);
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "public_read_faqs"          ON faqs          FOR SELECT USING (true);

-- Escritura solo autenticados (admin)
CREATE POLICY "admin_all_platforms"     ON platforms     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_combos"        ON combos        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_faqs"          ON faqs          FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 7. SEED — Datos iniciales
-- ============================================================

-- Plataformas
INSERT INTO platforms (name, logo_url, plan_type, features, price, active, display_order) VALUES
  ('Netflix',     'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', 'Premium', ARRAY['4K Ultra HD', 'Perfiles ilimitados', 'Renovación fácil'], 4.50, true, 1),
  ('Disney+',     'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',   'Premium', ARRAY['4K Ultra HD', 'Perfiles ilimitados', 'Contenido exclusivo'], 4.00, true, 2),
  ('Prime Video', 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg', 'Premium', ARRAY['4K Ultra HD', 'Envíos rápidos', 'Películas y series'], 4.00, true, 3),
  ('HBO Max',     'https://upload.wikimedia.org/wikipedia/commons/1/15/HBO_Max_Logo.svg',      'Premium', ARRAY['4K Ultra HD', 'Contenido exclusivo', 'Estrenos recientes'], 4.50, true, 4),
  ('Spotify',     'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg', 'Premium', ARRAY['Música sin anuncios', 'Descargas ilimitadas', 'Alta calidad'], 2.50, true, 5);

-- Combos
INSERT INTO combos (name, description, platform_names, price, original_price, badge_text, badge_color, is_featured, active, display_order) VALUES
  ('Combo Básico',    'Netflix + Disney+',                        ARRAY['Netflix', 'Disney+'],                        7.99,  9.50,  'Más vendido', 'purple',  true,  1),
  ('Combo Estándar',  'Netflix + Disney+ + Prime Video',          ARRAY['Netflix', 'Disney+', 'Prime Video'],         10.99, 13.50, 'Ahorra 35%',  'magenta', false, 2),
  ('Combo Premium',   'Netflix + Disney+ + Prime Video + HBO Max',ARRAY['Netflix', 'Disney+', 'Prime Video', 'HBO Max'], 14.99, 17.50, 'Ahorra 40%',  'magenta', false, 3);

-- Configuración general
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number',  '3207685459'),
  ('hero_title',       'Todo el entretenimiento que quieres, en un solo lugar.'),
  ('hero_subtitle',    'Disfruta tus plataformas favoritas con planes premium al mejor precio.'),
  ('total_clients',    '2000'),
  ('site_name',        'Streaming Spartan'),
  ('site_description', 'Tu mejor opción para acceder a las mejores plataformas de streaming al mejor precio.');

-- FAQs
INSERT INTO faqs (question, answer, display_order, active) VALUES
  ('¿Cómo recibo mi cuenta?',       'Una vez realizado el pago, te enviamos los accesos directamente por WhatsApp en minutos.', 1, true),
  ('¿Cuánto tarda la activación?',  'La activación es inmediata. Generalmente en menos de 15 minutos tienes tu acceso activo.', 2, true),
  ('¿Puedo renovar mi suscripción?','Sí, la renovación es fácil y rápida. Te notificamos antes de que venza tu plan.', 3, true),
  ('¿Tienen soporte técnico?',      'Sí, contamos con soporte personalizado vía WhatsApp disponible para ayudarte cuando lo necesites.', 4, true);

-- ============================================================
-- 8. ADMIN USER — Crear en Supabase Auth Dashboard
-- Email:    imjay18@streamingspartan.com
-- Password: Maylogordo18
-- O ejecutar via API desde el dashboard de Supabase Auth
-- ============================================================
