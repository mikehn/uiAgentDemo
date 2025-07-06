import { aiService } from './Ai.srvice'
import { SystemPromptKey } from './prompts.lib'
import { JsonSchemaKey, AgentSelectorResponse } from './jsonSchema.lib'

// Keys used from the libraries – helps avoid typos
const SYSTEM_PROMPT: SystemPromptKey = 'AGENT_SELECTOR_ASSISTANT'
const JSON_SCHEMA: JsonSchemaKey = 'AGENT_SELECTOR_RESPONSE'

/**
 * AgentSelectorService – determines which UI component should handle a user prompt.
 * It delegates natural-language understanding to the OpenAI-powered AIService and
 * expects a structured JSON response defined by the AGENT_SELECTOR_RESPONSE schema.
 */
export class AgentSelectorService {
  /**
   * Analyse the user prompt and return a structured response.
   * @param prompt Natural-language user input
   */
  async select(prompt: string): Promise<AgentSelectorResponse> {
    const { content } = await aiService.chat(prompt, {
      systemPrompt: SYSTEM_PROMPT,
      jsonSchema: JSON_SCHEMA
    })

    return content as unknown as AgentSelectorResponse
  }
}

// Provide a convenient default instance
export const agentSelectorService = new AgentSelectorService() 