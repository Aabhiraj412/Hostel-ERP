import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HomePage from './Pages/HomePage/HomePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomePage/>
  </StrictMode>,
)
