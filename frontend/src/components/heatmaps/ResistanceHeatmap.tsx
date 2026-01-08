import React from "react";

interface ResistanceGene {
  gene: string;
  class?: string;
  confidence?: number;
  position?: number;
}

interface Props {
  genes?: ResistanceGene[];
}

const ResistanceHeatmap: React.FC<Props> = ({ genes }) => {
  // ✅ HARD SAFETY CHECK
  if (!Array.isArray(genes) || genes.length === 0) {
    return (
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          background: "var(--bg-input)",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        No resistance gene data available for heatmap visualization.
      </div>
    );
  }

  return (
    <div className="flex-col" style={{ gap: "0.5rem" }}>
      <h4 style={{ fontSize: "0.9rem", fontWeight: 600 }}>
        Resistance Gene Density
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${genes.length}, 1fr)`,
          gap: "4px",
        }}
      >
        {genes.map((gene, idx) => {
          const intensity = gene.confidence ?? 0.5;

          const color =
            intensity > 0.8
              ? "#dc2626" // red
              : intensity > 0.5
              ? "#f97316" // orange
              : "#22c55e"; // green

          return (
            <div
              key={idx}
              title={`${gene.gene} (${Math.round(
                intensity * 100
              )}% confidence)`}
              style={{
                height: "30px",
                background: color,
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
        Color intensity represents predicted resistance confidence.
      </p>
    </div>
  );
};

export default ResistanceHeatmap;
