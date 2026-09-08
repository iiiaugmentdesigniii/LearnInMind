import { useState } from 'react'
import './App.css'
import WordInMind from './pages/WordInMind/WordInMind'

const modules = [
  {
    name: 'ArtInMind',
    description: 'Learn art terms, styles, and techniques',
    icon: '🎨',
    popular: false,
  },
  {
    name: 'CarInMind',
    description: 'Learn vehicle parts and terminology',
    icon: '🚗',
    popular: false,
  },
  {
    name: 'MedicalInMind',
    description: 'Learn medical terms and anatomy',
    icon: '🩺',
    popular: true,
  },
  {
    name: 'MeasureInMind',
    description: 'Practice measurements and size estimation',
    icon: '📏',
    popular: true,
  },
  {
    name: 'TechInMind',
    description: 'Learn technology and programming terminology',
    icon: '💻',
    popular: false,
  },
  {
    name: 'ToolsInMind',
    description: 'Learn tools, sockets, and sizes',
    icon: '🔧',
    popular: true,
  },
  {
    name: 'WordInMind',
    description: 'Strengthen vocabulary and word recall',
    icon: '🧠',
    popular: true,
  },
]

function App() {
  const [search, setSearch] = useState('')
  const [currentScreen, setCurrentScreen] = useState('home')

  const popularModules = modules
    .filter((module) => module.popular)
    .slice(0, 2)

  const alphabeticalModules = [...modules].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const filteredModules = alphabeticalModules.filter((module) => {
    const searchText = search.toLowerCase()

    return (
      module.name.toLowerCase().includes(searchText) ||
      module.description.toLowerCase().includes(searchText)
    )
  })

  if (currentScreen === 'word') {
  return (
    <WordInMind
      onBack={() => setCurrentScreen('home')}
    />
  )
}



  return (
    <main className="app">
      <header>
        <h1>LearnInMind</h1>
        <p>What would you like to practice?</p>
      </header>

      <section className="search-section">
        <label htmlFor="module-search" className="search-label">
          Search learning areas
        </label>

        <div className="search-box">
          <span className="search-icon">🔍</span>

          <input
            id="module-search"
            type="search"
            placeholder="Search words, tools, medical, measurements..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <h2>Most Used</h2>
          <p>Your quickest learning choices</p>
        </div>

        <div className="learning-grid most-used-grid">
          {popularModules.map((module) => (
            <button
              className="learning-card"
              key={`popular-${module.name}`}
              onClick={() => {
                if (module.name === 'WordInMind') {
                  setCurrentScreen('word')
                }
              }}
            >
              <span className="icon">{module.icon}</span>
              <h2>{module.name}</h2>
              <p>{module.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="landing-section all-section">
        <div className="section-heading">
          <h2>All Learning Areas</h2>
          <p>A–Z</p>
        </div>

        {filteredModules.length > 0 ? (
          <div className="learning-grid">
            {filteredModules.map((module) => (
              <button
                className="learning-card"
                key={`all-${module.name}`}
                onClick={() => {
                  if (module.name === 'WordInMind') {
                    setCurrentScreen('word')
                  }
                }}
              >
                <span className="icon">{module.icon}</span>
                <h2>{module.name}</h2>
                <p>{module.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No learning areas found</h3>
            <p>Try another search term.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App