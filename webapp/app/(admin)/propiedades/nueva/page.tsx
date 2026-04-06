import { redirect } from "next/navigation";

export default function NuevaPropiedadRedirect() {
  redirect("/admin/propiedades/nueva");
}
