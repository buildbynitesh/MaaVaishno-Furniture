import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { store } from './redux/store.js'
import './index.css'
import axios from 'axios'

// Set default baseURL for axios
const defaultApiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://maavaishnofurniture.onrender.com/api' : '/api')
const baseHost = defaultApiUrl.replace(/\/api\/?$/, '')
if (baseHost) {
  axios.defaults.baseURL = baseHost
}

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
