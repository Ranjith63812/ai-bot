from typing import List
from .base_adapter import MCPAdapter

class GenericMCPAdapter(MCPAdapter):
    def __init__(self, endpoint: str):
        self.endpoint = endpoint

    def send_prompt(self, model: str, prompt: str) -> str:
        return f"[Generic MCP] Mock response for model '{model}' from {self.endpoint}"

    def list_models(self) -> List[str]:
        return ["generic-model-1", "generic-model-2"]
