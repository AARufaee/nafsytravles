"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import Button from "@/components/ui/Button";

export type PackageFormValues = {
  slug: string;
  title: string;
  description: string;
  destination: string;
  category: string;
  images: string[];
  priceCents: number;
  durationDays: number;
  maxTravelers: number;
  featured: boolean;
};

const EMPTY: PackageFormValues = {
  slug: "",
  title: "",
  description: "",
  destination: "",
  category: "",
  images: [],
  priceCents: 0,
  durationDays: 1,
  maxTravelers: 1,
  featured: false,
};

const CUSTOM_CATEGORY = "__custom__";

const inputClass =
  "rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light disabled:bg-brand-navy/5 disabled:text-brand-navy/50";
const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-brand-navy";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-brand-navy/10 bg-white p-5 shadow-[0_1px_2px_rgba(10,17,48,0.04)] sm:p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-brand-navy">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-brand-navy/50">{description}</p>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export default function PackageForm({
  initial,
  isNew,
  categories,
}: {
  initial?: PackageFormValues;
  isNew: boolean;
  categories: string[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<PackageFormValues>(initial ?? EMPTY);
  const [imagesText, setImagesText] = useState((initial ?? EMPTY).images.join(", "));
  const [useCustomCategory, setUseCustomCategory] = useState(
    initial ? !categories.includes(initial.category) : false,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof PackageFormValues>(key: K, value: PackageFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const images = imagesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch(isNew ? "/api/packages" : `/api/packages/${values.slug}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, images }),
    });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong");
      return;
    }
    router.push("/admin/packages");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete "${values.title}"? This cannot be undone.`)) return;
    setSaving(true);
    const res = await fetch(`/api/packages/${values.slug}`, { method: "DELETE" });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong");
      return;
    }
    router.push("/admin/packages");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <Section title="Basics" description="How the package is identified and described.">
        <label className={labelClass}>
          Title
          <input
            required
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Dubai City Escape"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Slug <span className="font-normal text-brand-navy/40">(used in the package&rsquo;s URL)</span>
          <input
            required
            disabled={!isNew}
            value={values.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="e.g. dubai-city-escape"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Description
          <textarea
            rows={4}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className={inputClass}
          />
        </label>
      </Section>

      <Section title="Destination & category" description="Where it goes and how travelers will find it.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Destination
            <input
              required
              value={values.destination}
              onChange={(e) => update("destination", e.target.value)}
              placeholder="e.g. Dubai, UAE"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Category
            {useCustomCategory ? (
              <input
                required
                autoFocus
                value={values.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Adventure"
                className={inputClass}
              />
            ) : (
              <select
                required
                value={values.category}
                onChange={(e) => {
                  if (e.target.value === CUSTOM_CATEGORY) {
                    setUseCustomCategory(true);
                    update("category", "");
                  } else {
                    update("category", e.target.value);
                  }
                }}
                className={inputClass}
              >
                <option value="" disabled>
                  Select a category…
                </option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={CUSTOM_CATEGORY}>+ Add new category…</option>
              </select>
            )}
            {useCustomCategory && (
              <button
                type="button"
                onClick={() => {
                  setUseCustomCategory(false);
                  update("category", "");
                }}
                className="w-fit text-xs font-medium text-brand-blue hover:underline"
              >
                Choose from existing categories instead
              </button>
            )}
          </label>
        </div>
      </Section>

      <Section title="Pricing & capacity">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className={labelClass}>
            Price (USD)
            <input
              type="number"
              min={0}
              step="0.01"
              value={values.priceCents / 100}
              onChange={(e) => update("priceCents", Math.round(Number(e.target.value) * 100))}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Duration (days)
            <input
              type="number"
              min={1}
              value={values.durationDays}
              onChange={(e) => update("durationDays", Number(e.target.value))}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Max travelers
            <input
              type="number"
              min={1}
              value={values.maxTravelers}
              onChange={(e) => update("maxTravelers", Number(e.target.value))}
              className={inputClass}
            />
          </label>
        </div>
      </Section>

      <Section title="Media & visibility">
        <label className={labelClass}>
          Images <span className="font-normal text-brand-navy/40">(comma-separated URLs)</span>
          <input
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
            placeholder="/images/dubai.jpg, /images/dubai-2.jpg"
            className={inputClass}
          />
        </label>
        <label
          className={`flex w-fit cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            values.featured
              ? "border-brand-blue-light/30 bg-brand-blue-light/10 text-brand-blue"
              : "border-brand-navy/15 text-brand-navy/60 hover:border-brand-navy/30"
          }`}
        >
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="sr-only"
          />
          Featured on the homepage
        </label>
        <p className="flex items-center gap-1.5 text-xs text-brand-navy/40">
          <Info className="h-3.5 w-3.5" strokeWidth={2} />
          Featured packages are highlighted first on the public site.
        </p>
      </Section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isNew ? "Create package" : "Save changes"}
        </Button>
        {!isNew && (
          <Button type="button" variant="danger" onClick={handleDelete} disabled={saving}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
