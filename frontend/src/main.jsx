import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from '../Store.js'
import './tailwind.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../toastStyles.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer />
    <App />
    </Provider>
)
