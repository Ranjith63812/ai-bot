import json
import os
from pathlib import Path

CONFIG_PATH = Path(__file__).parent.parent.parent / "config.json"

class Config:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
            cls._instance._load_config()
        return cls._instance

    def _load_config(self):
        try:
            with open(CONFIG_PATH, "r") as f:
                self._data = json.load(f)
        except FileNotFoundError:
            # Fallback defaults
            self._data = {
                "mcp_server": {"type": "ollama", "endpoint": "http://127.0.0.1:11434"},
                "default_model": "qwen:0.5b"
            }
            print(f"Warning: Config file not found at {CONFIG_PATH}, using defaults.")

    @property
    def server_type(self):
        self._load_config()
        return self._data.get("mcp_server", {}).get("type", "ollama")

    @property
    def server_endpoint(self):
        self._load_config()
        return self._data.get("mcp_server", {}).get("endpoint", "http://127.0.0.1:11434")

    @property
    def default_model(self):
        self._load_config()
        return self._data.get("default_model", "qwen:0.5b")

config = Config()
