// Suggested categories offered in the admin package form's dropdown. Package
// categories are just a free-text column (public site groups/filters by
// whatever distinct values exist), so this is a curated starting list, not
// an enum — the form always merges it with whatever categories already
// exist in the database.
export const DEFAULT_PACKAGE_CATEGORIES = ["Tour", "Visit", "Hajj & Umrah", "City", "Safari"] as const;
