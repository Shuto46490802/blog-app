// react
import ReactDOM from 'react-dom/client'

// src
import reportWebVitals from './reportWebVitals'
import './index.css'
import './Styles/animations.scss'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './Styles/global.scss'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
