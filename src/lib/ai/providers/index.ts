export interface LLMProvider {
  id: string
  name: string
  supportsVision: boolean

  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>
  chatStream(
    messages: ChatMessage[],
    options?: ChatOptions
  ): AsyncIterable<string>
  analyzeImage(imageUrl: string, prompt: string): Promise<string>
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatOptions {
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

// Provider implementations will be imported here
import { QwenProvider } from "./qwen"
import { DeepseekProvider } from "./deepseek"

const providers: Record<string, LLMProvider> = {
  qwen: new QwenProvider(),
  deepseek: new DeepseekProvider(),
}

export function getProvider(modelId: string): LLMProvider {
  const provider = providers[modelId]
  if (!provider) {
    throw new Error(`Unknown model: ${modelId}. Available: ${Object.keys(providers).join(", ")}`)
  }
  return provider
}

export function getAvailableProviders(): Array<{ id: string; name: string; supportsVision: boolean }> {
  return Object.values(providers).map((p) => ({
    id: p.id,
    name: p.name,
    supportsVision: p.supportsVision,
  }))
}
