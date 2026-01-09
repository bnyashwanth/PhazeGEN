import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, Bot, 
  Download, FileText, FlaskConical, ShieldAlert 
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import './ChatAssistant.css';
import './ReportStyles.css';
import { captureProteinImage } from "../components/Protein3DViewer";
import type { AnalysisResult } from '../services/api';

interface Props {
  analysisContext: AnalysisResult | null;
}


// interface AnalysisResult {
//   gc_content?: number;
//   pathogenic_risk?: string;
//   virulence_score?: number;
//   crispr_status?: string;
//   resistance_genes?: string[];
//   orfs?: number;
//   therapeutics?: any;
// }

interface Props {
  analysisContext: AnalysisResult | null;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const ACTION_SUGGESTIONS = [
  { label: "Generate Report", icon: <FileText size={14} />, prompt: "Generate a comprehensive Research Report for this genome." },
  { label: "Run Hypothesis", icon: <FlaskConical size={14} />, prompt: "Run multiple therapeutic hypotheses: Best case, Worst case, and Realistic case." },
  { label: "Resistance Analysis", icon: <ShieldAlert size={14} />, prompt: "Compare the Resistance Genes found against the proposed Phage Therapy design. Is there a conflict?" },
];

const ChatAssistant: React.FC<Props> = ({ analysisContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 **Dr. Phaze Online**\n\nI am ready to analyze this genome. I can run **simulation hypotheses**, compare **resistance vs. therapeutics**, or generate a **PDF Research Report**.",
      sender: 'ai'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        const contextPayload = analysisContext || {};

        const res = await axios.post('http://localhost:8000/ai/research-assistant', {
            message: text,
            context: contextPayload
        });

        const aiMsg: Message = { 
            id: Date.now() + 1, 
            text: res.data.response, 
            sender: 'ai' 
        };
        setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "⚠️ **System Error**: Neural engine unreachable.",
            sender: 'ai'
        }]);
    } finally {
        setIsTyping(false);
    }
  };


useEffect(() => {
  const handler = (e: any) => {
    const r = e.detail;
    if (!r) return;

    // 🔥 AUTO-OPEN CHAT WINDOW
    setIsOpen(true);

    sendMessage(
      `Explain the functional and structural role of residue ${r.residue}${r.position} on chain ${r.chain}.
Confidence score: ${Math.round(r.confidence)}.`
    );
  };

  window.addEventListener("protein-residue-click", handler);
  return () => {
    window.removeEventListener("protein-residue-click", handler);
  };
}, []);

  // --- PDF GENERATION LOGIC ---
const handleDownloadPDF = async () => {
  const element = document.getElementById("phazegen-report");
  if (!element) return;

  // Remove old injected image if exists
  const oldImg = element.querySelector(".protein-snapshot");
  if (oldImg) oldImg.remove();

  // Capture protein image
  const proteinImg = captureProteinImage();

  if (proteinImg) {
    const img = document.createElement("img");
    img.src = proteinImg;
    img.className = "protein-snapshot";
    img.style.width = "100%";
    img.style.marginBottom = "16px";
    img.style.borderRadius = "8px";

    element.prepend(img);
  }

  // Small delay ensures DOM updates before PDF render
  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0.7,
        filename: "PhazeGEN_Research_Report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(element)
      .save();
  }, 300);
};



  return (
    <div className="chat-widget-wrapper">
      <div className={`chat-window ${isOpen ? 'open' : 'closed'}`}>
        
        {/* Header with Download Button */}
        <div className="chat-header">
          <div className="header-info">
            <div className="avatar-circle ai-avatar">
              <Bot size={20} />
            </div>
            <div>
              <h3>Dr. Phaze</h3>
              <div className="status-indicator">
                <span className="dot-green"></span> Research Engine Active
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={handleDownloadPDF} className="icon-btn" title="Download Chat as PDF">
                <Download size={18} />
            </button>
            <button onClick={() => setIsOpen(false)} className="icon-btn">
                <X size={20} />
            </button>
            
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages" ref={chatContainerRef} id="chat-content">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
              {msg.sender === 'ai' && <div className="avatar-circle ai-tiny"><Sparkles size={14} /></div>}
              
              <div className={`chat-bubble ${msg.sender}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-row ai">
              <div className="avatar-circle ai-tiny"><Sparkles size={14} /></div>
              <div className="chat-bubble ai typing">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Chips (Hypothesis, Report, etc.) */}
        <div className="suggestions-row">
            {ACTION_SUGGESTIONS.map((action, i) => (
                <button key={i} onClick={() => sendMessage(action.prompt)} className="suggestion-chip action-chip">
                    {action.icon} {action.label}
                </button>
            ))}
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Ask a research question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          />
          <button className="send-btn" onClick={() => sendMessage(input)} disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>

      <button className={`chat-toggle-btn ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <MessageSquare size={24} color="white" />
      </button>

      {/* ================= PDF REPORT (HIDDEN) ================= */}
<div style={{ display: 'none' }}>
  <div id="phazegen-report">

    <h1>PhazeGEN Research Report</h1>
    <div className="report-meta">
      Generated by <b>Dr. Phaze AI</b><br />
      {new Date().toLocaleString()}
    </div>

    {analysisContext && (
      <>
        <h2>Genome Analysis Summary</h2>
        <ul>
          <li><b>GC Content:</b> {analysisContext.gc_content}%</li>
          <li><b>Pathogenic Risk:</b> {analysisContext.pathogenic_risk}</li>
          <li><b>Virulence Score:</b> {analysisContext.virulence_score}</li>
          <li><b>CRISPR Status:</b> {analysisContext.crispr_status}</li>
          <li><b>ORFs Detected:</b> {analysisContext.orfs}</li>
        </ul>
        <hr />
      </>
    )}

    <h2>AI Research Findings</h2>

    {messages
      .filter(m => m.sender === 'ai')
      .map((msg, i) => (
        <div key={i}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.text}
          </ReactMarkdown>
        </div>
      ))}
  </div>
</div>
{/* ======================================================= */}



    </div>
  );
};

export default ChatAssistant;