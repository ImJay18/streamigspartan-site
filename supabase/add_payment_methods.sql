-- ============================================================
-- STREAMING SPARTAN — Métodos de pago
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS payment_methods (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  active        BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at
CREATE TRIGGER payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_payment_methods" ON payment_methods FOR SELECT USING (true);
CREATE POLICY "admin_all_payment_methods"   ON payment_methods FOR ALL   USING (auth.role() = 'authenticated');

-- Seed inicial
INSERT INTO payment_methods (name, active, display_order) VALUES
  ('VISA',       true, 1),
  ('Mastercard', true, 2),
  ('PayPal',     true, 3),
  ('Nequi',      true, 4),
  ('Daviplata',  true, 5),
  ('Binance',    true, 6),
  ('PayPhone',   true, 7)
ON CONFLICT DO NOTHING;

-- Verificar
SELECT * FROM payment_methods ORDER BY display_order;
