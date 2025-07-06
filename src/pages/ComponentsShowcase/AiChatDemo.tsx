import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { aiService, AIConfig } from '../../services/AI/Ai.srvice'
import { SYSTEM_PROMPTS } from '../../services/AI/prompts.lib'
import { JSON_SCHEMAS } from '../../services/AI/jsonSchema.lib'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AiChatControlsProps {
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
  useJsonSchema: boolean
  setUseJsonSchema: (use: boolean) => void
  jsonSchema: string
  setJsonSchema: (schema: string) => void
  config: AIConfig
  setConfig: (config: AIConfig) => void
  onClear: () => void
}

function AiChatControls({
  systemPrompt,
  setSystemPrompt,
  useJsonSchema,
  setUseJsonSchema,
  jsonSchema,
  setJsonSchema,
  config,
  setConfig,
  onClear
}: AiChatControlsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">AI Chat Configuration</h3>
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Clear Chat
        </button>
      </div>

      <div className="grid gap-4">
        {/* System Prompt Selection */}
        <label className="flex flex-col text-sm font-medium">
          System Prompt
          <select
            className="rounded border p-2"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          >
            <option value="CHAT_ASSISTANT">Chat Assistant</option>
            <option value="GENERAL_ASSISTANT">General Assistant</option>
            <option value="ANALYSIS_ASSISTANT">Analysis Assistant</option>
            <option value="CREATIVE_ASSISTANT">Creative Assistant</option>
            <option value="JSON_ASSISTANT">JSON Assistant</option>
            <option value="custom">Custom...</option>
          </select>
        </label>

        {/* Custom System Prompt */}
        {systemPrompt === 'custom' && (
          <label className="flex flex-col text-sm font-medium">
            Custom System Prompt
            <textarea
              className="rounded border p-2 h-20 resize-none"
              placeholder="Enter custom system prompt..."
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </label>
        )}

        {/* Model Selection */}
        <label className="flex flex-col text-sm font-medium">
          Model
          <select
            className="rounded border p-2"
            value={config.model || 'gpt-3.5-turbo'}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
          </select>
        </label>

        {/* Temperature */}
        <label className="flex flex-col text-sm font-medium">
          Temperature: {config.temperature || 0.7}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature || 0.7}
            onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
            className="rounded"
          />
        </label>

        {/* Max Tokens */}
        <label className="flex flex-col text-sm font-medium">
          Max Tokens
          <input
            type="number"
            min="100"
            max="4000"
            step="100"
            value={config.maxTokens || 1000}
            onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
            className="rounded border p-2"
          />
        </label>

        {/* JSON Schema Toggle */}
        <label className="flex items-center text-sm font-medium">
          <input
            type="checkbox"
            checked={useJsonSchema}
            onChange={(e) => setUseJsonSchema(e.target.checked)}
            className="mr-2"
          />
          Use JSON Schema Response
        </label>

        {/* JSON Schema Selection */}
        {useJsonSchema && (
          <label className="flex flex-col text-sm font-medium">
            JSON Schema
            <select
              className="rounded border p-2"
              value={jsonSchema}
              onChange={(e) => setJsonSchema(e.target.value)}
            >
              <option value="SIMPLE_RESPONSE">Simple Response</option>
              <option value="QA_RESPONSE">Q&A Response</option>
              <option value="ANALYSIS_RESPONSE">Analysis Response</option>
              <option value="CREATIVE_RESPONSE">Creative Response</option>
            </select>
          </label>
        )}
      </div>
    </div>
  )
}

function AiChatDemo() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Configuration state
  const [systemPrompt, setSystemPrompt] = useState('CHAT_ASSISTANT')
  const [useJsonSchema, setUseJsonSchema] = useState(false)
  const [jsonSchema, setJsonSchema] = useState('SIMPLE_RESPONSE')
  const [config, setConfig] = useState<AIConfig>({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000
  })

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError(null)

    try {
      // Check if API key is available (env vars or localStorage)
      const hasApiKey =
        import.meta.env.VITE_OPENAI_API_KEY ||
        import.meta.env.REACT_APP_OPENAI_API_KEY ||
        (typeof window !== 'undefined' && localStorage.getItem('OPENAI_API_KEY'))

      if (!hasApiKey) {
        throw new Error('OpenAI API key not configured. Please provide a key via the Settings page.')
      }

      const response = await aiService.chat(userMessage.content, {
        systemPrompt: systemPrompt === 'custom' ? systemPrompt : systemPrompt,
        jsonSchema: useJsonSchema ? (jsonSchema as any) : undefined,
        config
      })

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: typeof response.content === 'string' 
          ? response.content 
          : JSON.stringify(response.content, null, 2),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('AI Chat Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  const formatMessageContent = (content: string) => {
    // Try to parse and format JSON responses
    try {
      const parsed = JSON.parse(content)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return content
    }
  }

  return (
    <section className="space-y-6">
      {/* Chat Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">AI Chat Assistant</h3>
          <p className="text-sm text-gray-600">Ask me anything!</p>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p>Start a conversation by typing a message below</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.role === 'assistant' && useJsonSchema ? (
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {formatMessageContent(message.content)}
                  </pre>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <AiChatControls
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        useJsonSchema={useJsonSchema}
        setUseJsonSchema={setUseJsonSchema}
        jsonSchema={jsonSchema}
        setJsonSchema={setJsonSchema}
        config={config}
        setConfig={setConfig}
        onClear={clearChat}
      />
    </section>
  )
}

export default AiChatDemo 