import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface OpenAIKeyModalProps {
  isOpen: boolean
  onSave: (apiKey: string) => void
}

function OpenAIKeyModal({ isOpen, onSave }: OpenAIKeyModalProps) {
  const { t, i18n } = useTranslation()
  const [key, setKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isRTL = i18n.language === 'he'

  const handleSave = async () => {
    if (!key.trim()) return
    setIsLoading(true)
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      onSave(key.trim())
      setKey('')
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && key.trim()) {
      handleSave()
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-6 border-b border-gray-200">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse gap-4' : 'gap-4'}`}>
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                      </svg>
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold text-gray-900"
                      >
                        {t('openaiModal.title')}
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('openaiModal.subtitle')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6">
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t('openaiModal.description')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className={`block text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('openaiModal.apiKey')}
                    </label>
                    {/* API-Key input field */}
                    <input
                      type="password"
                      placeholder={t('openaiModal.apiKeyPlaceholder')}
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      autoFocus
                    />
                    <p className={`text-xs text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('openaiModal.getKeyText')}{' '}
                      <a 
                        href="https://platform.openai.com/api-keys" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                      >
                        {t('openaiModal.openaiPlatform')}
                      </a>
                    </p>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className={`flex items-start ${isRTL ? 'flex-row-reverse gap-2' : 'gap-2'}`}>
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.25-4.5l-.02.02A4.014 4.014 0 0016 6c0 1.993-1.007 3.75-2.544 4.787m-.751 1.459A4.016 4.016 0 0110.75 15a4.016 4.016 0 01-2.204-2.754m-.751-1.459A4.014 4.014 0 015.25 6c0-1.993 1.007-3.75 2.544-4.787m.751 1.459c.423-.65.423-1.528 0-2.178" />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-green-800">{t('openaiModal.secureTitle')}</p>
                        <p className="text-xs text-green-700 mt-1">
                          {t('openaiModal.secureDesc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={!key.trim() || isLoading}
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-w-[100px]"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('openaiModal.saving')}
                        </>
                      ) : (
                        <>
                          {t('openaiModal.saveKey')}
                          <svg className={`${isRTL ? 'mr-2' : 'ml-2'} w-4 h-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default OpenAIKeyModal 