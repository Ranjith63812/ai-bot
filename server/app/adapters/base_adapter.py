from abc import ABC, abstractmethod
from typing import List

class MCPAdapter(ABC):
    @abstractmethod
    def send_prompt(self, model: str, prompt: str) -> str:
        """
        Sends a prompt to the MCP server using the specified model.
        """
        pass

    @abstractmethod
    def list_models(self) -> List[str]:
        """
        Lists available models from the MCP server.
        """
        pass
