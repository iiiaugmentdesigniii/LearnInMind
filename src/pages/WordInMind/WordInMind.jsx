import { useState } from 'react'
import './WordInMind.css'
import { learningAreas } from './learningAreas'
import {
  exportLearningPack,
  importLearningPack,
} from '../../utils/learnInMindFiles'

function WordInMind({ onBack }) {
  // ========================================
  // PRACTICE WORDS
  // ========================================

  const words = [
    {
      word: 'Eloquent',
      definition: 'Able to express ideas clearly and effectively',
      learningArea: 'WordInMind',
      hints: [
        'It starts with the letter E.',
        'It describes someone who communicates very effectively.',
        'It begins with "Elo...".',
      ],
    },
    {
      word: 'Resilient',
      definition: 'Able to recover quickly from difficulty',
      learningArea: 'WordInMind',
      hints: [
        'It starts with the letter R.',
        'It describes someone who can bounce back.',
        'It begins with "Res...".',
      ],
    },
    {
      word: 'Nostalgia',
      definition: 'A sentimental longing for the past',
      learningArea: 'WordInMind',
      hints: [
        'It starts with the letter N.',
        'It is often connected with memories.',
        'It begins with "Nos...".',
      ],
    },
  ]

  // ========================================
  // PAGE / PRACTICE STATE
  // ========================================

  const [currentTab, setCurrentTab] = useState('practice')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [hintLevel, setHintLevel] = useState(0)
  const [rating, setRating] = useState('')

  // ========================================
  // MY WORDS STATE
  // ========================================

  const [myWords, setMyWords] = useState(() => {
  const savedWords =
    localStorage.getItem('learnInMindItems')

  if (savedWords) {
    return JSON.parse(savedWords)
  }

  return []
})

const [importMessage, setImportMessage] =
  useState('')

  // ========================================
  // IMAGE STATE
  // ========================================

  const [wordImage, setWordImage] = useState(null)
  const [wordImagePreview, setWordImagePreview] = useState('')

  // ========================================
  // ADD WORD STATE
  // ========================================

  const [newWord, setNewWord] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const [newHint1, setNewHint1] = useState('')
  const [newHint2, setNewHint2] = useState('')
  const [newHint3, setNewHint3] = useState('')

  // ========================================
  // SHARED LEARNING AREA
  // ========================================

  const [
    selectedLearningAreaName,
    setSelectedLearningAreaName,
  ] = useState('WordInMind')

  const [newCategory, setNewCategory] =
    useState('Common Objects')

  const [saveMessage, setSaveMessage] = useState('')

  // ========================================
  // SELECTED LEARNING AREA
  // ========================================

  const selectedLearningArea = learningAreas.find(
    (area) =>
      area.name === selectedLearningAreaName
  )

  // ========================================
  // FILTER PRACTICE WORDS
  // ========================================

  const practiceWords = [
    ...words,
    ...myWords,
  ].filter(
    (word) =>
      word.learningArea ===
      selectedLearningAreaName
  )

  const currentWord =
    practiceWords[currentWordIndex]

  const correctWord =
    currentWord?.word ?? ''

  const hints =
    currentWord?.hints ?? []

  // ========================================
  // FILTER MY WORDS
  // ========================================

  const filteredMyWords = myWords.filter(
    (word) =>
      word.learningArea ===
      selectedLearningAreaName
  )

  // ========================================
  // PRACTICE FUNCTIONS
  // ========================================

  function checkAnswer() {
    if (!currentWord) {
      return
    }

    if (
      answer.trim().toLowerCase() ===
      correctWord.toLowerCase()
    ) {
      setFeedback('correct')
      setRating('')
    } else {
      setFeedback('incorrect')
    }
  }

  function showNextHint() {
    if (!currentWord) {
      return
    }

    if (hintLevel < hints.length) {
      setHintLevel(hintLevel + 1)
    }
  }

  function revealAnswer() {
    if (!currentWord) {
      return
    }

    setAnswer(correctWord)
    setFeedback('revealed')
    setRating('')
  }

  function rateWord(selectedRating) {
    setRating(selectedRating)

    setTimeout(() => {
      goToNextWord()
    }, 500)
  }

  function goToNextWord() {
    if (practiceWords.length === 0) {
      return
    }

    setCurrentWordIndex(
      (currentWordIndex + 1) %
        practiceWords.length
    )

    setAnswer('')
    setFeedback('')
    setHintLevel(0)
    setRating('')
  }

  // ========================================
  // LEARNING AREA FUNCTION
  // ========================================

  function handleLearningAreaChange(event) {
    const selectedAreaName =
      event.target.value

    setSelectedLearningAreaName(
      selectedAreaName
    )

    const selectedArea =
      learningAreas.find(
        (area) =>
          area.name === selectedAreaName
      )

    if (
      selectedArea &&
      selectedArea.categories.length > 0
    ) {
      setNewCategory(
        selectedArea.categories[0]
      )
    } else {
      setNewCategory('')
    }

    setCurrentWordIndex(0)

    setAnswer('')
    setFeedback('')
    setHintLevel(0)
    setRating('')
    setSaveMessage('')
  }

  // ========================================
  // IMAGE FUNCTION
  // ========================================

  function handleWordImageChange(event) {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    setWordImage(file)

    const previewUrl =
      URL.createObjectURL(file)

    setWordImagePreview(previewUrl)
  }

  // ========================================
  // SAVE NEW WORD
  // ========================================

  function saveNewWord() {
    if (
      newWord.trim() === '' ||
      newDefinition.trim() === ''
    ) {
      setSaveMessage(
        'Please enter both a word and a definition.'
      )

      return
    }

    const savedWord = {
      id: Date.now(),
      word: newWord,
      definition: newDefinition,
      hints: [
        newHint1,
        newHint2,
        newHint3,
      ],
      learningArea:
        selectedLearningAreaName,
      category: newCategory,
      image: wordImagePreview,
    }

    const updatedWords = [
  ...myWords,
  savedWord,
]

setMyWords(updatedWords)

localStorage.setItem(
  'learnInMindItems',
  JSON.stringify(updatedWords)
)

    setSaveMessage(
      `Saved: ${newWord}`
    )

    setNewWord('')
    setNewDefinition('')
    setNewHint1('')
    setNewHint2('')
    setNewHint3('')

    if (
      selectedLearningArea &&
      selectedLearningArea.categories.length > 0
    ) {
      setNewCategory(
        selectedLearningArea.categories[0]
      )
    }

    setWordImage(null)
    setWordImagePreview('')
  }

  // ========================================
// EXPORT WORDINMIND
// ========================================

function exportMyWords() {
  exportLearningPack({
    module: 'WordInMind',
    title: 'My WordInMind Items',
    items: myWords,
  })
}

// ========================================
// IMPORT WORDINMIND
// ========================================

async function importMyWords(event) {
  const file = event.target.files[0]

  if (!file) {
    return
  }

  try {
    const learningPack =
      await importLearningPack(file)

    if (learningPack.module !== 'WordInMind') {
      setImportMessage(
        `This file belongs to ${learningPack.module}, not WordInMind.`
      )

      event.target.value = ''
      return
    }

    const importedWords =
      learningPack.items

    const updatedWords = [
      ...myWords,
      ...importedWords,
    ]

    setMyWords(updatedWords)

    localStorage.setItem(
      'learnInMindItems',
      JSON.stringify(updatedWords)
    )

    setImportMessage(
      `Imported ${importedWords.length} item${
        importedWords.length === 1
          ? ''
          : 's'
      }.`
    )
  } catch (error) {
    setImportMessage(error.message)
  }

  event.target.value = ''
}

  // ========================================
  // ANSWER STATUS
  // ========================================

  const answerIsKnown =
    feedback === 'correct' ||
    feedback === 'revealed'

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="app">

      <section className="word-page">

        {/* =================================
            BACK BUTTON
            ================================= */}

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to LearnInMind
        </button>

        {/* =================================
            HEADER
            ================================= */}

        <header className="word-header">

          <div className="module-icon">
            🧠
          </div>

          <h1>
            WordInMind
          </h1>

          <p>
            Practice word recall, learn new
            vocabulary, and add words that
            matter to you.
          </p>

        </header>

        {/* =================================
            SHARED LEARNING AREA
            ================================= */}

        <div className="learning-area-selector">

          <label htmlFor="learning-area">
            Learning Area
          </label>

          <select
            id="learning-area"
            className="practice-answer"
            value={
              selectedLearningAreaName
            }
            onChange={
              handleLearningAreaChange
            }
          >

            {learningAreas.map((area) => (
              <option
                key={area.name}
                value={area.name}
              >
                {area.name}
              </option>
            ))}

          </select>

        </div>

        {/* =================================
            PRACTICE
            ================================= */}

        {currentTab === 'practice' && (
          <section className="practice-card">

            <div className="practice-label">
              PRACTICE
            </div>

            {/* No words yet */}

            {!currentWord && (
              <div className="no-practice-words">

                <h2>
                  No practice words in{' '}
                  {selectedLearningAreaName} yet.
                </h2>

                <p>
                  Use "+ Add My Own Word" to
                  add your first word.
                </p>

              </div>
            )}

            {/* Practice word exists */}

            {currentWord && (
              <>

                <h2>
                  {currentWord.definition}
                </h2>

                {/* =================================
                    PRACTICE IMAGE
                    ================================= */}

                <div className="word-visual">

                  {currentWord.image ? (
                    <img
                      src={currentWord.image}
                      alt=""
                      className="practice-word-image"
                    />
                  ) : (
                    <div className="visual-placeholder">
                      🗣️
                    </div>
                  )}

                </div>

                <label
                  className="answer-label"
                  htmlFor="practice-answer"
                >
                  What word matches this
                  meaning?
                </label>

                <input
                  id="practice-answer"
                  className="practice-answer"
                  type="text"
                  placeholder="Type the word..."
                  value={answer}
                  onChange={(event) =>
                    setAnswer(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter'
                    ) {
                      checkAnswer()
                    }
                  }}
                />

                <button
                  className="primary-button"
                  onClick={checkAnswer}
                >
                  Check Answer
                </button>

                {/* =================================
                    FEEDBACK
                    ================================= */}

                {feedback === 'correct' && (
                  <p className="feedback-message correct">
                    ✓ Correct — {correctWord}
                  </p>
                )}

                {feedback === 'incorrect' && (
                  <p className="feedback-message incorrect">
                    ✕ Not quite. Try again or
                    use a hint.
                  </p>
                )}

                {feedback === 'revealed' && (
                  <p className="feedback-message revealed">
                    Answer revealed —{' '}
                    {correctWord}
                  </p>
                )}

                {/* =================================
                    HINTS
                    ================================= */}

                {hintLevel > 0 && (
                  <div className="hint-box">

                    {hints
                      .slice(0, hintLevel)
                      .map(
                        (hint, index) => (
                          <p key={index}>

                            <strong>
                              Hint{' '}
                              {index + 1}:
                            </strong>{' '}

                            {hint}

                          </p>
                        )
                      )}

                  </div>
                )}

                {/* =================================
                    PRACTICE TOOLS
                    ================================= */}

                <div className="practice-tools">

                  <button
                    className="secondary-button"
                    onClick={showNextHint}
                    disabled={
                      hintLevel >=
                      hints.length
                    }
                  >
                    Hint
                  </button>

                  <button
                    className="secondary-button"
                    onClick={revealAnswer}
                  >
                    Reveal Answer
                  </button>

                </div>

                {/* =================================
                    MEMORY RATING
                    ================================= */}

                {answerIsKnown && (
                  <section className="rating-section">

                    <p className="rating-title">
                      How well do you know this
                      word?
                    </p>

                    <div className="rating-buttons">

                      <button
                        className="rating-button again"
                        onClick={() =>
                          rateWord('Again')
                        }
                      >

                        <strong>
                          Again
                        </strong>

                        <span>
                          10 min
                        </span>

                      </button>

                      <button
                        className="rating-button hard"
                        onClick={() =>
                          rateWord('Hard')
                        }
                      >

                        <strong>
                          Hard
                        </strong>

                        <span>
                          1 day
                        </span>

                      </button>

                      <button
                        className="rating-button got-it"
                        onClick={() =>
                          rateWord('Got It')
                        }
                      >

                        <strong>
                          Got It
                        </strong>

                        <span>
                          3 days
                        </span>

                      </button>

                    </div>

                    {rating && (
                      <p className="rating-confirmation">
                        Selected: {rating}
                      </p>
                    )}

                  </section>
                )}

              </>
            )}

          </section>
        )}

        {/* =================================
            ADD MY OWN WORD
            ================================= */}

        {currentTab === 'add' && (
          <section className="practice-card add-word-card">

            <div className="practice-label">
              ADD MY OWN WORD
            </div>

            <h2>
              Add a word you want to
              remember
            </h2>

            <div className="add-word-form">

              {/* =================================
                  CURRENT LEARNING AREA
                  ================================= */}

              <div className="current-learning-area">

                <span>
                  Learning Area
                </span>

                <strong>
                  {selectedLearningAreaName}
                </strong>

              </div>

              {/* =================================
                  WORD
                  ================================= */}

              <label>
                Word

                <input
                  className="practice-answer"
                  type="text"
                  placeholder="Example: Dashboard"
                  value={newWord}
                  onChange={(event) =>
                    setNewWord(
                      event.target.value
                    )
                  }
                />
              </label>

              {/* =================================
                  DEFINITION
                  ================================= */}

              <label>
                Definition

                <textarea
                  className="word-textarea"
                  placeholder="What does this word mean?"
                  value={newDefinition}
                  onChange={(event) =>
                    setNewDefinition(
                      event.target.value
                    )
                  }
                />
              </label>

              {/* =================================
                  HINT 1
                  ================================= */}

              <label>
                Hint 1

                <input
                  className="practice-answer"
                  type="text"
                  placeholder="First hint"
                  value={newHint1}
                  onChange={(event) =>
                    setNewHint1(
                      event.target.value
                    )
                  }
                />
              </label>

              {/* =================================
                  HINT 2
                  ================================= */}

              <label>
                Hint 2

                <input
                  className="practice-answer"
                  type="text"
                  placeholder="Second hint"
                  value={newHint2}
                  onChange={(event) =>
                    setNewHint2(
                      event.target.value
                    )
                  }
                />
              </label>

              {/* =================================
                  HINT 3
                  ================================= */}

              <label>
                Hint 3

                <input
                  className="practice-answer"
                  type="text"
                  placeholder="Third hint"
                  value={newHint3}
                  onChange={(event) =>
                    setNewHint3(
                      event.target.value
                    )
                  }
                />
              </label>

              {/* =================================
                  CATEGORY
                  ================================= */}

              <label>
                Category

                <select
                  className="practice-answer"
                  value={newCategory}
                  onChange={(event) =>
                    setNewCategory(
                      event.target.value
                    )
                  }
                >

                  {selectedLearningArea
                    ?.categories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}

                </select>

              </label>

              {/* =================================
                  IMAGE
                  ================================= */}

              <div className="word-image-field">

                <label htmlFor="wordImage">
                  Image
                </label>

                <input
                  id="wordImage"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleWordImageChange
                  }
                />

                {wordImagePreview && (
                  <img
                    src={
                      wordImagePreview
                    }
                    alt="Selected word"
                    className="word-image-preview"
                  />
                )}

              </div>

              {/* =================================
                  SAVE BUTTON
                  ================================= */}

              <button
                className="primary-button"
                onClick={saveNewWord}
              >
                Save Word
              </button>

              {saveMessage && (
                <p className="save-message">
                  {saveMessage}
                </p>
              )}

            </div>

          </section>
        )}

        {/* =================================
            MY WORDS
            ================================= */}

        {currentTab === 'myWords' && (
          <section className="practice-card my-words-section">

            <div className="practice-label">
              MY WORDS
            </div>

            <h2>
              Your saved words
            </h2>
            <button
  className="secondary-button"
  onClick={exportMyWords}
  disabled={myWords.length === 0}
>
  ↓ Export WordInMind
</button>

<label className="secondary-button import-button">
  ↑ Import WordInMind

  <input
    type="file"
    accept=".learninmind"
    onChange={importMyWords}
    hidden
  />
</label>

{importMessage && (
  <p className="save-message">
    {importMessage}
  </p>
)}
            {/* =================================
                CURRENT LEARNING AREA
                ================================= */}

            <div className="current-learning-area">

              <span>
                Learning Area
              </span>

              <strong>
                {selectedLearningAreaName}
              </strong>

            </div>

            {filteredMyWords.length === 0 ? (
              <p className="empty-words-message">
                You have not added any words
                to {selectedLearningAreaName}{' '}
                yet.
              </p>
            ) : (
              <div className="my-words-list">

                {filteredMyWords.map(
                  (savedWord) => (
                    <div
                      className="my-word-card"
                      key={savedWord.id}
                    >

                      {/* =================================
                          WORD TITLE
                          ================================= */}

                      <h3 className="my-word-title">
                        {savedWord.word}
                      </h3>

                      {/* =================================
                          IMAGE + INFORMATION

                          Desktop:
                          image left / info right

                          Phone:
                          image top / info below
                          ================================= */}

                      <div className="my-word-content">

                        {savedWord.image && (
                          <div className="my-word-image-container">

                            <img
                              src={
                                savedWord.image
                              }
                              alt={
                                savedWord.word
                              }
                              className="my-word-image"
                            />

                          </div>
                        )}

                        <div className="my-word-details">

                          <p>
                            <strong>
                              Definition:
                            </strong>{' '}

                            {
                              savedWord.definition
                            }
                          </p>

                          <p>
                            <strong>
                              Learning Area:
                            </strong>{' '}

                            {
                              savedWord.learningArea
                            }
                          </p>

                          <p>
                            <strong>
                              Category:
                            </strong>{' '}

                            {
                              savedWord.category
                            }
                          </p>

                          {/* =================================
                              HINTS
                              ================================= */}

                          {savedWord.hints.some(
                            (hint) =>
                              hint.trim() !== ''
                          ) && (
                            <div className="my-word-hints">

                              <strong>
                                Hints:
                              </strong>

                              {savedWord.hints.map(
                                (
                                  hint,
                                  index
                                ) =>
                                  hint.trim() !==
                                    '' && (
                                    <p
                                      key={
                                        index
                                      }
                                    >
                                      Hint{' '}
                                      {index +
                                        1}
                                      :{' '}
                                      {hint}
                                    </p>
                                  )
                              )}

                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </section>
        )}

        {/* =================================
            BOTTOM NAVIGATION
            ================================= */}

        <nav className="word-bottom-nav">

          <button
            className={
              currentTab === 'practice'
                ? 'active'
                : ''
            }
            onClick={() =>
              setCurrentTab('practice')
            }
          >
            Practice
          </button>

          <button
            className={
              currentTab === 'add'
                ? 'active'
                : ''
            }
            onClick={() => {
              setCurrentTab('add')
              setSaveMessage('')
            }}
          >
            + Add My Own Word
          </button>

          <button
            className={
              currentTab === 'myWords'
                ? 'active'
                : ''
            }
            onClick={() =>
              setCurrentTab('myWords')
            }
          >
            My Words
          </button>

        </nav>

      </section>

    </main>
  )
}

export default WordInMind