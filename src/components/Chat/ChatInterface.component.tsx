import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { agentSelectorService } from '../../services/AI/AgentSelector.service'
import { AgentSelectorResponse } from '../../services/AI/jsonSchema.lib'
import ComponentSwitcher from './ComponentSwitcher.component'

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'component'
  content: string
  timestamp: Date
  component?: AgentSelectorResponse
}

export interface ChatInterfaceProps {
  className?: string
  placeholder?: string
  welcomeMessage?: string
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  className = '', 
  placeholder,
  welcomeMessage 
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const direction = i18n.dir()
  const isRTL = direction === 'rtl'

  const defaultWelcomeMessage = welcomeMessage || t('chat.welcome', 'Hello! How can I help you with your banking needs today?')
  const defaultPlaceholder = placeholder || t('chat.placeholder', 'Type your message here...')

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: defaultWelcomeMessage,
        timestamp: new Date()
      }])
    }
  }, [defaultWelcomeMessage, messages.length])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Convert chat messages to conversation history format for AI context
      // Only include user and assistant messages, exclude component messages and welcome message
      const conversationHistory = messages
        .filter(msg => 
          (msg.type === 'user' || msg.type === 'assistant') && 
          msg.id !== '1' // Exclude welcome message
        )
        .map(msg => ({
          role: msg.type as 'user' | 'assistant',
          content: msg.content
        }))

      // Pass conversation context to agent selector for better understanding
      const response = conversationHistory.length > 0 
        ? await agentSelectorService.select(inputValue.trim(), conversationHistory)
        : await agentSelectorService.select(inputValue.trim())
      
      // Add component message
      const componentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'component',
        content: '',
        timestamp: new Date(),
        component: response
      }

      setMessages(prev => [...prev, componentMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: t('chat.error', 'Sorry, I encountered an error. Please try again.'),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleComponentComplete = (result: any) => {
    const completionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: t('chat.completed', 'Task completed successfully! Is there anything else I can help you with?'),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, completionMessage])
    inputRef.current?.focus()
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(isRTL ? 'he-IL' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !isRTL
    }).format(date)
  }

  return (
    <div dir={direction} className={`flex flex-col h-full bg-[#f7faff] backdrop-blur-xl ${className}`.trim()}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20" style={{ backgroundColor: '#f7faff' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('chat.title', 'Banking Assistant')}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
              {isLoading ? t('chat.typing', 'Analyzing your request...') : t('chat.online', 'Ready to help')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 max-w-4xl mx-auto w-full bg-[#f7faff]">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg ${message.type === 'component' ? 'w-full max-w-none' : ''}`}>
              {message.type === 'user' ? (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl px-6 py-4 shadow-lg">
                  <p className="text-base leading-relaxed">{message.content}</p>
                  <p className="text-xs text-blue-100 mt-2 opacity-80">{formatTime(message.timestamp)}</p>
                </div>
              ) : message.type === 'assistant' ? (
                <div className="bg-white/70 backdrop-blur-sm text-gray-900 rounded-3xl px-6 py-4 shadow-lg border border-white/20">
                  <p className="text-base leading-relaxed">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{formatTime(message.timestamp)}</p>
                </div>
              ) : message.type === 'component' && message.component ? (
                <div className="my-6">
                  <ComponentSwitcher
                    response={message.component}
                    onComplete={handleComponentComplete}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 text-center mt-3 opacity-70">{formatTime(message.timestamp)}</p>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-lg border border-white/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">{t('chat.thinking', 'Analyzing your request...')}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Floating */}
      <div className="p-4 bg-[#f7faff]">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={defaultPlaceholder}
              disabled={isLoading}
              className={`w-full px-4 py-3 text-base bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-xl placeholder-gray-500 ${
                inputValue.trim() ? 'pr-12' : ''
              }`}
            />
            {inputValue.trim() && (
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface 