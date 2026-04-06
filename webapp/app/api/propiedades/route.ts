import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PropiedadSchema, PropiedadFilterSchema } from "@/lib/validations/propiedad";

// GET — público, con filtros
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawParams: Record<string, string> = {};
  searchParams.forEach((v, k) => { rawParams[k] = v; });

  const filters = PropiedadFilterSchema.parse(rawParams);
  const from = (filters.page - 1) * filters.per_page;
  const to = from + filters.per_page - 1;

  const supabase = await createClient();

  let query = supabase
    .from("propiedades")
    .select("*", { count: "exact" })
    .eq("publicada", true)
    .order("destacada", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.tipo) query = query.eq("tipo", filters.tipo);
  if (filters.operacion) query = query.eq("operacion", filters.operacion);
  if (filters.ciudad) query = query.ilike("ciudad", `%${filters.ciudad}%`);
  if (filters.barrio) query = query.ilike("barrio", `%${filters.barrio}%`);
  if (filters.precio_min) query = query.gte("precio", filters.precio_min);
  if (filters.precio_max) query = query.lte("precio", filters.precio_max);
  if (filters.ambientes_min) query = query.gte("ambientes", filters.ambientes_min);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Error al obtener propiedades." }, { status: 500 });
  }

  return NextResponse.json({
    data,
    meta: {
      total: count ?? 0,
      page: filters.page,
      per_page: filters.per_page,
      total_pages: Math.ceil((count ?? 0) / filters.per_page),
    },
  });
}

// POST — protegido (solo admin)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const result = PropiedadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", issues: result.error.issues },
      { status: 422 }
    );
  }

  const { data, error } = await supabase
    .from("propiedades")
    .insert(result.data)
    .select("id,slug")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "El slug ya está en uso." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Error al crear la propiedad." }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PATCH — protegido (solo admin)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const { id, ...rest } = body as { id?: string; [key: string]: unknown };
  if (!id) {
    return NextResponse.json({ error: "Se requiere el campo id." }, { status: 400 });
  }

  const result = PropiedadSchema.partial().safeParse(rest);
  if (!result.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", issues: result.error.issues },
      { status: 422 }
    );
  }

  const { error } = await supabase
    .from("propiedades")
    .update(result.data)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error al actualizar." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE — protegido (solo admin)
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Se requiere el parámetro id." }, { status: 400 });
  }

  const { error } = await supabase
    .from("propiedades")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error al eliminar." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
