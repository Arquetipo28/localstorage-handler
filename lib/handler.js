function localStorageAvailable () {
  const available = typeof localStorage !== 'undefined'
  if (!available) throw new Error('LocalStorage not available')
}

// [Function: handle] manages localStorage of any value
// returned by the passed function argument
// @block = function
// @options = { force: boolean, identifier: string }
function handle (block, options = {}) {
  try {
    localStorageAvailable()
    const defaultIdentifier  = block.name
    const selectedIdentifier = options.identifier || defaultIdentifier
    if (!selectedIdentifier) throw new Error('Non identifier passed')

    const storedData = localStorage.getItem(selectedIdentifier)
    if (storedData && !options.force) return storedData

    let blockResult = undefined
    if (typeof block !== 'function') {
      blockResult = block
    } else {
      blockResult = block()
    }
    localStorage.setItem(selectedIdentifier, blockResult)
    return blockResult
  } catch (e) {
    console.error(e)
    return undefined
  }
}

module.exports = { handle }

