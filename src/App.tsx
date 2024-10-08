import React, { useState } from 'react'
import Layout from './components/Layout'
import Codex from './components/Codex'
import MarkdownEditor from './components/MarkdownEditor'

function App() {
  const [currentView, setCurrentView] = useState<'codex' | 'markdown'>('codex')

  return (
    <Layout>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${currentView === 'codex' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentView('codex')}
        >
          Codex
        </button>
        <button
          className={`px-4 py-2 rounded ${currentView === 'markdown' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentView('markdown')}
        >
          Markdown Editor
        </button>
      </div>
      {currentView === 'codex' ? <Codex /> : <MarkdownEditor />}
    </Layout>
  )
}

export default App