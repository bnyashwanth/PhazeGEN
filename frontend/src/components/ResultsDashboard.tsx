import React from 'react';
import { CheckCircle, Dna, ShieldAlert, Thermometer, FlaskConical, Network, AlertTriangle } from 'lucide-react';
import type { AnalysisResult } from '../services/api';
import ProteinStructure from './ProteinStructure';
import { TherapeuticsDashboard } from './therapeutics-dashboard';

interface Props {
  results: AnalysisResult;
}


const ResultsDashboard: React.FC<Props> = ({ results }) => {
  
  // Helper to ensure safe access if advanced_ml is missing
  const virulence = results.advanced_ml?.virulence || { virulenceScore: 0, factors: [] };
  const hgt = results.advanced_ml?.hgt_risk || { risk: 'Unknown', score: 0 };

  return (
    <div className="flex-col" style={{ gap: '1.5rem' }}>
      
      {/* --- TOP ROW: KPI CARDS (Dashboard Grid 3) --- */}
      <div className="dashboard-grid-3">
        
        {/* Card 1: Risk Score */}
        <div className="stat-card">
          <div className="stat-content">
            <h4>Pathogenic Risk</h4>
            <span className={`badge ${results.risk_level === 'High' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '1rem' }}>
              {results.risk_level}
            </span>
          </div>
          <div style={{ 
            height: '50px', width: '50px', borderRadius: '50%', 
            background: results.risk_level === 'High' ? 'var(--danger-bg)' : 'var(--success-bg)',
            color: results.risk_level === 'High' ? 'var(--danger)' : 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem'
          }}>
            {Math.round(results.risk_score * 100)}
          </div>
        </div>

        {/* Card 2: CRISPR */}
        <div className="stat-card">
          <div className="stat-content">
            <h4>CRISPR Cas-System</h4>
            <div className="flex-row" style={{ marginTop: '0.5rem' }}>
              <ShieldAlert size={20} color={results.crispr_status === 'Present' ? 'var(--success)' : 'var(--text-muted)'} />
              <span className="value" style={{ fontSize: '1.25rem' }}>{results.crispr_status}</span>
            </div>
          </div>
        </div>

        {/* Card 3: GC Content */}
        <div className="stat-card">
          <div className="stat-content">
            <h4>GC Content</h4>
            <div className="flex-row" style={{ marginTop: '0.5rem' }}>
              <Dna size={20} color="var(--primary)" />
              <span className="value" style={{ fontSize: '1.25rem' }}>{results.metadata.gc_content.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MIDDLE ROW: Genes & Metadata (Dashboard Grid 2) --- */}
      <div className="dashboard-grid-2">
        
        {/* Left: Resistance Genes */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Thermometer size={18} color="var(--danger)" />
            Detected Resistance Genes
          </h3>
          
          {results.resistance_genes.length === 0 ? (
            <div style={{ padding: '1rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <CheckCircle size={20} /> <span>No known resistance markers detected.</span>
            </div>
          ) : (
            <div className="flex-col">
              {results.resistance_genes.map((gene, idx) => (
                <div key={idx} className="flex-row space-between" style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{gene.gene}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{gene.class}</p>
                  </div>
                  <span className="badge badge-red">
                    {(gene.confidence * 100).toFixed(0)}% Conf
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
             <h4 style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <FlaskConical size={14}/> AI ANALYSIS SUMMARY
             </h4>
             <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
               {results.explanation}
             </p>
          </div>
        </div>

        {/* Right: Metadata Stack */}
        <div className="flex-col">
            <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Genome Metadata</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <li className="flex-row space-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Length</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{results.metadata.length.toLocaleString()} bp</span>
                    </li>
                    <li className="flex-row space-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ORFs Identified</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{results.metadata.orf_count}</span>
                    </li>
                </ul>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--warning-bg)', borderRadius: '6px' }}>
                    <div className="flex-row" style={{ gap: '0.5rem' }}>
                      <AlertTriangle size={16} color="var(--warning)" />
                      <p style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: '600' }}>
                          Research prototype only.
                      </p>
                    </div>
                </div>
            </div>

            {/* Advanced ML Card (Now Light Themed) */}
            {results.advanced_ml && (
                <div className="card-featured">
                    <h3>Advanced ML Insights</h3>
                    
                    {/* Virulence */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="flex-row space-between" style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Virulence Score</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{virulence.virulenceScore}/100</span>
                        </div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${virulence.virulenceScore}%`, background: virulence.virulenceScore > 50 ? 'var(--danger)' : 'var(--primary)' }}></div>
                        </div>
                    </div>

                    {/* HGT Risk */}
                    <div>
                        <div className="flex-row space-between">
                            <div className="flex-row" style={{ gap: '0.5rem' }}>
                                <Network size={16} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>HGT Risk</span>
                            </div>
                            <span className={`badge ${hgt.risk === 'High' ? 'badge-red' : 'badge-green'}`}>
                                {hgt.risk}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* --- MODULES --- */}
      {results.protein_structure && (
        <ProteinStructure data={results.protein_structure} />
      )}
      
      {results.therapeutics && (
        <TherapeuticsDashboard data={results.therapeutics} />
      )}
      
    </div>
  );
};

export default ResultsDashboard;  