import { useTranslation } from 'react-i18next'

function ChatDemo() {
  const { t } = useTranslation()
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">{t('chatDemo')}</h2>
      <p>{t('chatDemoDesc')}</p>
    </div>
  )
}

export default ChatDemo 