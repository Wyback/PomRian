import React from 'react';
import type { Level } from '../types';

interface LevelSelectorProps {
  levels: (Level & { progress?: number })[];
  onLevelSelect: (levelId: number) => void;
  onRegenerate?: (levelId: number) => Promise<void>;
  isRegenerating?: (levelId: number) => boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  onLevelSelect,
  onRegenerate,
  isRegenerating,
}) => {
  // Group levels by their base level (1, 2, 3)
  const levelGroups = [
    levels.filter(level => level.id === 1 || level.id === 2), // Characters
    levels.filter(level => level.id === 3 || level.id === 4), // Words
    levels.filter(level => level.id === 5 || level.id === 6), // Sentences
  ];

  const speechLevelGroups = [
    levels.filter(level => level.id === 7 || level.id === 8), // Speech Words
    levels.filter(level => level.id === 9 || level.id === 10), // Speech Sentences
    levels.filter(level => level.id === 11 || level.id === 12), // Speech Questions
  ];

  return (
    <div className="level-selector">
      <div className="card-section">
        <h2>📝 Reading</h2>
      <div className="levels-grid">
        {levelGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="level-group">
            {group.map((level) => (
              <button
                key={level.id}
                className={`level-button ${!level.unlocked ? 'locked' : ''} ${level.unlocked ? 'with-progress' : ''}`}
                onClick={() => level.unlocked && onLevelSelect(level.id)}
                disabled={!level.unlocked}
                style={level.unlocked ? {
                  '--progress-width': `${level.progress || 0}%`
                } as React.CSSProperties : {}}
              >
                <div className="level-content">
                  <div className="level-name">{level.name}</div>
                  <div className="level-description">{level.description}</div>
                  {level.id > 2 && level.unlocked && onRegenerate && (
                    <div
                      className={`level-regenerate-button ${isRegenerating && isRegenerating(level.id) ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering level select
                        if (!isRegenerating || !isRegenerating(level.id)) {
                          onRegenerate(level.id);
                        }
                      }}
                      title={`Regenerate Level ${level.id} content`}
                    >
                      {isRegenerating && isRegenerating(level.id) ? '⏳' : '↻'}
                    </div>
                  )}
                </div>
                {!level.unlocked && <div className="lock-icon">🔒</div>}
              </button>
            ))}
          </div>
        ))}
        </div>
      </div>

      <div className="card-section">
        <h2>🗣️ Speech Recognition</h2>
        <div className="speech-levels-grid">
          {speechLevelGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="speech-level-group">
              {group.map((level) => (
                <div className="level-button-container" key={level.id}>
                  <button
                    className={`level-button ${!level.unlocked ? 'locked' : ''} ${level.unlocked ? 'with-progress' : ''}`}
                    onClick={() => level.unlocked && onLevelSelect(level.id)}
                    disabled={!level.unlocked}
                    style={level.unlocked ? {
                      '--progress-width': `${level.progress || 0}%`
                    } as React.CSSProperties : {}}
                  >
                    <div className="level-name">{level.name}</div>
                    <div className="level-description">{level.description}</div>
                    {!level.unlocked && <div className="lock-icon">🔒</div>}
                  </button>
                  {level.id > 2 && level.unlocked && onRegenerate && (
                    <div
                      className={`level-regenerate-button ${isRegenerating && isRegenerating(level.id) ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering level select
                        if (!isRegenerating || !isRegenerating(level.id)) {
                          onRegenerate(level.id);
                        }
                      }}
                      title={`Regenerate Level ${level.id} content`}
                    >
                      {isRegenerating && isRegenerating(level.id) ? '⏳' : '↻'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
