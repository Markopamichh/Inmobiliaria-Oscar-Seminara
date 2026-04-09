"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface WizardProps {
  propiedadId?: string;
  propiedadTitulo?: string;
  operacion?: "venta" | "alquiler" | "venta_alquiler";
  disponible?: boolean;
}

type Intencion = "comprar_vivir" | "comprar_invertir" | "alquilar";
type Presupuesto = "menos_50k" | "50k_100k" | "100k_200k" | "mas_200k";
type Financiamiento = "disponible" | "parte_propia" | "completo";
type Urgencia = "ahora" | "3_meses" | "6_meses";
type Temperatura = "hot" | "warm" | "cold";

function calcularTemperatura(
  presupuesto: Presupuesto,
  financiamiento: Financiamiento,
  urgencia: Urgencia
): Temperatura {
  if (presupuesto === "menos_50k") return "cold";
  if (financiamiento === "completo") return "cold";
  if (urgencia === "6_meses") return "warm";
  if (financiamiento === "parte_propia") return "warm";
  return "hot";
}

function buildWaMessage(
  nombre: string,
  apellido: string,
  telefono: string,
  intencion: Intencion | null,
  propiedadTitulo?: string,
  zonaInteres?: string
): string {
  if (propiedadTitulo) {
    return (
      `Hola Oscar, soy ${nombre} ${apellido}.\n` +
      `Estoy interesado/a en la propiedad: ${propiedadTitulo}.\n` +
      `Mi número de contacto es ${telefono}.`
    );
  }
  const intentMap: Record<Intencion, string> = {
    comprar_vivir: "comprar y vivir",
    comprar_invertir: "invertir",
    alquilar: "alquilar",
  };
  const intentLabel = intencion ? intentMap[intencion] : "consultar";
  const zonaLinea = zonaInteres ? `\nMe interesa la zona: ${zonaInteres}.` : "";
  return (
    `Hola Oscar, soy ${nombre} ${apellido}.\n` +
    `Estoy buscando una propiedad para ${intentLabel}.${zonaLinea}\n` +
    `Mi número de contacto es ${telefono}.`
  );
}

