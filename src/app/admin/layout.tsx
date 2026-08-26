import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!isAdminEmail(email)) {
    redirect("/setup-required");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 w-full flex-1">
      <nav className="mb-8 flex gap-6 text-sm font-medium text-zinc-600 border-b border-zinc-200 pb-4">
        <Link href="/admin" className="hover:text-zinc-900">
          Bookings
        </Link>
        <Link href="/admin/packages" className="hover:text-zinc-900">
          Packages
        </Link>
      </nav>
      {children}
    </div>
  );
}
