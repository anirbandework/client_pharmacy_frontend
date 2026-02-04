import React from 'react'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
  const navigate = useNavigate()

  const handleEnter = () => {
    navigate('/daily-records')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 flex items-center justify-center font-bauhaus">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-7xl font-bold text-white mb-8 animate-bounce-subtle">
          Welcome
        </h1>
        <button
          onClick={handleEnter}
          className="bg-white text-primary-600 px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-glow-lg hover:shadow-glow hover:scale-110 active:scale-95 transform"
        >
          Enter
        </button>
      </div>
    </div>
  )
}

export default Welcome