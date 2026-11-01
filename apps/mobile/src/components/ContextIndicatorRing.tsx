import { useUniwindTheme } from "../lib/useUniwindTheme";
import { Circle, Svg } from "react-native-svg";

import { contextIndicatorTone } from "../lib/contextIndicator";

const STROKE_WIDTH = 3;
const NEUTRAL_OPACITY = 0.75;
const TRACK_OPACITY = 0.2;

export function ContextIndicatorRing(props: {
  readonly percentage: number;
  readonly size: number;
}) {
  const theme = useUniwindTheme();
  const tone = contextIndicatorTone(props.percentage);
  const center = props.size / 2;
  const radius = center - STROKE_WIDTH / 2;
  const circumference = 2 * Math.PI * radius;
  const used = Math.max(0, Math.min(100, props.percentage)) / 100;
  const color =
    tone === "danger"
      ? theme["--color-danger-foreground"]
      : tone === "warning"
        ? theme["--color-warning-foreground"]
        : theme["--color-foreground"];
  return (
    <Svg
      accessible={false}
      height={props.size}
      style={{ transform: [{ rotate: "-90deg" }] }}
      width={props.size}
    >
      <Circle
        cx={center}
        cy={center}
        fill="none"
        r={radius}
        stroke={theme["--color-foreground"]}
        strokeOpacity={TRACK_OPACITY}
        strokeWidth={STROKE_WIDTH}
      />
      <Circle
        cx={center}
        cy={center}
        fill="none"
        r={radius}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - used)}
        strokeLinecap="round"
        strokeOpacity={tone === "neutral" ? NEUTRAL_OPACITY : 1}
        strokeWidth={STROKE_WIDTH}
      />
    </Svg>
  );
}