export function WizardCalificacion({
  propiedadId,
  propiedadTitulo,
  operacion,
  disponible = true,
}: WizardProps) {
  // Si es alquiler puro, saltamos directo al paso de contacto
  const esAlquilerPuro = operacion === "alquiler";

  const [step, setStep] = useState(esAlquilerPuro ? "contacto" : "intencion");
  const [intencion, setIntencion] = useState<Intencion | null>(
    esAlquilerPuro ? "alquilar" : null
  );
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [financiamiento, setFinanciamiento] = useState<Financiamiento | null>(null);
  const [urgencia, setUrgencia] = useState<Urgencia | null>(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [zonaInteres, setZonaInteres] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errors, setErrors] = useState<{ nombre?: string; apellido?: string; telefono?: string }>({});

  const totalSteps = esAlquilerPuro ? 1 : 4;
  const currentStepNum =
    step === "intencion"
      ? 1
      : step === "presupuesto"
      ? 2
      : step === "financiamiento"
      ? 3
      : step === "urgencia"
      ? 4
      : totalSteps;

  function selectIntencion(val: Intencion) {
    setIntencion(val);
    if (val === "alquilar") {
      setStep("contacto");
    } else {
      setStep("presupuesto");
    }
  }

  function selectPresupuesto(val: Presupuesto) {
    setPresupuesto(val);
    if (val === "menos_50k") {
      setStep("resultado_frio");
    } else {
      setStep("financiamiento");
    }
  }

  function selectFinanciamiento(val: Financiamiento) {
    setFinanciamiento(val);
    if (val === "completo") {
      setStep("resultado_frio");
    } else {
      setStep("urgencia");
    }
  }

  function selectUrgencia(val: Urgencia) {
    setUrgencia(val);
    setStep("contacto");
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!nombre.trim()) e.nombre = "Ingresá tu nombre";
    if (!apellido.trim()) e.apellido = "Ingresá tu apellido";
    if (!telefono.trim()) e.telefono = "Ingresá tu teléfono";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleEnviar() {
    if (!validate()) return;

    let temp: Temperatura = "hot";
    if (!esAlquilerPuro && intencion !== "alquilar") {
      temp = calcularTemperatura(presupuesto!, financiamiento!, urgencia!);
    }

    setEnviando(true);

    if (temp !== "cold") {
      const supabase = createClient();
      await supabase.from("leads").insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: "no-email@wizard.local",
        telefono: telefono.trim(),
        intencion:
          intencion === "comprar_vivir" || intencion === "comprar_invertir"
            ? "comprar"
            : "alquilar",
        presupuesto_rango: presupuesto ?? undefined,
        zona_interes: zonaInteres.trim() || null,
        temperatura: temp,
        financiamiento: financiamiento ?? undefined,
        urgencia: urgencia ?? undefined,
        propiedad_id: propiedadId ?? null,
        estado: "nuevo",
      });
    }

    setEnviando(false);

    if (temp === "hot" || intencion === "alquilar") {
      const msg = buildWaMessage(nombre, apellido, telefono, intencion, propiedadTitulo, zonaInteres.trim() || undefined);
      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/5492994521890?text=${encoded}`, "_blank");
      setStep("resultado_caliente");
    } else if (temp === "warm") {
      setStep("resultado_tibio");
    }
  }

  if (!disponible) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-8 text-center">
        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-stone-400">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6v4M10 13h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="font-semibold text-stone-900 mb-2">Esta propiedad ya no está disponible</h3>
        <p className="text-sm text-stone-500 mb-5">
          Pero tenemos otras opciones que pueden interesarte.
        </p>
        <a
          href="/propiedades"
          className="inline-block bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors"
        >
          Ver propiedades disponibles
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Barra de progreso */}
      {step !== "resultado_frio" &&
        step !== "resultado_caliente" &&
        step !== "resultado_tibio" && (
          <div className="h-1 bg-stone-100">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
            />
          </div>
        )}

      <div className="p-6 md:p-8">
        {/* P1: Intención */}
        {step === "intencion" && (
          <div className="animate-fade-in">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">
              Paso 1 de 4
            </p>
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-6">
              ¿Qué estás buscando?
            </h3>
            <div className="flex flex-col gap-3">
              <OptionButton
                onClick={() => selectIntencion("comprar_vivir")}
                label="Comprar para vivir"
                description="Quiero una propiedad para mí o mi familia"
              />
              <OptionButton
                onClick={() => selectIntencion("comprar_invertir")}
                label="Comprar para invertir"
                description="Busco una oportunidad de inversión"
              />
              <OptionButton
                onClick={() => selectIntencion("alquilar")}
                label="Alquilar"
                description="Necesito una propiedad en alquiler"
              />
            </div>
          </div>
        )}

        {/* P2: Presupuesto */}
        {step === "presupuesto" && (
          <div className="animate-fade-in">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">
              Paso 2 de 4
            </p>
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-6">
              ¿Con cuánto contás aproximadamente?
            </h3>
            <div className="flex flex-col gap-3">
              <OptionButton
                onClick={() => selectPresupuesto("menos_50k")}
                label="Menos de USD 50.000"
              />
              <OptionButton
                onClick={() => selectPresupuesto("50k_100k")}
                label="USD 50.000 — 100.000"
              />
              <OptionButton
                onClick={() => selectPresupuesto("100k_200k")}
                label="USD 100.000 — 200.000"
              />
              <OptionButton
                onClick={() => selectPresupuesto("mas_200k")}
                label="Más de USD 200.000"
              />
            </div>
            <BackButton onClick={() => setStep("intencion")} />
          </div>
        )}

        {/* P3: Financiamiento */}
        {step === "financiamiento" && (
          <div className="animate-fade-in">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">
              Paso 3 de 4
            </p>
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-6">
              ¿Cómo pensás financiar la compra?
            </h3>
            <div className="flex flex-col gap-3">
              <OptionButton
                onClick={() => selectFinanciamiento("disponible")}
                label="Tengo el dinero disponible"
                description="Puedo concretar sin financiamiento"
              />
              <OptionButton
                onClick={() => selectFinanciamiento("parte_propia")}
                label="Tengo una parte y complemento con crédito"
                description="Combino fondos propios con hipoteca"
              />
              <OptionButton
                onClick={() => selectFinanciamiento("completo")}
                label="Necesito financiamiento completo"
                description="Busco crédito por el 100%"
              />
            </div>
            <BackButton onClick={() => setStep("presupuesto")} />
          </div>
        )}

        {/* P4: Urgencia */}
        {step === "urgencia" && (
          <div className="animate-fade-in">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">
              Paso 4 de 4
            </p>
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-6">
              ¿Cuándo querés concretar?
            </h3>
            <div className="flex flex-col gap-3">
              <OptionButton
                onClick={() => selectUrgencia("ahora")}
                label="Lo antes posible"
                description="Estoy listo para avanzar hoy"
              />
              <OptionButton
                onClick={() => selectUrgencia("3_meses")}
                label="En los próximos 3 meses"
              />
              <OptionButton
                onClick={() => selectUrgencia("6_meses")}
                label="En 6 meses o más"
              />
            </div>
            <BackButton onClick={() => setStep("financiamiento")} />
          </div>
        )}

        {/* Paso contacto */}
        {step === "contacto" && (
          <div className="animate-fade-in">
            {!esAlquilerPuro && intencion !== "alquilar" && (
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">
                Último paso
              </p>
            )}
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-2">
              ¡Perfecto! ¿Cómo te contactamos?
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Oscar te escribe por WhatsApp.
            </p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1.5">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Juan"
                    className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                  {errors.nombre && (
                    <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1.5">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Pérez"
                    className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                  {errors.apellido && (
                    <p className="text-xs text-red-500 mt-1">{errors.apellido}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+54 299 123-4567"
                  className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
                {errors.telefono && (
                  <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>
                )}
              </div>
              {!propiedadId && (
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1.5">
                    ¿Qué zona o barrio te interesa?
                  </label>
                  <input
                    type="text"
                    value={zonaInteres}
                    onChange={(e) => setZonaInteres(e.target.value)}
                    placeholder="Ej: Alta Barda, Confluencia, Plottier..."
                    className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
              )}
              <button
                onClick={handleEnviar}
                disabled={enviando}
                className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
              >
                {enviando ? (
                  "Enviando..."
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Hablar con Oscar por WhatsApp
                  </>
                )}
              </button>
            </div>
            {!esAlquilerPuro && intencion !== "alquilar" && (
              <BackButton
                onClick={() =>
                  setStep(urgencia !== null ? "urgencia" : "intencion")
                }
              />
            )}
          </div>
        )}

        {/* Resultado: Frío */}
        {step === "resultado_frio" && (
          <div className="animate-fade-in text-center py-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔵</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-3">
              Gracias por tu interés
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
              Por el momento no tenemos propiedades que se ajusten exactamente a
              lo que buscás, pero el mercado cambia constantemente. Si querés,
              podés explorar nuestro catálogo actual.
            </p>
            <a
              href="/propiedades"
              className="mt-6 inline-block bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors"
            >
              Ver propiedades disponibles
            </a>
          </div>
        )}

        {/* Resultado: Caliente */}
        {step === "resultado_caliente" && (
          <div className="animate-fade-in text-center py-4">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-3">
              ¡Listo! Oscar ya recibió tu mensaje
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
              Si WhatsApp no se abrió automáticamente, podés escribirle directo.
            </p>
          </div>
        )}

        {/* Resultado: Tibio */}
        {step === "resultado_tibio" && (
          <div className="animate-fade-in text-center py-4">
            <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🟡</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-stone-900 mb-3">
              ¡Recibimos tu consulta!
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
              Un asesor de Seminara se va a comunicar con vos en las próximas 48
              horas para orientarte en tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionButton({
  onClick,
  label,
  description,
}: {
  onClick: () => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left border border-stone-200 hover:border-accent hover:bg-stone-50 rounded-xl px-4 py-3.5 transition-colors duration-150 group"
    >
      <p className="text-sm font-medium text-stone-900 group-hover:text-accent transition-colors">
        {label}
      </p>
      {description && (
        <p className="text-xs text-stone-400 mt-0.5">{description}</p>
      )}
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M8 1L3 6l5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Volver
    </button>
  );
}
