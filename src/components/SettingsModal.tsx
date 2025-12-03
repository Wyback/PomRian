import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateLLMContent: () => void;
  isGeneratingContent: boolean;
  showPhonetic: boolean;
  onTogglePhonetic: () => void;
  contentGenerationError: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onGenerateLLMContent,
  isGeneratingContent,
  showPhonetic,
  onTogglePhonetic,
  contentGenerationError,
}) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [saveMessage, setSaveMessage] = useState('');

  // Available OpenAI models
  const openaiModels = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo'
  ];

  useEffect(() => {
    if (isOpen) {
      // Load current API keys and model from localStorage when modal opens
      const savedOpenAI = localStorage.getItem('openai_api_key') || '';
      const savedGoogle = localStorage.getItem('google_api_key') || '';
      const savedModel = localStorage.getItem('openai_model') || 'gpt-4o-mini';
      setOpenaiKey(savedOpenAI);
      setGoogleKey(savedGoogle);
      setSelectedModel(savedModel);
      setSaveMessage('');
    }
  }, [isOpen]);

  const handleSaveKeys = () => {
    localStorage.setItem('openai_api_key', openaiKey);
    localStorage.setItem('google_api_key', googleKey);
    localStorage.setItem('openai_model', selectedModel);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem('openai_model', model);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="settings-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h2>⚙️ Settings</h2>
          <button
            className="settings-modal-close"
            onClick={onClose}
            title="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-modal-content">
          {/* API Keys Section */}
          <div className="settings-section">
            <h3>🔑 API Keys</h3>

            <div className="api-key-group">
              <label htmlFor="openai-key">OpenAI API Key</label>
              <input
                id="openai-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="api-key-input"
              />
            </div>

            <div className="api-key-group">
              <label htmlFor="google-key">Google Cloud API Key</label>
              <input
                id="google-key"
                type="password"
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
                placeholder="AIza..."
                className="api-key-input"
              />
            </div>

            <div className="api-key-group">
              <label htmlFor="openai-model">OpenAI Model</label>
              <select
                id="openai-model"
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="api-key-input"
              >
                {openaiModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="save-keys-button"
              onClick={handleSaveKeys}
            >
              💾 Save Settings
            </button>

            {saveMessage && (
              <div className="save-message success">
                ✅ {saveMessage}
              </div>
            )}
          </div>

          {/* Content Generation Section */}
          <div className="settings-section">
            <h3>🤖 Exercise Content</h3>

            <button
              className="generate-content-button"
              onClick={onGenerateLLMContent}
              disabled={isGeneratingContent}
            >
              {isGeneratingContent ? '⏳ Generating...' : '🤖 Generate Content'}
            </button>

            {contentGenerationError && (
              <div className="error-message">
                ❌ {contentGenerationError}
              </div>
            )}
          </div>

          {/* Display Settings Section */}
          <div className="settings-section">
            <h3>👁️ Display Settings</h3>

            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showPhonetic}
                  onChange={onTogglePhonetic}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
                Show Phonetic Transcriptions
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
