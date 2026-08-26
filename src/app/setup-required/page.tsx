export default function SetupRequiredPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 w-full flex-1 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Sign-in isn&rsquo;t set up yet
      </h1>
      <p className="mt-3 text-zinc-500">
        This area needs authentication to be configured before it can be
        used. Once that&rsquo;s done, accounts and the admin dashboard will work
        here.
      </p>
    </div>
  );
}
