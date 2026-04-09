import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './services/mockAdapter.js';
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TasksProvider } from './context/TasksContext.jsx'
import { LeadsProvider } from './context/LeadsContext.jsx'
import { PromotionsProvider } from './context/PromotionsContext.jsx'
import { LendersProvider } from './context/LendersContext.jsx'
import { KnowledgeBaseProvider } from './context/KnowledgeBaseContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <TasksProvider>
        <LeadsProvider>
          <PromotionsProvider>
            <LendersProvider>
              <KnowledgeBaseProvider>
                <BrowserRouter basename="/AlphaFunding">
                  <App />
                </BrowserRouter>
              </KnowledgeBaseProvider>
            </LendersProvider>
          </PromotionsProvider>
        </LeadsProvider>
      </TasksProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
