import React from 'react';
import {  Zap } from 'lucide-react';
import type { ProteinStructure as IProteinStructure } from '../services/api';
import Protein3DViewer from "./Protein3DViewer";

interface Props {
  data: IProteinStructure;
}

const ProteinStructure: React.FC<Props> = ({ data }) => {
  return (
    <div className="protein-module">
      
     <div className="protein-viewer">
  <Protein3DViewer pdbUrl={data.structure_url} />
</div>



      {/* RIGHT: Light Stats Area */}
      <div className="protein-stats">
         <div className="flex-row space-between" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Protein Analysis</h3>
            <span className="badge badge-green">In-Silico</span>
         </div>

         <div className="flex-col" style={{ gap: '1.5rem' }}>
            
            {/* Metric 1 */}
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Folding Type</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>{data.folding_type}</p>
            </div>

            {/* Metric 2: Confidence Bar */}
            <div>
              <div className="flex-row space-between" style={{ marginBottom: '0.5rem' }}>
                 <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>pLDDT Confidence</p>
                 <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{data.confidence_score}%</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${data.confidence_score}%` }}></div>
              </div>
            </div>

            {/* Metric 3 */}
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Molecular Weight</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>{data.molecular_weight}</p>
            </div>

            {/* AI Note */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
               <div className="flex-row" style={{ gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Zap size={16} color="var(--warning)" style={{ marginTop: '2px' }}/>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{data.description}"
                  </p>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default ProteinStructure;