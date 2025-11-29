"use client"

import { CopilotKit } from "@copilotkit/react-core"
import { CopilotChat } from "@copilotkit/react-ui"
import "@copilotkit/react-ui/styles.css"

export default function AskAIPage() {
  const copilotApi = process.env.NEXT_PUBLIC_COPilot_API_KEY
  return (
    <CopilotKit publicApiKey={copilotApi}>
      <div className="flex h-screen flex-col bg-gray-50">
        <div className="border-b bg-white px-6 py-4">
          <h1 className="text-2xl font-bold">Ask AI</h1>
          <p className="text-sm text-gray-600">
            Chat with your knowledge base assistant
          </p>
        </div>

        <div className="flex-1 overflow-auto">
          <CopilotChat
            instructions="You are a helpful AI assistant for a knowledge base system. Provide clear, concise, and accurate answers to help users with their questions."
            labels={{
              title: "Knowledge Base Assistant",
              initial: "Hi! I'm your knowledge base assistant. How can I help you today?",
            }}
          />
        </div>
      </div>
    </CopilotKit>
  )
}
