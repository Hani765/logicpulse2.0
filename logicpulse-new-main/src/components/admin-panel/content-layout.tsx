import Navbar from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  children: React.ReactNode;
  role: string | undefined;

}

export function ContentLayout({ children, role }: ContentLayoutProps) {
  return (
    <div>
      <Navbar role={role} />
      <div className="w-full py-4 px-4">{children}</div>
    </div>
  );
}
