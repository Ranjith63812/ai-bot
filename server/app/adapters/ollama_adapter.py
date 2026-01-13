import requests
from typing import List
from .base_adapter import MCPAdapter

class OllamaAdapter(MCPAdapter):
    def __init__(self, endpoint: str):
        self.endpoint = endpoint
        self.generate_url = f"{endpoint}/api/generate"
        self.tags_url = f"{endpoint}/api/tags"

    def send_prompt(self, model: str, prompt: str) -> str:
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        try:
            response = requests.post(self.generate_url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Ollama Error: {str(e)}")

    def list_models(self) -> List[str]:
        try:
            response = requests.get(self.tags_url)
            response.raise_for_status()
            data = response.json()
            return [model['name'] for model in data.get('models', [])]
        except requests.exceptions.RequestException:
            return []
