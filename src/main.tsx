import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App' 
import './index.css' // Borra esta línea si no tienes un archivo index.css en src

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)