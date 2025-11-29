from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

app = FastAPI(title="Knowledge Base API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []


@app.get("/")
async def root():
    return {"message": "Knowledge Base API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    async def generate():
        messages = [
            {"role": "system", "content": "You are a helpful AI assistant for a knowledge base system. Provide clear, concise, and accurate answers."}
        ]

        for msg in request.history:
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": request.message})

        try:
            stream = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                stream=True,
                temperature=0.7,
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            print(f"Error in chat: {e}")
            yield f"Error: {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")


@app.post("/api/copilotkit")
async def copilotkit_endpoint(request: dict):
    """
    CopilotKit integration endpoint
    """
    try:
        messages = request.get("messages", [])

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
        )

        return {
            "role": "assistant",
            "content": response.choices[0].message.content,
        }
    except Exception as e:
        return {"error": str(e)}


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)


manager = ConnectionManager()


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            messages = [
                {"role": "system", "content": "You are a helpful AI assistant."}
            ]

            history = message_data.get("history", [])
            for msg in history:
                messages.append({"role": msg["role"], "content": msg["content"]})

            messages.append({"role": "user", "content": message_data["message"]})

            try:
                stream = await client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    stream=True,
                    temperature=0.7,
                )

                async for chunk in stream:
                    if chunk.choices[0].delta.content:
                        await manager.send_message(
                            json.dumps({
                                "type": "chunk",
                                "content": chunk.choices[0].delta.content
                            }),
                            websocket
                        )

                await manager.send_message(
                    json.dumps({"type": "done"}),
                    websocket
                )

            except Exception as e:
                await manager.send_message(
                    json.dumps({
                        "type": "error",
                        "content": str(e)
                    }),
                    websocket
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
