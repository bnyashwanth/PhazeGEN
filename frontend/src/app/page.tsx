"use client";

import React, { useState } from "react";
import { Upload, FileText, Activity, ArrowRight } from "lucide-react";

// Components
import ResultsDashboard from "../components/ResultsDashboard"; // Ensure path is correct
import GenomeUpload from "../components/GenomeUpload";         // Ensure path is correct
import ReportModal from "../components/ReportModal";           // Ensure path is correct
import ChatAssistant from "../components/ChatAssistant";       // Ensure path is correct

// Interfaces
interface AnalysisResult {
  metadata: { length: number; gc_content: number; orf_count: number; };
  resistance_genes: Array<{ gene: string; class: string; confidence: number; }>;
  risk_level: string;
  risk_score: number;
  explanation: string;
  advanced_ml?: any;
  protein_structure?: any;
  therapeutics?: Array<any>;
}

export default function Home() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);

  // --- API HANDLER ---
  const handleAnalyze = async (data: any, type: 'text' | 'file') => {
    setLoading(true);
    setError("");
    setResults(null);

    try {
      let payload = {};
      
      if (type === 'text') {
        payload = { sequence: data };
      } else {
        // Handle File upload logic if your backend supports file upload directly
        // For now simulating file text read if needed, or adjust based on your API
        const text = await data.text();
        payload = { sequence: text };
      }

      // Adjust URL to your actual backend port
      const response = await fetch("http://localhost:8000/analyze/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Backend connection failed");
      const resData = await response.json();
      setResults(resData);

    } catch (err) {
      console.error(err);
      setError("Failed to connect to Analysis Engine. Ensure Python backend is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // REMOVED: bg-[#020617] text-white
    // ADDED: standard container classes that use index.css
    <div className="min-h-screen">
      
      {/* Header */}
      <div className="header">
        <div className="container flex-row space-between">
          <div className="flex-row">
            <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '6px', display: 'flex' }}>
               <Activity color="white" size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>PhazeGEN</h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI-Driven Antimicrobial Analysis</p>
            </div>
          </div>
          <span className="badge badge-version">v1.0 Beta</span>
        </div>
      </div>

      <main className="container">
        
        {/* Upload Section (Always Visible) */}
        {!results && (
          <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-main)' }}>
                Genomic Analysis Platform
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Upload FASTA sequences to detect antibiotic resistance, analyze protein structures, and run in-silico clinical trials.
              </p>
            </div>
            <GenomeUpload onAnalyze={handleAnalyze} isLoading={loading} />
            
            {error && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', textAlign: 'center' }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="animation-fade-in">
             
             {/* Action Bar */}
             <div className="flex-row space-between" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Analysis Report</h2>
                <div className="flex-row">
                  <button 
                    onClick={() => setResults(null)}
                    className="btn" 
                    style={{ background: 'white', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                  >
                    New Analysis
                  </button>
                  <button 
                    onClick={() => setIsReportOpen(true)}
                    className="btn btn-primary"
                  >
                    <FileText size={18} /> Generate PDF Report
                  </button>
                </div>
             </div>

             <ResultsDashboard results={results} />
          </div>
        )}

      </main>

      {/* Floating Elements */}
      <ChatAssistant analysisContext={results} />
      
      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        data={results} 
      />

    </div>
  );
}