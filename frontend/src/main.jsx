import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { store } from './store'
import App from './App'
import ThemeProvider from './components/theme/ThemeProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
          <Toaster 
            position="top-right"
            duration={4000}
            richColors
            closeButton
          />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)