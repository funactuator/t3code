export const CONTEXT_INDICATOR_THRESHOLD_ALWAYS = 0;
export const CONTEXT_INDICATOR_THRESHOLD_NEVER = 100;
export const CONTEXT_INDICATOR_THRESHOLD_STEP = 10;
export const DEFAULT_CONTEXT_INDICATOR_THRESHOLD = CONTEXT_INDICATOR_THRESHOLD_NEVER;

const WARNING_PERCENTAGE = 80;
const DANGER_PERCENTAGE = 90;

export type ContextIndicatorTone = "neutral" | "warning" | "danger";

export function parseContextIndicatorThreshold(value: unknown): number | undefined {
  return typeof value === "number" &&
    value >= CONTEXT_INDICATOR_THRESHOLD_ALWAYS &&
    value <= CONTEXT_INDICATOR_THRESHOLD_NEVER &&
    value % CONTEXT_INDICATOR_THRESHOLD_STEP === 0
    ? value
    : undefined;
}

export function contextIndicatorEnabled(threshold: number): boolean {
  return threshold < CONTEXT_INDICATOR_THRESHOLD_NEVER;
}

/** The percentage to draw, or null when the ring stays hidden. */
export function contextIndicatorPercentage(
  usedPercentage: number | null,
  threshold: number,
): number | null {
  if (usedPercentage === null || !contextIndicatorEnabled(threshold)) return null;
  return usedPercentage >= threshold ? usedPercentage : null;
}

export function contextIndicatorTone(percentage: number): ContextIndicatorTone {
  if (percentage >= DANGER_PERCENTAGE) return "danger";
  return percentage >= WARNING_PERCENTAGE ? "warning" : "neutral";
}

export function contextIndicatorValueLabel(threshold: number): string {
  if (threshold <= CONTEXT_INDICATOR_THRESHOLD_ALWAYS) return "Always";
  if (threshold >= CONTEXT_INDICATOR_THRESHOLD_NEVER) return "Never";
  return `${threshold}%`;
}

export function contextIndicatorHelperText(threshold: number): string {
  if (threshold <= CONTEXT_INDICATOR_THRESHOLD_ALWAYS) return "Always shows.";
  if (threshold >= CONTEXT_INDICATOR_THRESHOLD_NEVER) return "Never shows.";
  return `Shows once context reaches ${threshold}%.`;
}
