import React from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";

interface CrisprCasData {
  present: boolean;
  cas_type?: string;
  confidence?: number;
}

interface Props {
  data?: CrisprCasData;
}

const CrisprCasPanel: React.FC<Props> = ({ data }) => {
  if (!data) {
    return (
      <div className="card">
        <h3>CRISPR-Cas System</h3>
        <p style={{ color: "var(--text-muted)" }}>
          No CRISPR data available.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {data.present ? (
          <ShieldCheck size={18} color="var(--success)" />
        ) : (
          <ShieldOff size={18} color="var(--danger)" />
        )}
        CRISPR-Cas System
      </h3>

      <div style={{ marginTop: "1rem" }}>
        <p>
          <strong>CRISPR Present:</strong>{" "}
          {data.present ? "Yes" : "No"}
        </p>

        <p>
          <strong>Cas Type:</strong>{" "}
          {data.cas_type || "None"}
        </p>

        {data.confidence !== undefined && (
          <p>
            <strong>Confidence:</strong>{" "}
            {(data.confidence * 100).toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default CrisprCasPanel;
