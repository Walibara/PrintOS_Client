import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import trustme from './assets/trust-me-bro.jpeg'

function AmplifyHome() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    // IMPORTANT: backend / Amplify routing logic - DO NOT CHANGE - Thank you :)
    let baseUrl = import.meta.env.VITE_API_URL

    if (!baseUrl) {
      if (window.location.hostname.includes('amplifyapp.com')) {
        // Amplify-hosted frontend → CloudFront
        baseUrl = 'https://dkdavnbhgrmho.cloudfront.net'
      } else {
        // Local dev
        baseUrl = 'http://localhost:8080'
      }
    }

    // remove trailing slashes
    baseUrl = baseUrl.replace(/\/+$/, '')

    fetch(`${baseUrl}/api/hello`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Backend returned ${res.status}`)
        }
        return res.text()
      })
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error('Error fetching backend:', err)
        setMessage('Failed to connect to backend')
      })
  }, [])

  return (
    <>
      {/* This page should not be visible */}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {/* Server message*/}
      <h2 style={{ color: '#42b983' }}>{message}</h2>
      
      <img
        src={trustme}
        alt="Trust Me Bro"
        className="trustme-image"
      />

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>
          This page is just to verify that Amplify is connecting to the backend.
          It should not be visible, we can remove it later - Maria
        </p>
      </div>
    </>
  )

}

export default AmplifyHome
