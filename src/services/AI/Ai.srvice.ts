import OpenAI from 'openai'
import { SYSTEM_PROMPTS, SystemPromptKey } from './prompts.lib'
import { JSON_SCHEMAS, JsonSchemaKey } from './jsonSchema.lib'

// Configuration interface
export interface AIConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  timeout?: number
}

// Default configuration
const DEFAULT_CONFIG: Required<AIConfig> = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000,
  timeout: 30000
}

// Request options interface
export interface AIRequestOptions {
  systemPrompt?: SystemPromptKey | string
  jsonSchema?: JsonSchemaKey | object
  config?: AIConfig
}

// Response interface
export interface AIResponse<T = any> {
  content: T
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  finishReason: string | null
}

export class AIService {
  private openai: OpenAI
  private defaultConfig: Required<AIConfig>

  constructor(config: AIConfig = {}) {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY
    
    if (!apiKey) {
      throw new Error(
        'OpenAI API key not found. Please set VITE_OPENAI_API_KEY or REACT_APP_OPENAI_API_KEY environment variable.'
      )
    }

    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Required for browser usage
    })

    this.defaultConfig = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Send a message to the AI and get a response
   */
  async chat(
    message: string,
    options: AIRequestOptions = {}
  ): Promise<AIResponse<string>> {
    const config = { ...this.defaultConfig, ...options.config }
    
    // Build system prompt
    const systemPrompt = this.getSystemPrompt(options.systemPrompt)
    
    // Prepare messages
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ]

    // Build completion parameters
    const completionParams: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens
    }

    // Add JSON schema if provided
    if (options.jsonSchema) {
      const schema = this.getJsonSchema(options.jsonSchema)
      completionParams.response_format = {
        type: 'json_object'
      }
      
      // Add schema instruction to system message
      messages[0].content += `\n\nRespond with valid JSON following this exact schema: ${JSON.stringify(schema)}`
    }

    try {
      const completion = await this.openai.chat.completions.create(completionParams)
      
      const choice = completion.choices[0]
      const content = choice.message.content || ''
      
      return {
        content: options.jsonSchema ? this.parseJsonResponse(content) : content,
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        } : undefined,
        model: completion.model,
        finishReason: choice.finish_reason
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new Error(`AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Send multiple messages as a conversation
   */
  async conversation(
    messages: Array<{ role: 'user' | 'assistant', content: string }>,
    options: AIRequestOptions = {}
  ): Promise<AIResponse<string>> {
    const config = { ...this.defaultConfig, ...options.config }
    
    // Build system prompt
    const systemPrompt = this.getSystemPrompt(options.systemPrompt)
    
    // Prepare conversation messages
    const conversationMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({ role: msg.role, content: msg.content }))
    ]

    // Build completion parameters
    const completionParams: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: config.model,
      messages: conversationMessages,
      temperature: config.temperature,
      max_tokens: config.maxTokens
    }

    // Add JSON schema if provided
    if (options.jsonSchema) {
      const schema = this.getJsonSchema(options.jsonSchema)
      completionParams.response_format = {
        type: 'json_object'
      }
      
      // Add schema instruction to system message
      conversationMessages[0].content += `\n\nRespond with valid JSON following this exact schema: ${JSON.stringify(schema)}`
    }

    try {
      const completion = await this.openai.chat.completions.create(completionParams)
      
      const choice = completion.choices[0]
      const content = choice.message.content || ''
      
      return {
        content: options.jsonSchema ? this.parseJsonResponse(content) : content,
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        } : undefined,
        model: completion.model,
        finishReason: choice.finish_reason
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new Error(`AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get system prompt by key or return custom prompt
   */
  private getSystemPrompt(prompt?: SystemPromptKey | string): string {
    if (!prompt) {
      return SYSTEM_PROMPTS.GENERAL_ASSISTANT
    }
    
    if (typeof prompt === 'string' && prompt in SYSTEM_PROMPTS) {
      return SYSTEM_PROMPTS[prompt as SystemPromptKey]
    }
    
    return prompt as string
  }

  /**
   * Get JSON schema by key or return custom schema
   */
  private getJsonSchema(schema?: JsonSchemaKey | object): object {
    if (!schema) {
      return {}
    }
    
    if (typeof schema === 'string' && schema in JSON_SCHEMAS) {
      return JSON_SCHEMAS[schema as JsonSchemaKey]
    }
    
    return schema as object
  }

  /**
   * Parse JSON response and handle errors
   */
  private parseJsonResponse(content: string): any {
    try {
      return JSON.parse(content)
    } catch (error) {
      console.error('Failed to parse JSON response:', content)
      throw new Error('AI returned invalid JSON response')
    }
  }

  /**
   * Update default configuration
   */
  updateConfig(config: AIConfig): void {
    this.defaultConfig = { ...this.defaultConfig, ...config }
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<AIConfig> {
    return { ...this.defaultConfig }
  }
}

// Export a default instance
export const aiService = new AIService()

// Export for custom configurations
export default AIService