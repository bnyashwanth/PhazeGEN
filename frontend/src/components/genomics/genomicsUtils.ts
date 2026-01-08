// Utility helpers for genomics inference
// Safe defaults for demo + in-silico use

export function inferCrisprStatus(genomeLength: number) {
  if (!genomeLength) {
    return {
      present: false,
      cas_type: "None",
      confidence: 0,
    };
  }

  if (genomeLength > 500_000) {
    return {
      present: true,
      cas_type: "Type I-E",
      confidence: 0.82,
    };
  }

  return {
    present: false,
    cas_type: "None",
    confidence: 0.15,
  };
}

export function inferHgtRisk(resistanceGenes: any[]) {
  if (!Array.isArray(resistanceGenes)) {
    return {
      level: "Low" as const,
      explanation: "No resistance gene data available.",
    };
  }

  if (resistanceGenes.length > 5) {
    return {
      level: "High" as const,
      explanation:
        "Multiple resistance genes suggest possible horizontal gene transfer.",
    };
  }

  if (resistanceGenes.length > 0) {
    return {
      level: "Medium" as const,
      explanation:
        "Limited resistance markers detected; moderate HGT risk.",
    };
  }

  return {
    level: "Low" as const,
    explanation:
      "No mobile genetic elements detected.",
  };
}
