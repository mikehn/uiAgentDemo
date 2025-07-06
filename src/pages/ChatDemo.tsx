import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'

function ChatDemo() {
  const { t } = useTranslation()
  
  return (
    <Layout title={t('chatDemo')}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{t('chatDemo')}</h3>
            <p className="text-gray-600 text-lg">{t('chatDemoDesc')}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ChatDemo 