import React from 'react';
import { X, FileText, Download, Activity, ShieldAlert } from 'lucide-react';
import './ReportModal.css';
// @ts-ignore
import html2pdf from "html2pdf.js";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any; // The full analysis result
}

const ReportModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // const handlePrint = () => {
  //   window.print(); // Opens the browser's "Save to PDF" dialog
  // };
  const handleDownloadPDF = () => {
  const reportElement = document.querySelector(".report-body");
  if (!reportElement) return;

  const opt = {
    margin: 0.7,
    filename: "PhazeGEN_Clinical_Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
    },
  };

  html2pdf().set(opt).from(reportElement).save();
};

const metadata = data.metadata || {};
const protein = data.protein_structure || null;

  // Safe extraction of data
  const risk = data.risk_level || "Unknown";
  const score = data.risk_score || 0;
  const genes = data.resistance_genes || [];
  const therapeutics = data.therapeutics || [];
  const bestTx = therapeutics.length > 0 ? therapeutics[0] : null;

  return (
    <div className="modal-overlay">
      <div className="modal-content report-theme">
        
        {/* Header - Hides when printing */}
        <div className="modal-header no-print">
          <h3 className="modal-title"><FileText size={20} /> Clinical Research Report</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        {/* The Actual Report Page */}
<div className="report-body pdf-report">
          <div className="report-header">
            <h1>PhazeGEN Analysis Report</h1>
            <p className="date">Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="divider"></div>

          <section className="report-section">
            <h2>1. Pathogenic Risk Profile</h2>
            <div className="stat-grid">
              <div className="stat-box">
                <span className="label">Risk Classification</span>
                <span className={`value ${risk === 'High' ? 'red' : 'green'}`}>{risk}</span>
              </div>
              <div className="stat-box">
                <span className="label">Virulence Score</span>
                <span className="value">{score}/100</span>
              </div>
            </div>
            <p className="summary-text">
              {data.explanation || "Automated risk assessment based on genomic features."}
            </p>
          </section>

          <section className="report-section">
  <h2>2. Genome Metadata</h2>

  <div className="stat-grid">
    <div className="stat-box">
      <span className="label">Genome Length</span>
      <span className="value">{metadata.genome_length || "N/A"} bp</span>
    </div>

    <div className="stat-box">
      <span className="label">GC Content</span>
      <span className="value">{metadata.gc_content || "N/A"}%</span>
    </div>

    <div className="stat-box">
      <span className="label">ORFs Detected</span>
      <span className="value">{metadata.orfs || "N/A"}</span>
    </div>
  </div>

  <p className="summary-text">
    Genome-level features were extracted and analyzed to estimate pathogenic
    potential, horizontal gene transfer risk, and therapeutic susceptibility.
  </p>
</section>


          <section className="report-section">
            <h2>2. Resistance Markers</h2>
            {genes.length > 0 ? (
              <ul className="gene-list">
                {genes.map((g: any, i: number) => (
                  <li key={i}>
                    <ShieldAlert size={16} className="icon-red"/> 
                    <strong>{g.gene}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="safe-text">No known antibiotic resistance genes detected.</p>
            )}
          </section>
          <section className="report-section">
  <h2>4. Protein Structure Analysis</h2>

  {protein ? (
    <>
      <div className="stat-grid">
        <div className="stat-box">
          <span className="label">Structure ID</span>
          <span className="value">{protein.structure_id}</span>
        </div>

        <div className="stat-box">
          <span className="label">Folding Type</span>
          <span className="value">{protein.folding_type}</span>
        </div>

        <div className="stat-box">
          <span className="label">pLDDT Confidence</span>
          <span className="value">{protein.confidence_score}%</span>
        </div>

        <div className="stat-box">
          <span className="label">Molecular Weight</span>
          <span className="value">{protein.molecular_weight}</span>
        </div>
      </div>

      <p className="summary-text">
        Structural modeling suggests a predominantly {protein.folding_type}
        architecture. Regions with high pLDDT confidence are likely to be
        structurally stable and biologically functional.
      </p>
    </>
  ) : (
    <p>No protein structure prediction available.</p>
  )}
</section>

<section className="report-section">
  <h2>5. Therapeutic Strategy Assessment</h2>

  {therapeutics.length > 0 ? (
    therapeutics.map((tx: any, i: number) => (
      <div key={i} className="recommendation-box">
        <h4>
          <Activity size={18} /> {tx.name}
        </h4>

        <div className="rec-details">
          <p><strong>Type:</strong> {tx.type}</p>
          <p><strong>Target:</strong> {tx.target}</p>
<p><strong>Predicted Efficacy:</strong> {tx.success_prob}% likelihood</p>
        </div>

        <p className="note">
          <strong>AI Interpretation:</strong> {tx.notes}
        </p>
      </div>
    ))
  ) : (
    <p>No therapeutic simulation data available.</p>
  )}
</section>

<section className="report-section">
  <h2>6. References</h2>
  <ul className="reference-list">
    <li>
      Protein Data Bank (PDB): 1CRN  
      <br />
      <a href="https://files.rcsb.org/download/1CRN.pdb">
        https://files.rcsb.org/download/1CRN.pdb
      </a>
    </li>
    <li>
      AlphaFold Protein Structure Database, DeepMind (2021)
    </li>
    <li>
      PhazeGEN Internal AI Genomic Analysis Pipeline
    </li>
  </ul>
</section>


          <div className="report-footer">
            <p>Generated by PhazeGEN AI - In-Silico Research Prototype</p>
          </div>
        </div>

        {/* Footer - Hides when printing */}
        <div className="modal-footer no-print">
        <button onClick={handleDownloadPDF} className="print-btn">
  <Download size={16} /> Download PDF
</button>
 
        </div>
      </div>
    </div>
  );
};

export default ReportModal;