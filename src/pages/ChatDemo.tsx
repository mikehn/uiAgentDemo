import { useTranslation } from 'react-i18next'
import ChatInterface from '../components/Chat/ChatInterface.component'

function ChatDemo() {
  const { t } = useTranslation()
  
  return (
    <div className="h-screen w-screen overflow-hidden" style={{ backgroundColor: '#f7faff' }}>
      <ChatInterface 
        className="h-full w-full"
        welcomeMessage={t('chat.bankingWelcome', 'Welcome to your Banking Assistant! I can help you with expenses, loans, lost cards, and more. How can I assist you today?')}
        placeholder={t('chat.bankingPlaceholder', 'Ask about your expenses, request a loan, report a lost card...')}
      />
    </div>
  )
}

export default ChatDemo 