import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TasksProvider } from './context/TasksContext.jsx'
import { LeadsProvider } from './context/LeadsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <TasksProvider>
        <LeadsProvider>
          <BrowserRouter basename="/Whiterock-CRM">
            <App />
          </BrowserRouter>
        </LeadsProvider>
      </TasksProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
