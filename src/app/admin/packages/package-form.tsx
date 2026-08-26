import { upsertPackage } from "@/app/actions/admin";
import type { packages } from "@/db/schema";

export function PackageForm({ pkg }: { pkg?: typeof packages.$inferSelect }) {
  return (
    <form action={upsertPackage} className="flex flex-col gap-4 max-w-xl">
      {pkg && <input type="hidden" name="id" value={pkg.id} />}

      <label className="flex flex-col gap-1 text-sm">
        Title
        <input
          name="title"
          required
          defaultValue={pkg?.title}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Slug (used in the URL)
        <input
          name="slug"
          required
          pattern="[a-z0-9-]+"
          defaultValue={pkg?.slug}
          placeholder="e.g. dubai-city-escape"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Destination
        <input
          name="destination"
          required
          defaultValue={pkg?.destination}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Category
        <input
          name="category"
          required
          defaultValue={pkg?.category}
          placeholder="e.g. City, Safari, Beach"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={pkg?.description}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Image URLs (comma-separated, e.g. /images/dubai.jpg)
        <input
          name="images"
          defaultValue={pkg?.images.join(", ")}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Price (USD)
          <input
            name="priceDollars"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={pkg ? pkg.priceCents / 100 : undefined}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Duration (days)
          <input
            name="durationDays"
            type="number"
            min="1"
            required
            defaultValue={pkg?.durationDays}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Max travelers
          <input
            name="maxTravelers"
            type="number"
            min="1"
            required
            defaultValue={pkg?.maxTravelers ?? 10}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={pkg?.isActive ?? true}
          className="rounded border-zinc-300"
        />
        Active (visible to visitors)
      </label>

      <button
        type="submit"
        className="self-start rounded-full bg-zinc-900 text-white px-6 py-3 font-medium hover:bg-zinc-800 transition-colors"
      >
        {pkg ? "Save changes" : "Create package"}
      </button>
    </form>
  );
}
