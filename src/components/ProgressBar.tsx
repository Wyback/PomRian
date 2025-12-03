import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  current,
  total,
}) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-text">
        {current} / {total} ({Math.round(progress)}%)
      </div>
    </div>
  );
};
