from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from .config import config
from .adapters.ollama_adapter import OllamaAdapter
from .adapters.generic_adapter import GenericMCPAdapter
from .adapters.cloud_adapter import CloudMCPAdapter

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CloudConfig(BaseModel):
    provider: str
    api_key: str
    endpoint: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = None
    cloud_config: Optional[CloudConfig] = None

def get_adapter(start_config: Optional[CloudConfig] = None):
    # Dynamic Switching Logic
    if start_config:
        return CloudMCPAdapter(
            provider=start_config.provider,
            api_key=start_config.api_key,
            endpoint=start_config.endpoint
        )

    # Default to Local / Config-based
    server_type = config.server_type
    endpoint = config.server_endpoint
    
    if server_type == "ollama":
        return OllamaAdapter(endpoint)
    else:
        # Fallback for generic/cloud providers defined in config.json
        return GenericMCPAdapter(endpoint)

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        adapter = get_adapter(request.cloud_config)
        # Use requested model or fallback to default
        model_to_use = request.model if request.model else config.default_model
        
        response = adapter.send_prompt(model_to_use, request.message)
        return {"response": response, "model_used": model_to_use}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def get_models():
    try:
        adapter = get_adapter()
        return {"models": adapter.list_models()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {
        "status": "ok", 
        "server_type": config.server_type, 
        "default_model": config.default_model
    }
