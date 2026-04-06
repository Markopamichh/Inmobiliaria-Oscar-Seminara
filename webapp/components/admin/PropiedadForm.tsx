"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { generateSlug } from "@/lib/utils";
import { PropiedadSchema } from "@/lib/validations/propiedad";
import type { Propiedad } from "@/types/propiedad";

interface PropiedadFormProps {
  propiedad?: Propiedad;
}

type FormErrors = Partial<Record<string, string>>;

export function PropiedadForm({ propiedad }: PropiedadFormProps) {
  const router = useRouter();
  const isEditing = !!propiedad;

  const [titulo, setTitulo] = useState(propiedad?.titulo ?? "");
  const [slug, setSlug] = useState(propiedad?.slug ?? "");
  const [descripcion, setDescripcion] = useState(propiedad?.descripcion ?? "");
  const [tipo, setTipo] = useState(propiedad?.tipo ?? "");
  const [operacion, setOperacion] = useState(propiedad?.operacion ?? "");
  const [precio, setPrecio] = useState(propiedad?.precio?.toString() ?? "");
  const [moneda, setMoneda] = useState(propiedad?.moneda ?? "USD");
  const [superficieTotal, setSuperficieTotal] = useState(
    propiedad?.superficie_total?.toString() ?? ""
  );
  const [superficieCubierta, setSuperficieCubierta] = useState(
    propiedad?.superficie_cubierta?.toString() ?? ""
  );
  const [ambientes, setAmbientes] = useState(
    propiedad?.ambientes?.toString() ?? ""
  );
  const [dormitorios, setDormitorios] = useState(
    propiedad?.dormitorios?.toString() ?? ""
  );
  const [banos, setBanos] = useState(propiedad?.banos?.toString() ?? "");
  const [direccion, setDireccion] = useState(propiedad?.direccion ?? "");
  const [barrio, setBarrio] = useState(propiedad?.barrio ?? "");
  const [ciudad, setCiudad] = useState(propiedad?.ciudad ?? "");
  const [provincia, setProvincia] = useState(propiedad?.provincia ?? "");
  const [imagenes, setImagenes] = useState<string[]>(propiedad?.imagenes ?? []);
  const [destacada, setDestacada] = useState(propiedad?.destacada ?? false);
  const [publicada, setPublicada] = useState(propiedad?.publicada ?? false);
  const [caracteristicas, setCaracteristicas] = useState(
    propiedad?.caracteristicas?.join(", ") ?? ""
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  function handleTituloChange(value: string) {
    setTitulo(value);
    if (!isEditing) setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const raw = {
      titulo,
      slug,
      descripcion: descripcion || null,
      tipo: tipo || null,
      operacion: operacion || null,
      precio: precio ? parseFloat(precio) : null,
      moneda,
      superficie_total: superficieTotal ? parseFloat(superficieTotal) : null,
      superficie_cubierta: superficieCubierta ? parseFloat(superficieCubierta) : null,
      ambientes: ambientes ? parseInt(ambientes, 10) : null,
      dormitorios: dormitorios ? parseInt(dormitorios, 10) : null,
      banos: banos ? parseInt(banos, 10) : null,
      direccion: direccion || null,
      barrio: barrio || null,
      ciudad: ciudad || null,
      provincia: provincia || null,
      latitud: null,
      longitud: null,
      imagenes,
      destacada,
      publicada,
      caracteristicas: caracteristicas
        ? caracteristicas.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
    };

    const result = PropiedadSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString();
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    const supabase = createClient();

    if (isEditing) {
      await supabase
        .from("propiedades")
        .update(result.data)
        .eq("id", propiedad.id);
    } else {
      await supabase.from("propiedades").insert(result.data);
    }

    setSaving(false);
    router.push("/admin/propiedades");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Información básica */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Información básica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Título *"
              value={titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              error={errors.titulo}
              placeholder="Casa con jardín en Plottier"
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Slug (URL)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              error={errors.slug}
              hint="Se genera automáticamente. Ejemplo: casa-con-jardin-en-plottier"
            />
          </div>
          <Select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={[
              { value: "casa", label: "Casa" },
              { value: "departamento", label: "Departamento" },
              { value: "terreno", label: "Terreno" },
              { value: "local", label: "Local comercial" },
              { value: "oficina", label: "Oficina" },
            ]}
            placeholder="Seleccioná tipo"
          />
          <Select
            label="Operación"
            value={operacion}
            onChange={(e) => setOperacion(e.target.value)}
            options={[
              { value: "venta", label: "Venta" },
              { value: "alquiler", label: "Alquiler" },
              { value: "venta_alquiler", label: "Venta y alquiler" },
            ]}
            placeholder="Seleccioná operación"
          />
          <Input
            label="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            error={errors.precio}
            placeholder="150000"
          />
          <Select
            label="Moneda"
            value={moneda}
            onChange={(e) => setMoneda(e.target.value as "USD" | "ARS")}
            options={[
              { value: "USD", label: "USD" },
              { value: "ARS", label: "ARS" },
            ]}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-stone-700 block mb-1.5">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            placeholder="Describí la propiedad en detalle…"
            className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
          />
        </div>
      </section>

      {/* Detalles técnicos */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Detalles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Input
            label="Sup. total (m²)"
            type="number"
            value={superficieTotal}
            onChange={(e) => setSuperficieTotal(e.target.value)}
          />
          <Input
            label="Sup. cubierta (m²)"
            type="number"
            value={superficieCubierta}
            onChange={(e) => setSuperficieCubierta(e.target.value)}
          />
          <Input
            label="Ambientes"
            type="number"
            value={ambientes}
            onChange={(e) => setAmbientes(e.target.value)}
          />
          <Input
            label="Dormitorios"
            type="number"
            value={dormitorios}
            onChange={(e) => setDormitorios(e.target.value)}
          />
          <Input
            label="Baños"
            type="number"
            value={banos}
            onChange={(e) => setBanos(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Input
            label="Características (separadas por coma)"
            value={caracteristicas}
            onChange={(e) => setCaracteristicas(e.target.value)}
            placeholder="Pileta, garage doble, parrilla, seguridad 24hs"
            hint="Ingresá cada característica separada por coma"
          />
        </div>
      </section>

      {/* Ubicación */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Ubicación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Av. Argentina 1234"
            />
          </div>
          <Input
            label="Barrio"
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            placeholder="Alta Barda"
          />
          <Input
            label="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            placeholder="Neuquén"
          />
          <Input
            label="Provincia"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            placeholder="Neuquén"
          />
        </div>
      </section>

      {/* Imágenes */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Imágenes</h2>
        <ImageUploader images={imagenes} onChange={setImagenes} />
      </section>

      {/* Opciones de publicación */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Publicación</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={publicada}
              onChange={(e) => setPublicada(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-stone-700">Publicar en el sitio web</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={destacada}
              onChange={(e) => setDestacada(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-stone-700">Marcar como destacada</span>
          </label>
        </div>
      </section>

      <div className="flex gap-3 justify-end pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/propiedades")}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {isEditing ? "Guardar cambios" : "Crear propiedad"}
        </Button>
      </div>
    </form>
  );
}
