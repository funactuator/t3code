import {
  type ContextWindowSnapshot,
  formatContextWindowCost,
  formatContextWindowTokens,
} from "@t3tools/client-runtime/state/contextWindow";
import { Pressable, View } from "react-native";

import { AppText as Text } from "../../components/ui/AppText";
import { Progress } from "../../components/ui/Progress";
import { cn } from "../../lib/cn";
import { contextIndicatorTone } from "../../lib/contextIndicator";

function compactionNote(threshold: number | null): string {
  return threshold !== null && threshold > 0
    ? `Compacts automatically at ${formatContextWindowTokens(threshold)}`
    : "Compacts automatically when needed";
}

export function ThreadContextCard(props: {
  readonly usage: ContextWindowSnapshot;
  readonly compacting: boolean;
  readonly onCompact: (() => void) | null;
}) {
  const { usage } = props;
  const percentage = usage.maxTokens != null ? usage.usedPercentage : null;
  const used = formatContextWindowTokens(usage.usedTokens);
  const tone = percentage === null ? "neutral" : contextIndicatorTone(percentage);
  const extras = [
    usage.totalProcessedTokens != null && usage.totalProcessedTokens > 0
      ? `${formatContextWindowTokens(usage.totalProcessedTokens)} total`
      : null,
    usage.cost != null ? formatContextWindowCost(usage.cost) : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <View className="mx-4 mt-3 gap-2 rounded-2xl bg-card px-4 py-3">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-base font-t3-medium text-foreground">Context</Text>
        <Text
          className={cn(
            "text-base font-t3-bold",
            tone === "danger"
              ? "text-danger-foreground"
              : tone === "warning"
                ? "text-warning-foreground"
                : "text-foreground",
          )}
        >
          {percentage !== null ? `${Math.round(percentage)}%` : used}
        </Text>
      </View>
      {percentage !== null ? <Progress label="Context used" value={percentage / 100} /> : null}
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-sm text-foreground-muted">
          {percentage !== null
            ? `${used} / ${formatContextWindowTokens(usage.maxTokens ?? null)}`
            : "Tokens used"}
        </Text>
        {props.compacting ? (
          <Text className="text-sm font-t3-bold text-foreground-muted">Compacting…</Text>
        ) : props.onCompact ? (
          <Pressable
            accessibilityLabel="Compact context"
            accessibilityRole="button"
            className="active:opacity-70"
            hitSlop={12}
            onPress={props.onCompact}
          >
            <Text className="text-sm font-t3-bold text-primary">Compact</Text>
          </Pressable>
        ) : null}
      </View>
      {usage.compactsAutomatically ? (
        <Text className="text-xs text-foreground-muted">
          {compactionNote(usage.autoCompactThreshold ?? null)}
        </Text>
      ) : null}
      {extras ? <Text className="text-xs text-foreground-muted">{extras}</Text> : null}
    </View>
  );
}
