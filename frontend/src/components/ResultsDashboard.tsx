import React from 'react';
import { CheckCircle, Dna, ShieldAlert, Thermometer, FlaskConical, Network, AlertTriangle } from 'lucide-react';
import type { AnalysisResult } from '../services/api';
import ProteinStructure from './ProteinStructure';
import { TherapeuticsDashboard } from './therapeutics-dashboard';
// 🔥 NEW MODULE IMPORTS
import GenomeHeatmap from "./heatmaps/GenomeHeatmap";
import ResistanceHeatmap from "./heatmaps/ResistanceHeatmap";

import ClinicalTrialTable from "./clinical/ClinicalTrialTable";

import CrisprCasPanel from "./genomics/CrisprCasPanel";
import HgtRiskPanel from "./genomics/HgtRiskPanel";


interface Props {
  results: AnalysisResult;
}


const ResultsDashboard: React.FC<Props> = ({ results }) => {
  

  
  
  // Helper to ensure safe access if advanced_ml is missing
  const virulence = results.advanced_ml?.virulence || { virulenceScore: 0, factors: [] };
  const hgt = results.advanced_ml?.hgt_risk || { risk: 'Unknown', score: 0 };
  const unifiedHgtRisk =
  results.hgt_risk ||
  hgt || {
    level: "Low",
    explanation: "No mobile genetic elements detected.",
  };
return (
  <div className="flex-col" style={{ gap: "1.5rem" }}>

    {/* ================= TOP ROW: KPI CARDS ================= */}
    <div className="dashboard-grid-3">

      {/* Pathogenic Risk */}
     {/* Pathogenic Risk */}
<div className="stat-card">
  <div className="stat-content">
    <h4>Pathogenic Risk</h4>

    <span
      className={`badge ${
        results.risk_level === "High"
          ? "badge-red"
          : results.risk_level === "Medium"
          ? "badge-yellow"
          : "badge-green"
      }`}
    >
      {results.risk_level}
      {Math.round(results.risk_score * 100)}

    </span>
  </div>

  <div
    style={{
      height: "50px",
      width: "50px",
      borderRadius: "50%",
      background:
        results.risk_level === "High"
          ? "var(--danger-bg)"
          : results.risk_level === "Medium"
          ? "var(--warning-bg)"
          : "var(--success-bg)",
      color:
        results.risk_level === "High"
          ? "var(--danger)"
          : results.risk_level === "Medium"
          ? "var(--warning)"
          : "var(--success)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    }}
  >
    <span style={{ fontSize: "1.1rem" }}>
      {Math.round(results.risk_score * 100)}
    </span>
    <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>
      /100
    </span>
  </div>
</div>


      {/* CRISPR */}
      <div className="stat-card">
        <div className="stat-content">
          <h4>CRISPR Cas-System</h4>
          <div className="flex-row" style={{ marginTop: "0.5rem" }}>
            <ShieldAlert
              size={20}
              color={
                results.crispr_status === "Present"
                  ? "var(--success)"
                  : "var(--text-muted)"
              }
            />
            <span className="value" style={{ fontSize: "1.25rem" }}>
              {results.crispr_status}
            </span>
          </div>
        </div>
      </div>

      {/* GC Content */}
      <div className="stat-card">
        <div className="stat-content">
          <h4>GC Content</h4>
          <div className="flex-row" style={{ marginTop: "0.5rem" }}>
            <Dna size={20} color="var(--primary)" />
            <span className="value" style={{ fontSize: "1.25rem" }}>
              {results.metadata.gc_content.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* ================= GENOME HEATMAPS ================= */}
    {/* ================= GENOME FEATURE ANALYSIS ================= */}
            <section className="card">
  <h3>Genome Feature Analysis</h3>

  {/* GC Heatmap */}
  <GenomeHeatmap
    gcContent={results.metadata?.gc_content}
    genomeLength={results.metadata?.length}
  />
</section>

{/* Resistance Heatmap / Empty State */}
<section className="card">
  <h3>Resistance Gene Heatmap</h3>

  {results.resistance_genes?.length > 0 ? (
    <ResistanceHeatmap genes={results.resistance_genes} />
  ) : (
    <div className="empty-state">
      No resistance gene data available for heatmap visualization.
    </div>
  )}
</section>



    {/* ================= MIDDLE ROW ================= */}
    <div className="dashboard-grid-2">

      {/* Resistance Genes */}
      <div className="card">
        <h3 className="flex-row" style={{ gap: "0.5rem" }}>
          <Thermometer size={18} color="var(--danger)" />
          Detected Resistance Genes
        </h3>

        {results.resistance_genes.length === 0 ? (
          <div className="success-box">
            <CheckCircle size={20} />
            <span>No known resistance markers detected.</span>
          </div>
        ) : (
          <div className="flex-col">
            {results.resistance_genes.map((gene, idx) => (
              <div key={idx} className="gene-row">
                <div>
                  <strong>{gene.gene}</strong>
                  <p className="muted">{gene.class}</p>
                </div>
                <span className="badge badge-red">
                  {(gene.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
         <hr className="card-divider" />

<div className="ai-interpretation-box">
  <div className="ai-interpretation-header">
    <FlaskConical size={16} />
    <span>AI Interpretation</span>
  </div>

  <p className="ai-interpretation-text">
    {results.explanation}
  </p>
</div>


      </div>

      {/* Metadata */}
      <div className="flex-col">
        <div className="card">
          <h3>Genome Metadata</h3>
          <ul className="meta-list">
            <li>
              <span>Total Length</span>
              <span>{results.metadata.length.toLocaleString()} bp</span>
            </li>
            <li>
              <span>ORFs Identified</span>
              <span>{results.metadata.orf_count}</span>
            </li>
          </ul>

          <div className="warning-box">
            <AlertTriangle size={16} />
            Research prototype only
          </div>
        </div>

        {/* Advanced ML */}
        {results.advanced_ml && (
          <div className="card-featured">
            <h3>Advanced ML Insights</h3>

            <div className="progress-block">
              <span>Virulence Score</span>
              <strong>{virulence.virulenceScore}/100</strong>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${virulence.virulenceScore}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex-row space-between">
              <span>HGT Risk</span>
              <span
                className={`badge ${
                  hgt.risk === "High" ? "badge-red" : "badge-green"
                }`}
              >
                {hgt.risk}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ================= PROTEIN STRUCTURE ================= */}
    {results.protein_structure && (
      <ProteinStructure data={results.protein_structure} />
    )}

    {/* ================= CLINICAL TRIAL ================= */}
    {results.therapeutics && (
      <section className="card">
        <h3>In-Silico Clinical Trial Simulation</h3>
        <ClinicalTrialTable therapeutics={results.therapeutics} />
      </section>
    )}

    {/* ================= CRISPR + HGT ================= */}
    <section className="card">
  <h3 style={{ textAlign: "center", marginBottom: "1.25rem" }}>
    Genomic Defense & Transfer Risk
  </h3>

  <div className="dashboard-grid-2">
    {/* ================= CRISPR ================= */}
    <div className="card" style={{ background: "#fafafa" }}>
      <div className="flex-row space-between">
        <h4 className="flex-row" style={{ gap: "0.5rem" }}>
          🧬 CRISPR-Cas System
        </h4>

        <span className="badge badge-red">Absent</span>
      </div>

      <div style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
        <p>
          <strong>CRISPR Present:</strong> No
        </p>
        <p>
          <strong>Cas Type:</strong> None
        </p>
      </div>

      <div className="warning-box" style={{ marginTop: "0.75rem" }}>
        No adaptive immune defense detected.
      </div>
    </div>

    {/* ================= HGT ================= */}
    <div className="card" style={{ background: "#fafafa" }}>
      <div className="flex-row space-between">
        <h4 className="flex-row" style={{ gap: "0.5rem" }}>
          🔄 Horizontal Gene Transfer (HGT)
        </h4>

        <span className="badge badge-green">Low</span>
      </div>

      <div style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
        <p>
          <strong>Risk Level:</strong> Low
        </p>
      </div>

      <div className="success-box" style={{ marginTop: "0.75rem" }}>
        No plasmids, transposons, or mobile genetic elements detected.
      </div>
    </div>
  </div>
</section>

  </div>
);
}

export default ResultsDashboard;  