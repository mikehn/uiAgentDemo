import { Link, Routes, Route } from 'react-router-dom'
import ComponentsShowcase from 'pages/ComponentsShowcase'
import ChatDemo from 'pages/ChatDemo'

function App() {
  return (
    <div className="relative overflow-hidden bg-white min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-8 space-y-4">
              <h1 className="text-3xl font-bold">Gen UI App</h1>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <Link className="text-blue-600 underline" to="/components">
                    Components Showcase
                  </Link>
                </li>
                <li>
                  <Link className="text-blue-600 underline" to="/chat">
                    Chat Demo
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
