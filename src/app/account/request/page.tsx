import { getCurrentAppUser } from "@/lib/current-user";
import PageHeader from "@/components/ui/PageHeader";
import RequestForm from "./RequestForm";

export const dynamic = "force-dynamic";

export default async function AccountRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; context?: string }>;
}) {
  const user = await getCurrentAppUser();
  if (!user) return null; // AccountLayout already redirects signed-out visitors.

  const { destination, context } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Request a custom trip"
        description="Tell us where you'd like to go and we'll put together a quote and follow up by email."
      />
      <RequestForm
        defaultDestination={destination ?? ""}
        defaultGuestName={user.name ?? ""}
        defaultGuestEmail={user.email}
        context={context ?? ""}
      />
    </div>
  );
}
