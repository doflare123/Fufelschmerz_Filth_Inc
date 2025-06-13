import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import MinecraftAuthApp from './pages/MinecraftAuthApp.js'
import MinecraftResourcesDashboard from './pages/MinecraftResourcesDashboard.js';
import MinecraftAdminPanel from './pages/MinecraftAdminPanel.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MinecraftAuthApp />} />
        <Route path='/home' element={<MinecraftResourcesDashboard />} />
        <Route path='/admin' element={<MinecraftAdminPanel/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);