import requests
import json

def get_free_models():
    try:
        response = requests.get("https://openrouter.ai/api/v1/models")
        if response.status_code == 200:
            data = response.json()
            models = data.get("data", [])
            free_models = [m["id"] for m in models if ":free" in m["id"] or "free" in m["pricing"]["prompt"]]
            
            # Filter for likely reliable ones
            print("Found Free Models:")
            for m in free_models:
                print(f"- {m}")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    get_free_models()
