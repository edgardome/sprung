import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Home: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="home">
      <h1 className="home-title">SPRUNG</h1>
      <p className="home-subtitle">Plyometric Reaction Trainer</p>

      <div className="home-cards">
        <button className="home-card" onClick={() => navigate('/configure')}>
          <span className="home-card-icon">🎯</span>
          <span className="home-card-title">Workout</span>
          <span className="home-card-desc">
            Configure visual workouts — arrows, colors, numbers — and train your
            reactions.
          </span>
        </button>

        <button className="home-card" onClick={() => navigate('/metronome')}>
          <span className="home-card-icon">🥁</span>
          <span className="home-card-title">Metronome</span>
          <span className="home-card-desc">
            Set your tempo and follow the beat for cadence-based plyometric
            drills.
          </span>
        </button>
      </div>
    </div>
  )
}
