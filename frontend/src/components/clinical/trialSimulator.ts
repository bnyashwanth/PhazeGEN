export type Therapy = {
  name: string;
  efficacy: number;        // 0–100
  resistanceRisk: number;  // 0–100
};

export function simulateTrial(therapy: Therapy) {
  const best = {
    clearance: therapy.efficacy,
    resistance: therapy.resistanceRisk * 0.5,
    responseTime: 3,
  };

  const worst = {
    clearance: therapy.efficacy * 0.5,
    resistance: therapy.resistanceRisk * 1.5,
    responseTime: 10,
  };

  const realistic = {
    clearance: therapy.efficacy - therapy.resistanceRisk,
    resistance: therapy.resistanceRisk,
    responseTime: 6,
  };

  return { best, realistic, worst };
}
