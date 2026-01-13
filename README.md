# AI Assistant

A powerful, dual-mode AI chat application that bridges local privacy and cloud power. Built with a **React** frontend and **Python/FastAPI** backend, utilizing the **Model Context Protocol (MCP)** architecture.

![AI Assistant Screenshot](supports%20any%20mcp.PNG)

## 🚀 Features

*   **Dual-Mode Backend**:
    *   **Local Mode**: Private, offline inference using **Ollama** (supports Llama 3, Mistral, Qwen, etc.).
    *   **Cloud Mode**: Seamless integration with **OpenAI (ChatGPT)**, **Anthropic (Claude)**, and **OpenRouter**.
*   **OpenRouter Support**: Access hundreds of models (including **free** ones like Llama 3.3, Gemini Flash) via a single API key.
*   **Modern UI**:
    *   Clean, responsive interface built with React & Vite.
    *   **Settings Modal**: Easy configuration of API keys and providers without restarting the app.
    *   **Voice Input**: Speech-to-text integration for hands-free prompting.
    *   **Live Error Handling**: Clear feedback for network issues, rate limits, or quota errors.
*   **MCP Architecture**: Designed with the Model Context Protocol pattern for easy extensibility.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Vanilla CSS, Lucide Icons, Axios.
*   **Backend**: Python, FastAPI, Requests.
*   **Local AI**: Ollama.

## 📦 Installation & Setup

### 🚀 Quick Start (Windows)
We provide a one-click startup script!
1.  Double-click **`start_app.bat`** in the root folder.
2.  The Backend and Frontend will launch automatically.
3.  Open browser to `http://localhost:5173`.

---

### Manual Setup (Mac/Linux or Advanced)

#### Prerequisites
1.  **Node.js** (v18+ recommended)
2.  **Python** (v3.8+)
3.  **Ollama**: Installed and running ([ollama.com](https://ollama.com)).
    *   Pull a local model: `ollama pull qwen:0.5b` (or `llama3`, `mistral`).

#### 1. Backend Setup
```bash
cd server
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
The app will launch at `http://localhost:5173`.

## 📖 How to Use

### Local Mode (Privacy 🔒)
1.  Ensure Ollama is running (`ollama serve`).
2.  Open the App Sidebar > settings icon.
3.  Select **Local (Ollama)**.
4.  Choose your downloaded model from the dropdown.
5.  Chat!

### Cloud Mode (Power ☁️)
1.  Open Settings > **Cloud (API)**.
2.  Select a Provider:
    *   **ChatGPT**: Requires OpenAI API Key.
    *   **Claude**: Requires Anthropic API Key.
    *   **OpenRouter**: Requires OpenRouter Key (Supports **Free Models**).
3.  Enter your API Key.
4.  Enter a Model Name (e.g., `gpt-4o`, `claude-3-haiku`, `meta-llama/llama-3.2-3b-instruct:free`).
5.  Click **Done** and Chat!

## 📂 Project Structure

```
ai-mcp-client/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (SettingsModal, etc.)
│   │   └── App.jsx         # Main Logic
├── server/                 # FastAPI Backend
│   ├── app/
│   │   ├── adapters/       # MCP Adapters (Ollama, Cloud)
│   │   └── main.py         # API Endpoints
├── scripts/                # Utility Scripts
└── start_app.bat           # One-click startup script (Windows)
```

## 📜 License
MIT
