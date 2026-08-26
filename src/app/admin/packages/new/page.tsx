import { PackageForm } from "../package-form";

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">New package</h1>
      <PackageForm />
    </div>
  );
}
