import { useState } from 'react';

// Components
import GenomeUpload from './components/GenomeUpload';
import ResultsDashboard from './components/ResultsDashboard';
import ChatAssistant from './components/ChatAssistant';
import ReportModal from './components/ReportModal';

// Styles
import './App.css';

// API helpers
import { analyzeText, analyzeFile } from './services/api';
import type { AnalysisResult } from './services/api';


// ---- Types ----
// interface AnalysisResult {
//   metadata: any;
//   resistance_genes: any[];
//   risk_level: string;
//   risk_score: number;
//   explanation: string;
//   therapeutics?: any[];
//   protein_structure?: {
//     structure_url?: string;
//     [key: string]: any;
//   } | null;
// }

function App() {
  // ---- State ----
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const openReport = () => setIsReportOpen(true);

  const normalizeAnalysisResult = (res: AnalysisResult) => ({
  ...res,

  // flatten metadata for UI
  gc_content: res.metadata?.gc_content,
  orfs: res.metadata?.orf_count,

  // ensure arrays are always defined
  therapeutics: res.therapeutics ?? [],
});


  // ---- Analysis Handler ----
  const handleAnalyze = async (data: any, type: 'text' | 'file') => {
    setLoading(true);
    setError(null);
    
    setResults(null);

    try {
      let res;
      if (type === 'text') {
        res = await analyzeText(data);
      } else {
        res = await analyzeFile(data);
      }

      const normalized = normalizeAnalysisResult({
  ...res,
  protein_structure: res?.protein_structure
    ? {
        ...res.protein_structure,
        structure_url: 'https://files.rcsb.org/download/1CRN.pdb',
      }
    : null,
});

setResults(normalized);

    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          'An error occurred during analysis. Is the backend running?'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* ---------- HEADER ---------- */}
      <header className="app-header">
        <div className="hero-v2">
          <div className="hero-left">
            <span className="badge">🧬 AI Genomics Platform</span>

            <h1>PhazeGEN</h1>

            <p className="hero-sub">
              AI-Driven Antimicrobial & Phage Therapy Analysis
            </p>

            <p className="hero-desc">
              Upload microbial genomes to identify antibiotic resistance,
              CRISPR systems, and simulate{' '}
              <strong>in-silico clinical trials</strong> using advanced AI models.
            </p>

            <section className="features-section">
              <div className="features-grid">
                <div className="feature-card">
                  <strong>AI Research Assistant</strong>
                  <span>Interactive genome Q&A and summaries</span>
                </div>

                <div className="feature-card">
                  <strong>AI Explanation Panel</strong>
                  <span>Transparent reasoning behind predictions</span>
                </div>

                <div className="feature-card">
                  <strong>Resistance Gene Heatmap</strong>
                  <span>Visual probability map of resistance genes</span>
                </div>

                <div className="feature-card">
                  <strong>Protein Structure Prediction</strong>
                  <span>3D structure previews for detected ORFs</span>
                </div>

                <div className="feature-card">
                  <strong>Drug / Phage Targets</strong>
                  <span>AI-ranked therapeutic suggestions</span>
                </div>

                <div className="feature-card">
                  <strong>HGT Risk Analysis</strong>
                  <span>Detect plasmids & transposons</span>
                </div>

                <div className="feature-card">
                  <strong>CRISPR Detection</strong>
                  <span>Identify CRISPR-Cas systems</span>
                </div>

                <div className="feature-card">
                  <strong>Clinical Report Generator</strong>
                  <span>Exportable clinical-style reports</span>
                </div>
              </div>
            </section>
          </div>

          <div className="hero-right">
            <GenomeUpload onAnalyze={handleAnalyze} isLoading={loading} />
          </div>
        </div>
      </header>

      {/* ---------- MAIN ---------- */}
      <main className="main-content">
        {error && (
          <div className="error-card">
            <p className="error-title">Analysis Failed</p>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="results-area">
            <ResultsDashboard results={results} />
  
            <div className="report-action">
              <button className="report-fab" onClick={openReport}>
                📄 Generate Clinical Report
              </button>
            </div>
          </div>
        )}

        <ChatAssistant analysisContext={results} />

        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          data={results}
        />
      </main>
    </div>
  );
}

export default App;