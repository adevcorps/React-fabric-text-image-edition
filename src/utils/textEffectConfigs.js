// utils/textEffectConfigs.js

export const EFFECT_IDS = {
    NORMAL: 0,
    BRIDGE: 1,
    VALLEY: 2,
    CURVE: 3,
    ARCH: 4,
    // ... more effects
  };
  
  export const textEffectConfigs = {
    [EFFECT_IDS.BRIDGE]: {
      name: 'Bridge',
      defaultParams: {
        curve: 100,
        offsetY: 0,
        textHeight: 188,
        bottom: 188,
      },
      paramRanges: {
        curve: { min: 0, max: 300 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
      },
      applyEffect: 'applyBridgeEffect',
    },
    [EFFECT_IDS.ARCH]: {
      name: 'Arch',
      defaultParams: {
        curve: 100,
        offsetY: 0,
        textHeight: 188,
        bottom: 188,
      },
      paramRanges: {
        curve: { min: 0, max: 300 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
      },
      applyEffect: 'applyArchEffect',
    },
  };
  