import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainScreen from './MainScreen.tsx'
import ResultsScreen from './ResultsScreen.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/results/:year/:race/:driver" element={<ResultsScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
