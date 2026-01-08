import React from 'react';
import { Upload } from 'lucide-react';
import './GenomeUpload.css';

interface Props {
  onAnalyze: (data: any, type: 'text' | 'file') => void;
  isLoading: boolean;
}

const GenomeUpload: React.FC<Props> = ({ onAnalyze, isLoading }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onAnalyze(e.target.files[0], 'file');
  };

  return (
    <div className="upload-box">
      <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFile} disabled={isLoading} />
      <label htmlFor="file-upload" className="upload-btn">
        {isLoading ? 'Running Simulation...' : <><Upload size={18} /> Upload Genome (FASTA)</>}
      </label>
      <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#64748b' }}>
        Supports .fasta, .txt (Max 5MB)
      </p>
    </div>
  );
};

export default GenomeUpload;