import { Link, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ComponentsShowcase from 'pages/ComponentsShowcase'
import ChatDemo from 'pages/ChatDemo'

function App() {
  const { t, i18n } = useTranslation()
  return (
    <div className="relative overflow-hidden bg-white min-h-screen">
      <div className="absolute top-4 right-4 space-x-2">
        <button onClick={() => i18n.changeLanguage('en')} className="px-2 py-1 border rounded">EN</button>
        <button onClick={() => i18n.changeLanguage('he')} className="px-2 py-1 border rounded">עברית</button>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-8 space-y-4">
              <h1 className="text-3xl font-bold">{t('appTitle')}</h1>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <Link className="text-blue-600 underline" to="/components">
                    {t('componentsShowcase')}
                  </Link>
                </li>
                <li>
                  <Link className="text-blue-600 underline" to="/chat">
                    {t('chatDemo')}
                  </Link>
                </li>
              </ul>
            </div>
          }
        />
        <Route path="/components" element={<ComponentsShowcase />} />
        <Route path="/chat" element={<ChatDemo />} />
      </Routes>
    </div>
  )
}

export default App
