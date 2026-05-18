import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './routes/Home'
import { Configure } from './routes/Configure'
import { Workout } from './routes/Workout'
import { Metronome } from './routes/Metronome'
import './App.css'

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/configure" element={<Configure />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/metronome" element={<Metronome />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
