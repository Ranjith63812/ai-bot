import React from 'react';
import { X } from 'lucide-react';

function SettingsModal({ isOpen, onClose, appMode, setAppMode, cloudConfig, setCloudConfig }) {
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCloudConfig(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <div className="modal-body">
                    {/* Mode Selection */}
                    <div className="form-group">
                        <label>Application Mode</label>
                        <div className="mode-toggle">
                            <button
                                className={`mode-btn ${appMode === 'local' ? 'active' : ''}`}
                                onClick={() => setAppMode('local')}
                            >
                                Local (Ollama)
                            </button>
                            <button
                                className={`mode-btn ${appMode === 'cloud' ? 'active' : ''}`}
                                onClick={() => setAppMode('cloud')}
                            >
                                Cloud (API)
                            </button>
                        </div>
                    </div>

                    {/* Cloud Settings */}
                    {appMode === 'cloud' && (
                        <div className="cloud-settings">
                            <div className="form-group">
                                <label>Provider</label>
                                <select
                                    name="provider"
                                    value={cloudConfig.provider}
                                    onChange={handleChange}
                                    className="modal-select"
                                >
                                    <option value="chatgpt">ChatGPT (OpenAI)</option>
                                    <option value="claude">Claude (Anthropic)</option>
                                    <option value="openrouter">OpenRouter (Free/Paid)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Model Name</label>
                                <input
                                    type="text"
                                    name="model"
                                    placeholder={
                                        cloudConfig.provider === 'openrouter' ? "e.g. mistralai/mistral-7b-instruct" :
                                            cloudConfig.provider === 'claude' ? "e.g. claude-3-haiku-20240307" :
                                                "e.g. gpt-3.5-turbo"
                                    }
                                    value={cloudConfig.model}
                                    onChange={handleChange}
                                    className="modal-input"
                                />
                                {cloudConfig.provider === 'openrouter' && (
                                    <small style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                                        Check <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>openrouter.ai/models</a> for names.
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label>API Key</label>
                                <input
                                    type="password"
                                    name="api_key"
                                    placeholder="sk-..."
                                    value={cloudConfig.api_key}
                                    onChange={handleChange}
                                    className="modal-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Endpoint (Optional)</label>
                                <input
                                    type="text"
                                    name="endpoint"
                                    placeholder="Leave empty for default"
                                    value={cloudConfig.endpoint}
                                    onChange={handleChange}
                                    className="modal-input"
                                />
                            </div>
                        </div>
                    )}

                    {appMode === 'local' && (
                        <div className="info-box">
                            <p>Using local Ollama server. Models are detected automatically.</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="save-btn">Done</button>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
