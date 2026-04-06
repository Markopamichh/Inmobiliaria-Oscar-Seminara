// Este route group no se usa directamente — el panel admin vive en /admin/*
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
