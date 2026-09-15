const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

export function relativeDays(target: Date, from: Date = new Date()): string {
  const diff = daysBetween(from, target);
  if (diff === 0) return "Today";
  if (diff > 0) return `In ${diff} day${diff === 1 ? "" : "s"}`;
  return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`;
}
