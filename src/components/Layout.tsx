import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

interface LayoutProps {
  title: string
  children: React.ReactNode
  className?: string
}

function Layout({ title, children, className = '' }: LayoutProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  
  const isHomePage = location.pathname === '/'
  const isRTL = i18n.language === 'he'
  
  const handleLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en'
    i18n.changeLanguage(newLang)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center h-16">
            {/* Back button - always on the left visually */}
            <div className={`${isRTL ? 'order-3' : 'order-1'} flex items-center`}>
              {!isHomePage ? (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  aria-label={t('layout.back')}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 19l-7-7 7-7" 
                    />
                  </svg>
                </button>
              ) : (
                <div className="w-10 h-10" />
              )}
            </div>

            {/* Center section - Title */}
            <div className="order-2 flex-1 text-center px-4">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {title}
              </h1>
            </div>

            {/* Language switcher - always on the right visually */}
            <div className={`${isRTL ? 'order-1' : 'order-3'} flex items-center`}>
              <button
                onClick={handleLanguageChange}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label={t('layout.switchLanguage')}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout 