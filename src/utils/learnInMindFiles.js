// ========================================
// LEARNINMIND FILE UTILITIES
// ========================================

// This creates a portable LearnInMind file.
// WordInMind, GuitarsInMind, and future modules
// can all use this same function.

export function exportLearningPack({
  module,
  title,
  items,
}) {
  const learningPack = {
    format: 'LearnInMind',
    version: 1,

    module,
    title,

    exportedAt: new Date().toISOString(),

    items,
  }

  const fileContents = JSON.stringify(
    learningPack,
    null,
    2
  )

  const blob = new Blob(
    [fileContents],
    {
      type: 'application/json',
    }
  )

  const fileUrl = URL.createObjectURL(blob)

  const downloadLink =
    document.createElement('a')

  downloadLink.href = fileUrl

  downloadLink.download =
    `${module}.learninmind`

  document.body.appendChild(downloadLink)

  downloadLink.click()

  document.body.removeChild(downloadLink)

  URL.revokeObjectURL(fileUrl)
}

// ========================================
// IMPORT LEARNINMIND FILE
// ========================================

export function importLearningPack(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const learningPack = JSON.parse(
          event.target.result
        )

        // Make sure this is actually
        // a LearnInMind file.
        if (
          learningPack.format !== 'LearnInMind' ||
          !Array.isArray(learningPack.items)
        ) {
          reject(
            new Error(
              'This is not a valid LearnInMind file.'
            )
          )
          return
        }

        resolve(learningPack)
      } catch {
        reject(
          new Error(
            'The LearnInMind file could not be read.'
          )
        )
      }
    }

    reader.onerror = () => {
      reject(
        new Error(
          'The file could not be opened.'
        )
      )
    }

    reader.readAsText(file)
  })
}