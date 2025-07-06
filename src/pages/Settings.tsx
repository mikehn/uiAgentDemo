import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import { aiService } from '../services/AI/Ai.srvice'

function Settings() {
  const { t, i18n } = useTranslation()
  const [apiKey, setApiKey] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const isRTL = i18n.language === 'he'

  useEffect(() => {
    const stored = localStorage.getItem('OPENAI_API_KEY') || ''
    setApiKey(stored)
  }, [])

  const handleSave = () => {
    if (!apiKey.trim()) return
    localStorage.setItem('OPENAI_API_KEY', apiKey.trim())
    aiService.updateApiKey(apiKey.trim())
    setSavedMessage(t('settings.apiKeySaved'))
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleClear = () => {
    localStorage.removeItem('OPENAI_API_KEY')
    setApiKey('')
  }

  return (
    <Layout title={t('settings.title')}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t('settings.openaiConfig')}</h2>
                <p className="text-sm text-gray-600">{t('settings.openaiConfigDesc')}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* API Key Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.apiKey')}
                </label>
                <input
                  type="password"
                  placeholder={t('settings.apiKeyPlaceholder')}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  {t('settings.apiKeyNote')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <button
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                  className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {t('settings.saveChanges')}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {t('settings.clearKey')}
                </button>
              </div>

              {/* Success Message */}
              {savedMessage && (
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} p-3 bg-green-50 border border-green-200 rounded-lg`}>
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-green-800">{savedMessage}</p>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">{t('settings.aboutTitle')}</h3>
                  <p className="text-sm text-blue-700">
                    {t('settings.aboutDesc')}{' '}
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium underline hover:no-underline"
                    >
                      {t('settings.openaiPlatform')}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Settings 