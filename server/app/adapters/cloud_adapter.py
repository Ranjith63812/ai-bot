import requests
from typing import List, Optional
from .base_adapter import MCPAdapter

class CloudMCPAdapter(MCPAdapter):
    def __init__(self, provider: str, api_key: str, endpoint: Optional[str] = None):
        self.provider = provider
        self.api_key = api_key.strip() if api_key else ""
        
        # Strip endpoint if provided
        clean_endpoint = endpoint.strip() if endpoint else ""

        # Default endpoints if not provided or empty
        if not clean_endpoint:
            if provider == "chatgpt":
                self.endpoint = "https://api.openai.com/v1/chat/completions"
            elif provider == "claude":
                self.endpoint = "https://api.anthropic.com/v1/messages"
            elif provider == "openrouter":
                self.endpoint = "https://openrouter.ai/api/v1/chat/completions"
            else:
                self.endpoint = ""
        else:
            self.endpoint = clean_endpoint

    def send_prompt(self, model: str, prompt: str) -> str:
        clean_model = model.strip()
        if self.provider == "chatgpt":
            return self._send_openai(clean_model, prompt)
        elif self.provider == "claude":
            return self._send_anthropic(clean_model, prompt)
        elif self.provider == "openrouter":
            return self._send_openrouter(clean_model, prompt)
        else:
            raise ValueError(f"Unknown cloud provider: {self.provider}")

    def _send_openai(self, model: str, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}]
        }
        try:
            response = requests.post(self.endpoint, json=payload, headers=headers)
            if not response.ok:
                return f"ChatGPT Error ({response.status_code}): {response.text}"
                
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"ChatGPT Connection Error: {str(e)}"

    def _send_openrouter(self, model: str, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:5173", # Required by OpenRouter
            "X-Title": "AI-MCP-Client",             # Optional, good practice
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}]
        }
        try:
            response = requests.post(self.endpoint, json=payload, headers=headers)
            if not response.ok:
                return f"OpenRouter Error ({response.status_code}): {response.text}"
            
            data = response.json()
            # Handle OpenRouter/OpenAI compatible response
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"OpenRouter Connection Error: {str(e)}"

    def _send_anthropic(self, model: str, prompt: str) -> str:
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": prompt}]
        }
        try:
            response = requests.post(self.endpoint, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data["content"][0]["text"]
        except Exception as e:
            return f"Claude Error: {str(e)}"

    def list_models(self) -> List[str]:
        # Cloud APIs usually don't let you mix-and-match model listing easily without auth.
        # Returning typical models as a hint.
        if self.provider == "chatgpt":
            return ["gpt-3.5-turbo", "gpt-4o", "gpt-4-turbo"]
        elif self.provider == "claude":
            return ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"]
        return []
