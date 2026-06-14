import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'
import './styles/global.css'
import './styles/pages.css'

// Wird vom Prerender-Skript (scripts/prerender.mjs) für jede Route aufgerufen
// und liefert das gerenderte HTML des App-Baums als String zurück.
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
