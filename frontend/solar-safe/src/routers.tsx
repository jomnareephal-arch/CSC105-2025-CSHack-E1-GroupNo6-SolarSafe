import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CalculatePage from './modules/calculate/CalculatePage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalculatePage />} />
        <Route path="/calculate" element={<CalculatePage />} />
      </Routes>
    </BrowserRouter>
  )
}
