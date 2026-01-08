import React, { useState } from "react";
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface Therapeutic {
  name: string;
  type: "Phage" | "Antibiotic";
  target: string;
  efficacy: number; // 0–100
  interpretation?: string;
}

interface Props {
  therapeutics: Therapeutic[];
}

const getScenarioOutcome = (efficacy: number) => {
  return {
    best: Math.min(100, efficacy + 10),
    realistic: efficacy,
    worst: Math.max(0, efficacy - 15),
  };
};

const ClinicalTrialTable: React.FC<Props> = ({ therapeutics }) => {
  const [showAll, setShowAll] = useState(false);

  // 🔑 ONLY 3 INITIALLY
  const visibleTrials = showAll
    ? therapeutics
    : therapeutics.slice(0, 3);

  if (!therapeutics || therapeutics.length === 0) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "var(--bg-input)",
          borderRadius: "8px",
          color: "var(--text-muted)",
        }}
      >
        No therapeutic candidates available for in-silico simulation.
      </div>
    );
  }

  return (
    <div className="flex-col" style={{ gap: "1rem" }}>
      {visibleTrials.map((therapy, idx) => {
        const efficacy =
          Number(therapy.efficacy) ||
          Number((therapy as any).predicted_efficacy) ||
          Number((therapy as any).score) ||
          70;

        const scenario = getScenarioOutcome(efficacy);

        return (
          <div
            key={idx}
            className="card"
            style={{
              border: "1px solid var(--border-color)",
              background: "#f8fafc",
            }}
          >
            {/* ================= HEADER ================= */}
            <div className="flex-row space-between">
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600 }}>
                  {therapy.name}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {therapy.type} • Target: {therapy.target}
                </p>
              </div>

              <span
                className={`badge ${
                  efficacy >= 80 ? "badge-green" : "badge-orange"
                }`}
              >
                {efficacy}% Efficacy
              </span>
            </div>

            {/* ================= SCENARIOS ================= */}
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.75rem",
              }}
            >
              <div className="scenario-card">
                <TrendingUp size={16} color="var(--success)" />
                <h5>Best Case</h5>
                <p>{scenario.best}% Clearance</p>
                <span className="badge badge-green">Optimal response</span>
              </div>

              <div className="scenario-card">
                <CheckCircle size={16} color="var(--primary)" />
                <h5>Realistic</h5>
                <p>{scenario.realistic}% Clearance</p>
                <span className="badge badge-blue">Expected outcome</span>
              </div>

              <div className="scenario-card">
                <AlertTriangle size={16} color="var(--danger)" />
                <h5>Worst Case</h5>
                <p>{scenario.worst}% Clearance</p>
                <span className="badge badge-red">Resistance risk</span>
              </div>
            </div>

            {/* ================= AI INTERPRETATION ================= */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
              }}
            >
              <strong
                style={{
                  fontSize: "0.75rem",
                  color: "var(--primary)",
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                AI Interpretation
              </strong>
              <p style={{ fontSize: "0.85rem" }}>
                {therapy.interpretation ||
                  "Simulation indicates this therapeutic shows stable performance under realistic clinical conditions."}
              </p>
            </div>
          </div>
        );
      })}

      {/* ================= SHOW MORE / LESS BUTTON ================= */}
      {therapeutics.length > 3 && (
        <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-outline"
          >
            {showAll
              ? "Show less"
              : `Show remaining ${therapeutics.length - 3}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClinicalTrialTable;
