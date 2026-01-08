import React from "react";
import { Network, AlertTriangle, CheckCircle } from "lucide-react";

interface HgtRisk {
  level: "Low" | "Medium" | "High";
  explanation: string;
}

interface Props {
  risk?: HgtRisk;
}

const HgtRiskPanel: React.FC<Props> = ({ risk }) => {
  // ✅ SAFETY FALLBACK
  if (!risk) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "var(--bg-input)",
          borderRadius: "8px",
          color: "var(--text-muted)",
        }}
      >
        HGT risk analysis not available.
      </div>
    );
  }

  const isHigh = risk.level === "High";

  return (
    <div
      className="card"
      style={{
        border: `1px solid ${
          isHigh ? "var(--danger)" : "var(--border-color)"
        }`,
      }}
    >
      <h4 className="flex-row" style={{ gap: "0.5rem" }}>
        <Network size={18} />
        Horizontal Gene Transfer (HGT) Risk
      </h4>

      <div
        className="flex-row space-between"
        style={{ marginTop: "0.75rem" }}
      >
        <span>Risk Level</span>
        <span
          className={`badge ${
            isHigh ? "badge-red" : "badge-green"
          }`}
        >
          {risk.level}
        </span>
      </div>

      <div
        style={{
          marginTop: "0.75rem",
          padding: "0.75rem",
          background: isHigh ? "var(--danger-bg)" : "var(--success-bg)",
          borderRadius: "6px",
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
      >
        {isHigh ? (
          <AlertTriangle size={18} color="var(--danger)" />
        ) : (
          <CheckCircle size={18} color="var(--success)" />
        )}

        <p
          style={{
            fontSize: "0.85rem",
            lineHeight: "1.6",
            color: isHigh ? "var(--danger)" : "var(--success)",
          }}
        >
          {risk.explanation}
        </p>
      </div>
    </div>
  );
};

export default HgtRiskPanel;
