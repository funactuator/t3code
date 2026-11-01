import { ScreenScrollView as ScrollView } from "../../components/ui/ScreenScrollView";
import { useAtomSet, useAtomValue } from "@effect/atom-react";
import { AsyncResult } from "effect/reactivity";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText as Text } from "../../components/ui/AppText";
import { SliderRow } from "../../components/ui/SliderRow";
import {
  CONTEXT_INDICATOR_THRESHOLD_STEP,
  CONTEXT_INDICATOR_THRESHOLD_ALWAYS,
  CONTEXT_INDICATOR_THRESHOLD_NEVER,
  DEFAULT_CONTEXT_INDICATOR_THRESHOLD,
  contextIndicatorHelperText,
  contextIndicatorValueLabel,
} from "../../lib/contextIndicator";
import { DEFAULT_FOLLOW_UP_BEHAVIOR, type FollowUpBehavior } from "../../lib/followUpBehavior";
import { mobilePreferencesAtom, updateMobilePreferencesAtom } from "../../state/preferences";
import { ListChoiceRow as SettingsChoiceRow } from "../../components/ui/ListChoiceRow";
import { SettingsSection } from "./components/SettingsSection";
import { SettingsScreen } from "./components/SettingsScreen";

const FOLLOW_UP_OPTIONS: ReadonlyArray<{
  readonly behavior: FollowUpBehavior;
  readonly label: string;
  readonly description: string;
}> = [
  {
    behavior: "queue",
    label: "Queue",
    description: "Your message waits and runs after the current turn finishes.",
  },
  {
    behavior: "steer",
    label: "Steer",
    description: "Your message reaches the agent right away, changing what it is working on.",
  },
];

export function SettingsFollowUpRouteScreen() {
  const insets = useSafeAreaInsets();
  const preferencesResult = useAtomValue(mobilePreferencesAtom);
  const savePreferences = useAtomSet(updateMobilePreferencesAtom);
  const preferencesReady = AsyncResult.isSuccess(preferencesResult) && !preferencesResult.waiting;
  const selectedBehavior = AsyncResult.isSuccess(preferencesResult)
    ? (preferencesResult.value.followUpBehavior ?? DEFAULT_FOLLOW_UP_BEHAVIOR)
    : null;
  const contextIndicatorThreshold = AsyncResult.isSuccess(preferencesResult)
    ? (preferencesResult.value.contextIndicatorThreshold ?? DEFAULT_CONTEXT_INDICATOR_THRESHOLD)
    : DEFAULT_CONTEXT_INDICATOR_THRESHOLD;

  const content = (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      className="flex-1"
      contentContainerClassName="gap-3 px-5 pt-4"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 18) + 18 }}
    >
      <SettingsSection title="While the agent is running">
        {FOLLOW_UP_OPTIONS.map((option, index) => (
          <SettingsChoiceRow
            key={option.behavior}
            label={option.label}
            description={option.description}
            selected={selectedBehavior === option.behavior}
            separated={index > 0}
            disabled={!preferencesReady}
            onPress={() => savePreferences({ followUpBehavior: option.behavior })}
          />
        ))}
      </SettingsSection>
      <Text className="px-2 text-sm text-foreground-muted">
        Long-press the send button to use the other option for a single message. With a hardware
        keyboard, hold Command while sending.
      </Text>
      <View className="pt-3">
        <SettingsSection
          title="Composer"
          footer={contextIndicatorHelperText(contextIndicatorThreshold)}
        >
          <SliderRow
            disabled={!preferencesReady}
            label="Context indicator"
            max={CONTEXT_INDICATOR_THRESHOLD_NEVER}
            min={CONTEXT_INDICATOR_THRESHOLD_ALWAYS}
            onChange={(value) => savePreferences({ contextIndicatorThreshold: value })}
            step={CONTEXT_INDICATOR_THRESHOLD_STEP}
            value={contextIndicatorThreshold}
            valueLabel={contextIndicatorValueLabel(contextIndicatorThreshold)}
          />
        </SettingsSection>
      </View>
    </ScrollView>
  );

  return Platform.OS === "android" ? (
    <SettingsScreen title="Chat">{content}</SettingsScreen>
  ) : (
    <View collapsable={false} className="flex-1 bg-sheet">
      {content}
    </View>
  );
}
