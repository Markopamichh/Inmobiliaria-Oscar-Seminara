import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadFormSchema } from "@/lib/validations/lead";

// In-memory rate limiting: { ip -> [timestamps] }
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hora

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= RATE_LIMIT) return false;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intentá de nuevo en una hora." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido." },
      { status: 400 }
    );
  }

  const result = LeadFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", issues: result.error.issues },
      { status: 422 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      nombre: result.data.nombre,
      email: result.data.email,
      telefono: result.data.telefono || null,
      intencion: result.data.intencion,
      presupuesto_rango: result.data.presupuesto_rango,
      zona_interes: result.data.zona_interes,
      mensaje: result.data.mensaje || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error al insertar lead:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
