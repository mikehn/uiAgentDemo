import { aiService } from './Ai.srvice'
import { SYSTEM_PROMPTS, SystemPromptKey } from './prompts.lib'
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
    // Build dynamic system prompt with today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0]

    const dynamicPrompt = `${SYSTEM_PROMPTS[SYSTEM_PROMPT]}\n\nהתאריך היום הוא ${today}.`

    const { content } = await aiService.chat(prompt, {
      // Pass full prompt string instead of key so the AI gets the date context
      systemPrompt: dynamicPrompt,
      jsonSchema: JSON_SCHEMA
    })

    return content as unknown as AgentSelectorResponse
  }
}

// Provide a convenient default instance
export const agentSelectorService = new AgentSelectorService() 