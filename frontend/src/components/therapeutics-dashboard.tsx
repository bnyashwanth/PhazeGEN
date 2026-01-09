// import React from 'react';
import { Zap, CheckCircle, AlertOctagon } from 'lucide-react';

interface Therapeutic {
  type: string;
  name: string;
  target: string;
  success_prob: number;
  status: string;
  notes: string;
}

interface TherapeuticsDashboardProps {
  data: Therapeutic[];
}

export function TherapeuticsDashboard({ data }: TherapeuticsDashboardProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="therapeutics-container">
      {/* Header Section */}
      <div className="therapeutics-header">
        <div className="header-left">
          <h3 className="title">
            <Zap className="icon-yellow" size={24} /> 
            In-Silico Clinical Trials
          </h3>
          <p className="subtitle">
            AI-simulated efficacy of {data.length} therapeutic candidates.
          </p>
        </div>
        <div className="badge-version">
          Simulation Engine v1.0
        </div>
      </div>

      {/* Table Section */}
      <div className="table-wrapper">
        <table className="trials-table">
          <thead>
            <tr>
              <th>Strategy</th>
              <th>Target</th>
              <th>Efficacy</th>
              <th>Status</th>
              <th>AI Reasoning</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {/* Strategy Column */}
                <td className="strategy-cell">
                  <div className={`dot ${item.type === 'Phage' ? 'phage-dot' : 'drug-dot'}`} />
                  <span className="strategy-name">{item.name}</span>
                </td>

                {/* Target Column */}
                <td className="target-cell">{item.target}</td>

                {/* Efficacy Bar Column */}
                <td className="efficacy-cell">
                  <div className="progress-bar-bg">
                    <div 
                      className={`progress-bar-fill ${
                        item.success_prob > 80 ? 'fill-green' : 
                        item.success_prob > 50 ? 'fill-yellow' : 'fill-red'
                      }`} 
                      style={{ width: `${item.success_prob}%` }}
                    />
                  </div>
                  <span className="percentage">{item.success_prob}%</span>
                </td>

                {/* Status Column */}
                <td>
                  {item.success_prob > 75 ? (
                    <span className="status-badge effective">
                      <CheckCircle size={14} /> Effective
                    </span>
                  ) : (
                    <span className="status-badge resistant">
                      <AlertOctagon size={14} /> Resistant
                    </span>
                  )}
                </td>

                {/* Notes Column */}
                <td className="notes-cell">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}