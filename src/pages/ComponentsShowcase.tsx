import { useTranslation } from 'react-i18next'

function ComponentsShowcase() {
  const { t } = useTranslation()
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">{t('componentsShowcase')}</h2>
      <p>{t('componentsShowcaseDesc')}</p>
    </div>
  )
}

export default ComponentsShowcase 