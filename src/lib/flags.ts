// Stand-in for LaunchDarkly. Each flow ships behind a flag so it can be A/B tested.
export const FLAGS = {
  advisor: true,
  teamCalculator: true,
  emailFirstCheckout: true,
} as const;
export type FlagKey = keyof typeof FLAGS;
export const isOn = (key: FlagKey) => FLAGS[key];
