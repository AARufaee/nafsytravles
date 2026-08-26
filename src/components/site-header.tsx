import Link from "next/link";
import Image from "next/image";
import logo from "../../public/images/logo.png";
import { isClerkConfigured } from "@/lib/admin";
import { HeaderNav } from "./header-nav";

export function SiteHeader() {
  return (
    <header className="relative border-b border-brand-navy/10 bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Nafsy Travels" className="h-10 w-auto" priority />
        </Link>
        <HeaderNav clerkConfigured={isClerkConfigured()} />
      </div>
    </header>
  );
}
