import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Plus, MessageSquare, Mic, Settings } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import './index.css';

function App() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Cloud / Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [appMode, setAppMode] = useState('local'); // 'local' or 'cloud'
    const [cloudConfig, setCloudConfig] = useState({
        provider: 'chatgpt',
        model: 'gpt-3.5-turbo',
        api_key: '',
        endpoint: ''
    });

    const [selectedModel, setSelectedModel] = useState("qwen:0.5b");
    const [availableModels, setAvailableModels] = useState([]);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch models on mount
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await axios.get('http://localhost:8000/models');
                if (res.data.models && res.data.models.length > 0) {
                    setAvailableModels(res.data.models);
                    // Ensure selected model is in list, else pick first
                    setSelectedModel(prev => res.data.models.includes(prev) ? prev : res.data.models[0]);
                }
            } catch (err) {
                console.error("Failed to fetch models", err);
                // Fallback if API fails
                setAvailableModels(["qwen:0.5b"]);
            }
        };
        fetchModels();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare payload
            const payload = {
                message: input,
                // CRITIAL: If cloud, use cloudConfig.model. If local, use selectedModel.
                model: appMode === 'cloud' ? cloudConfig.model : selectedModel,
                cloud_config: appMode === 'cloud' ? cloudConfig : undefined
            };

            // Connect to Python Backend
            const response = await axios.post('http://localhost:8000/chat', payload);

            const aiMessage = { role: 'ai', content: response.data.response };
            setMessages(prev => [...prev, aiMessage]);
            if (response.data.model_used) {
                // Optional: log model used
                console.log(`Responded via: ${response.data.model_used}`);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = {
                role: 'ai',
                content: `Error: ${error.response?.data?.detail || error.message || 'Could not connect to server.'}. Make sure the backend is running.`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input is not supported in this browser.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + ' ' + transcript);
        };

        recognition.start();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="brand">
                    <Bot size={24} className="text-blue-500" />
                    <span>AI Assistant</span>
                </div>
                <button className="new-chat-btn" onClick={() => setMessages([])}>
                    <Plus size={18} />
                    New Chat
                </button>

                {/* Mode Indicator / Settings Trigger */}
                <div style={{ marginTop: '1rem', padding: '0 0.5rem' }}>
                    <button onClick={() => setIsSettingsOpen(true)} className="settings-trigger">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span>Mode: <b>{appMode === 'local' ? 'Local' : 'Cloud'}</b></span>
                            <Settings size={16} />
                        </div>
                    </button>
                </div>

                {appMode === 'local' && (
                    <div className="model-selector-container">
                        <label className="model-label">Select Local Model:</label>
                        <select
                            className="model-select"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                        >
                            {availableModels.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div style={{ marginTop: '1rem' }}>
                    <div className="history-item">
                        <MessageSquare size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Previous Conversation
                    </div>
                    {/* Mock history */}
                </div>
            </aside>

            {/* Main Chat */}
            <main className="chat-area">
                <div className="messages-container">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="avatar">
                                {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className="message-content">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message ai">
                            <div className="avatar"><Bot size={20} /></div>
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="input-area">
                    <div className="input-container">
                        <textarea
                            className="chat-input"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            className={`mic-btn ${isListening ? 'listening' : ''}`}
                            onClick={handleVoiceInput}
                            title="Speak"
                        >
                            <Mic size={18} />
                        </button>
                        <button className="send-btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </main>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                appMode={appMode}
                setAppMode={setAppMode}
                cloudConfig={cloudConfig}
                setCloudConfig={setCloudConfig}
            />
        </div>
    );
}

export default App;
