import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function ClerkAuthNav() {
  return (
    <>
      <SignedIn>
        <Link href="/account" className="hover:text-brand-navy transition-colors">
          My Bookings
        </Link>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link
          href="/sign-in"
          className="rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Sign in
        </Link>
      </SignedOut>
    </>
  );
}
