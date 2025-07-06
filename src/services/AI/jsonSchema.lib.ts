// JSON Schema library for AI service structured responses

export const JSON_SCHEMAS = {
  // Simple text response schema
  SIMPLE_RESPONSE: {
    type: "object",
    properties: {
      response: {
        type: "string",
        description: "The main response text"
      },
      confidence: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description: "Confidence level of the response (0-1)"
      }
    },
    required: ["response"],
    additionalProperties: false
  },

  // Analysis response schema
  ANALYSIS_RESPONSE: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "Brief summary of the analysis"
      },
      keyPoints: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Key points from the analysis"
      },
      recommendations: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Recommended actions or next steps"
      },
      confidence: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description: "Confidence level of the analysis"
      }
    },
    required: ["summary", "keyPoints"],
    additionalProperties: false
  },

  // Question and answer schema
  QA_RESPONSE: {
    type: "object",
    properties: {
      answer: {
        type: "string",
        description: "The answer to the question"
      },
      sources: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Sources or references for the answer"
      },
      relatedQuestions: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Related questions the user might ask"
      }
    },
    required: ["answer"],
    additionalProperties: false
  },

  // Creative writing schema
  CREATIVE_RESPONSE: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the creative work"
      },
      content: {
        type: "string",
        description: "The main creative content"
      },
      genre: {
        type: "string",
        description: "Genre or style of the content"
      },
      wordCount: {
        type: "number",
        description: "Approximate word count"
      }
    },
    required: ["content"],
    additionalProperties: false
  },

  // Agent selector response schema – routes user requests to UI components
  AGENT_SELECTOR_RESPONSE: {
    type: "object",
    properties: {
      callType: {
        type: "string",
        enum: ["expense", "loan", "lost", "followup", "info"],
        description: "Type of action the UI should perform"
      },
      expense: {
        type: "object",
        properties: {
          card: {
            type: "string",
            description: "Identifier for the card (e.g., last4, brand) to show expenses for"
          },
          dates: {
            type: "array",
            items: {
              type: "string",
              description: "Date in ISO 8601 format (YYYY-MM-DD) for which expenses are requested"
            },
            description: "Specific dates requested; if omitted, all dates are implied"
          }
        },
        additionalProperties: false
      },
      loan: {
        type: "boolean",
        description: "True if the user is asking about loans"
      },
      lost: {
        type: "boolean",
        description: "True if the user is reporting a lost card"
      },
      followup: {
        type: "string",
        description: "Clarifying question that should be asked back to the user"
      },
      info: {
        type: "boolean",
        description: "True if the user is requesting general information"
      }
    },
    required: ["callType"],
    additionalProperties: false
  }
} as const

export type JsonSchemaKey = keyof typeof JSON_SCHEMAS

// Type definitions for the schema responses
export interface SimpleResponse {
  response: string
  confidence?: number
}

export interface AnalysisResponse {
  summary: string
  keyPoints: string[]
  recommendations?: string[]
  confidence?: number
}

export interface QAResponse {
  answer: string
  sources?: string[]
  relatedQuestions?: string[]
}

export interface CreativeResponse {
  title?: string
  content: string
  genre?: string
  wordCount?: number
}

// Agent selector response type
export interface AgentSelectorResponse {
  callType: "expense" | "loan" | "lost" | "followup" | "info"
  expense?: {
    card?: string
    dates?: string[]
  }
  loan?: boolean
  lost?: boolean
  followup?: string
  info?: boolean
} 