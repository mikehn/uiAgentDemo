import { createRoot } from 'react-dom/client'
import './i18n'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import 'tailwindcss/tailwind.css'
import App from 'components/App'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <I18nextProvider i18n={i18n}>
    {/* "basename" ensures that routes work when the app is served from a sub-path (e.g., GitHub Pages) */}
    <BrowserRouter basename="/uiAgentDemo">
      <App />
    </BrowserRouter>
  </I18nextProvider>
)
