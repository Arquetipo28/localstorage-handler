function localStorageAvailable () {
  const available = typeof localStorage !== 'undefined'
  if (!available) throw new Error('LocalStorage not available')
}

// handle manages localStorage of any value returned by the
// passed function argument
// @block = function
function handle (block, identifier = null) {
  try {
    localStorageAvailable()
    const defaultIdentifier  = block.name
    const selectedIdentifier = identifier || defaultIdentifier
    const storedData         = localStorage.getItem(selectedIdentifier)
    if (storedData) return storedData

    const blockResult = block()
    localStorage.setItem(selectedIdentifier, blockResult)
    return blockResult
  } catch (e) {
    return null
  }
}

module.exports = { handle }

