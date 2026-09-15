// Shared travel_requests status vocabulary, used by both the admin requests
// list and the customer-facing booking history so the two stay in sync.
export const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
};

export const STATUS_TONE: Record<string, "info" | "warning" | "success"> = {
  new: "info",
  in_progress: "warning",
  resolved: "success",
};
