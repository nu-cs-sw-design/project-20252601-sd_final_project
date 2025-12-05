import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SingleAnalysisScreen from './SingleAnalysisScreen.tsx'
import ResultsScreen from './ResultsScreen.tsx'
import WelcomeScreen from './WelcomeScreen.tsx'
import ComparisonScreen from './ComparisonScreen.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen/>} />
        <Route path="/single" element={<SingleAnalysisScreen/>} />
        <Route path="/compare" element={<ComparisonScreen/>} />
        <Route path="/results/:year/:race/:driverNumber" element={<ResultsScreen/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
