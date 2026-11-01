import { describe, expect, it } from "vite-plus/test";

import {
  contextIndicatorEnabled,
  contextIndicatorHelperText,
  contextIndicatorPercentage,
  contextIndicatorTone,
  contextIndicatorValueLabel,
  parseContextIndicatorThreshold,
} from "./contextIndicator";

describe("contextIndicatorPercentage", () => {
  it.each([
    { used: 49, threshold: 50, expected: null },
    { used: 50, threshold: 50, expected: 50 },
    { used: 96, threshold: 50, expected: 96 },
    { used: 3, threshold: 0, expected: 3 },
    { used: 100, threshold: 100, expected: null },
    { used: null, threshold: 0, expected: null },
  ])("used $used at threshold $threshold gives $expected", ({ used, threshold, expected }) => {
    expect(contextIndicatorPercentage(used, threshold)).toBe(expected);
  });
});

describe("contextIndicatorEnabled", () => {
  it.each([
    { threshold: 0, expected: true },
    { threshold: 90, expected: true },
    { threshold: 100, expected: false },
  ])("$threshold gives $expected", ({ threshold, expected }) => {
    expect(contextIndicatorEnabled(threshold)).toBe(expected);
  });
});

describe("contextIndicatorTone", () => {
  it.each([
    { percentage: 79, tone: "neutral" },
    { percentage: 80, tone: "warning" },
    { percentage: 89, tone: "warning" },
    { percentage: 90, tone: "danger" },
  ])("$percentage is $tone", ({ percentage, tone }) => {
    expect(contextIndicatorTone(percentage)).toBe(tone);
  });
});

describe("slider copy", () => {
  it.each([
    { threshold: 0, value: "Always", helper: "Always shows." },
    { threshold: 50, value: "50%", helper: "Shows once context reaches 50%." },
    { threshold: 100, value: "Never", helper: "Never shows." },
  ])("describes $threshold", ({ threshold, value, helper }) => {
    expect(contextIndicatorValueLabel(threshold)).toBe(value);
    expect(contextIndicatorHelperText(threshold)).toBe(helper);
  });
});

describe("parseContextIndicatorThreshold", () => {
  it.each([
    { value: 0, expected: 0 },
    { value: 70, expected: 70 },
    { value: 100, expected: 100 },
    { value: 55, expected: undefined },
    { value: 110, expected: undefined },
    { value: -10, expected: undefined },
    { value: "50", expected: undefined },
    { value: Number.NaN, expected: undefined },
  ])("reads $value as $expected", ({ value, expected }) => {
    expect(parseContextIndicatorThreshold(value)).toBe(expected);
  });
});
