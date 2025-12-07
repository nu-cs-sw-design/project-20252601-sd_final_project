import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SingleSelectionScreen from './SingleSelectionScreen.tsx'
import SingleResultsScreen from './SingleResultsScreen.tsx'
import WelcomeScreen from './WelcomeScreen.tsx'
import ComparisonScreen from './ComparisonScreen.tsx'
import ComparisonResultScreen from './ComparisonResultScreen.tsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen/>} />
        <Route path="/single" element={<SingleSelectionScreen/>} />
        <Route path="/compare" element={<ComparisonScreen/>} />
        <Route path="/results/:year/:race/:driverNumber" element={<SingleResultsScreen/>} />
        <Route path="/results/:year/:race/:firstDriverNumber/:secondDriverNumber" element={<ComparisonResultScreen/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
