import { Link, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import OpenAIKeyModal from './OpenAIKeyModal'
import Settings from 'pages/Settings'
import { aiService } from '@/services/AI/Ai.srvice'
import { useTranslation } from 'react-i18next'
import Layout from './Layout'
import ComponentsShowcase from 'pages/ComponentsShowcase'
import ChatDemo from 'pages/ChatDemo'

function App() {
  const { t, i18n } = useTranslation()

  // Determine if we already have an API key (env var or localStorage)
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY
  const [apiKey, setApiKey] = useState<string>(() => envApiKey || (typeof window !== 'undefined' ? localStorage.getItem('OPENAI_API_KEY') || '' : ''))
  const [isModalOpen, setIsModalOpen] = useState(!apiKey)

  const handleSaveKey = (key: string) => {
    localStorage.setItem('OPENAI_API_KEY', key)
    setApiKey(key)
    setIsModalOpen(false)
    aiService.updateApiKey(key)
  }

  const isRTL = i18n.language === 'he'
  
  return (
    <>
      {/* OpenAI key modal */}
      <OpenAIKeyModal isOpen={isModalOpen} onSave={handleSaveKey} />

      <Routes>
        <Route
          path="/"
          element={
            <Layout title={t('appTitle')}>
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    {t('homeWelcome')}
                  </p>
                </div>
                
                <div className="grid gap-6 max-w-2xl mx-auto">
                  <Link 
                    to="/components" 
                    className="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                  >
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                          {t('componentsShowcase')}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {t('componentsShowcaseDesc')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg 
                          className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    to="/chat" 
                    className="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                  >
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                          {t('chatDemo')}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {t('chatDemoDesc')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg 
                          className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors duration-200" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    to="/settings" 
                    className="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                  >
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors duration-200">
                          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors duration-200">
                          {t('settings.title')}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {t('settings.openaiConfigDesc')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg 
                          className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition-colors duration-200" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </Layout>
          }
        />
        <Route path="/components" element={<ComponentsShowcase />} />
        <Route path="/chat" element={<ChatDemo />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  )
}

export default App
