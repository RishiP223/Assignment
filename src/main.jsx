import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PreviewWrapper } from './NotesApp'  // We will create NotesApp.jsx

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PreviewWrapper />
  </React.StrictMode>
)
