-- ============================================================
-- Seminara Inmobiliaria — Schema inicial
-- ============================================================
-- Ejecutar en Supabase SQL Editor o via CLI:
--   supabase db push
-- ============================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- búsqueda full-text

-- ──────────────────────────────────────────────────────────
-- TABLA: propiedades (se crea primero por FK en leads)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS propiedades (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  titulo             TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  descripcion        TEXT,
  tipo               TEXT CHECK (tipo IN ('casa','departamento','terreno','local','oficina')),
  operacion          TEXT CHECK (operacion IN ('venta','alquiler','venta_alquiler')),
  precio             NUMERIC(14,2),
  moneda             TEXT NOT NULL DEFAULT 'USD' CHECK (moneda IN ('USD','ARS')),
  superficie_total   NUMERIC(10,2),
  superficie_cubierta NUMERIC(10,2),
  ambientes          SMALLINT CHECK (ambientes > 0),
  dormitorios        SMALLINT CHECK (dormitorios >= 0),
  banos              SMALLINT CHECK (banos > 0),
  direccion          TEXT,
  barrio             TEXT,
  ciudad             TEXT,
  provincia          TEXT,
  latitud            DOUBLE PRECISION,
  longitud           DOUBLE PRECISION,
  imagenes           TEXT[] NOT NULL DEFAULT '{}',
  destacada          BOOLEAN NOT NULL DEFAULT FALSE,
  publicada          BOOLEAN NOT NULL DEFAULT FALSE,
  caracteristicas    TEXT[] NOT NULL DEFAULT '{}'
);

-- ──────────────────────────────────────────────────────────
-- TABLA: leads
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  nombre             TEXT NOT NULL,
  email              TEXT NOT NULL,
  telefono           TEXT,
  intencion          TEXT CHECK (intencion IN ('comprar','vender','alquilar')),
  presupuesto_rango  TEXT,
  zona_interes       TEXT,
  mensaje            TEXT,
  estado             TEXT NOT NULL DEFAULT 'nuevo'
                       CHECK (estado IN ('nuevo','contactado','calificado','descartado','cerrado')),
  propiedad_id       UUID REFERENCES propiedades(id) ON DELETE SET NULL,
  notas_internas     TEXT,
  ultima_interaccion TIMESTAMPTZ
);

-- ──────────────────────────────────────────────────────────
-- ÍNDICES
-- ──────────────────────────────────────────────────────────
-- Propiedades
CREATE INDEX IF NOT EXISTS idx_propiedades_slug       ON propiedades(slug);
CREATE INDEX IF NOT EXISTS idx_propiedades_publicada  ON propiedades(publicada);
CREATE INDEX IF NOT EXISTS idx_propiedades_destacada  ON propiedades(destacada) WHERE destacada = TRUE;
CREATE INDEX IF NOT EXISTS idx_propiedades_tipo       ON propiedades(tipo);
CREATE INDEX IF NOT EXISTS idx_propiedades_operacion  ON propiedades(operacion);
CREATE INDEX IF NOT EXISTS idx_propiedades_created_at ON propiedades(created_at DESC);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_estado      ON leads(estado);
CREATE INDEX IF NOT EXISTS idx_leads_intencion   ON leads(intencion);
CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email       ON leads(email);

-- Búsqueda trigram en propiedades
CREATE INDEX IF NOT EXISTS idx_propiedades_titulo_trgm
  ON propiedades USING GIN (titulo gin_trgm_ops);

-- ──────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads       ENABLE ROW LEVEL SECURITY;

-- ── Propiedades ──
-- SELECT público: solo propiedades publicadas
CREATE POLICY "propiedades_select_publico"
  ON propiedades FOR SELECT
  USING (publicada = TRUE);

-- SELECT admin: ver todas (incluyendo no publicadas)
CREATE POLICY "propiedades_select_admin"
  ON propiedades FOR SELECT
  TO authenticated
  USING (TRUE);

-- INSERT / UPDATE / DELETE: solo usuarios autenticados
CREATE POLICY "propiedades_insert_admin"
  ON propiedades FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "propiedades_update_admin"
  ON propiedades FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "propiedades_delete_admin"
  ON propiedades FOR DELETE
  TO authenticated
  USING (TRUE);

-- ── Leads ──
-- INSERT público: cualquiera puede crear un lead
CREATE POLICY "leads_insert_publico"
  ON leads FOR INSERT
  WITH CHECK (TRUE);

-- SELECT: solo usuarios autenticados
CREATE POLICY "leads_select_admin"
  ON leads FOR SELECT
  TO authenticated
  USING (TRUE);

-- UPDATE: solo usuarios autenticados
CREATE POLICY "leads_update_admin"
  ON leads FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- DELETE: solo usuarios autenticados
CREATE POLICY "leads_delete_admin"
  ON leads FOR DELETE
  TO authenticated
  USING (TRUE);

-- ──────────────────────────────────────────────────────────
-- STORAGE BUCKET
-- ──────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'propiedades-imagenes',
  'propiedades-imagenes',
  TRUE,
  10485760, -- 10 MB por archivo
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Política storage: upload solo autenticados
CREATE POLICY "storage_upload_admin"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'propiedades-imagenes');

-- Política storage: lectura pública
CREATE POLICY "storage_select_publico"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'propiedades-imagenes');

-- Política storage: delete solo autenticados
CREATE POLICY "storage_delete_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'propiedades-imagenes');
