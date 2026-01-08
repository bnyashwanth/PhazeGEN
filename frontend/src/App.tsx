import { useState } from 'react';
import { Activity, FileText } from 'lucide-react';

// 1. Import your existing components
import GenomeUpload from './components/GenomeUpload';
import ResultsDashboard from './components/ResultsDashboard';
import ChatAssistant from './components/ChatAssistant';
import './App.css';
// 2. Import the Report Modal
import ReportModal from './components/ReportModal';

// 3. Import API helper
import { analyzeText, analyzeFile } from './services/api';

// 4. Define Interface
interface AnalysisResult {
  metadata: any;
  resistance_genes: any[];
  risk_level: string;
  risk_score: number;
  explanation: string;
  therapeutics?: any[];
}

function App() {
  // State
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const openReport = () => setIsReportOpen(true);
  // const [isLoading, setIsLoading] = useState(false);



  // Analysis Handler
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
      // setResults(res);
      setResults({
  ...res,
  protein_structure: res.protein_structure
    ? {
        ...res.protein_structure,
        structure_url: "https://files.rcsb.org/download/1CRN.pdb"
      }
    : null
});

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred during analysis. Is the Python backend running?");
    } finally {
      setLoading(false);
    }
  };

//  const onAnalyze = (data: any, type: 'text' | 'file') => {
//   console.log('Analyze triggered:', { type, data });

//   // TEMP: simulate analysis start
//   setIsLoading(true);

//   setTimeout(() => {
//     setIsLoading(false);
//     console.log('Analysis finished');
//   }, 1500);
// };


  return (
    <div className="app-container">
      
      {/* --- HEADER --- */}
      <header className="app-header">
         <div className="hero-v2">
  <div className="hero-left">
    <span className="badge">🧬 AI Genomics Platform</span>

    <h1>
      PhazeGEN
    </h1>

    <p className="hero-sub">
      AI-Driven Antimicrobial & Phage Therapy Analysis
    </p>

    <p className="hero-desc">
      Upload microbial genomes to identify antibiotic resistance,
      CRISPR systems, and simulate <strong>in-silico clinical trials</strong>
      using advanced AI models.
    </p>
    <section className="features-section">
  {/* <h2 className="features-title">Core Platform Capabilities</h2>
  <p className="features-subtitle">
    End-to-end AI-driven genomic analysis for antimicrobial and phage therapy research
  </p> */}

  <div className="features-grid">
    <div className="feature-card">
      <strong>AI Research Assistant</strong>
      <span>Interactive genome Q&A, summaries, and hypothesis exploration</span>
    </div>

    <div className="feature-card">
      <strong>AI Explanation Panel</strong>
      <span>Transparent reasoning behind predictions and risk scores</span>
    </div>

    <div className="feature-card">
      <strong>Resistance Gene Heatmap</strong>
      <span>Visual probability map of antibiotic resistance genes</span>
    </div>

    <div className="feature-card">
      <strong>Protein Structure Prediction</strong>
      <span>AlphaFold-style 3D structure previews for detected ORFs</span>
    </div>

    <div className="feature-card">
      <strong>Drug / Phage Target Suggestions</strong>
      <span>AI-ranked safe and effective therapeutic targets</span>
    </div>

    <div className="feature-card">
      <strong>HGT Risk Analysis</strong>
      <span>Detect plasmids & transposons and flag spread potential</span>
    </div>

    <div className="feature-card">
      <strong>CRISPR Detection</strong>
      <span>Identify CRISPR-Cas systems and immune defense patterns</span>
    </div>

    <div className="feature-card">
      <strong>Clinical Report Generator</strong>
      <span>Auto-generated, exportable clinical-style research reports</span>
    </div>
  </div>
</section>


  

  </div>

  <div className="hero-right">
    <GenomeUpload onAnalyze={handleAnalyze} isLoading={loading} />
  </div>
</div>


      </header>

      <main className="main-content">
        
        {/* --- INTRODUCTION ---
        <div className="intro-section">
          <h2>Genome Analysis Platform</h2>
          <p>
            Upload FASTA sequences to detect antibiotic resistance genes, CRISPR systems, 
            and run <b>In-Silico Clinical Trials</b> using our AI pipeline.
          </p>
        </div> */}

        {/* --- UPLOAD SECTION --- */}
        {/* <div className="upload-section">
          <GenomeUpload onAnalyze={handleAnalyze} isLoading={loading} />
        </div> */}

        {/* --- ERROR MESSAGE --- */}
        {error && (
          <div className="error-card">
            <p className="error-title">Analysis Failed</p>
            <p>{error}</p>
          </div>
        )}

        {/* --- RESULTS AREA --- */}
        {results && (
          <div className="results-area">
            
            {/* 1. Standard Dashboard (Includes Therapeutics Table inside) */}
            <ResultsDashboard results={results} />

            {/* 2. Generate Report Button */}
          <div className="report-action">
  <button className="report-fab" onClick={openReport}>
    📄 Generate Clinical Report
  </button>
</div>



           

            
          </div>
        )}

        {/* --- FLOATING CHAT --- */}
        <ChatAssistant analysisContext={results} />

        {/* --- REPORT MODAL --- */}
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