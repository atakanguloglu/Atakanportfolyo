import AdminShell from "./_components/AdminShell";

export const metadata = {
  title: "Admin Panel",
  description: "Blog ve içerik yönetimi",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
