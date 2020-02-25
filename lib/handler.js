function localStorageAvailable () {
  const available = typeof localStorage !== 'undefined'
  if (!available) throw new Error('LocalStorage not available')
}

function parsedValue (value) {
  if (typeof value === 'string') {
    try {
      const json = JSON.parse(value)
      return json
    } catch {
      return value
    }
  } else {
    return value
  }
}

function expireDate (opts = { months: null, hours: null, minutes: null }) {
  const currentDate  = new Date()
  const monthsToAdd  = currentDate.getMonth() + (opts.months || 0)
  const hoursToAdd   = currentDate.getHours() + (opts.hours || 1)
  const minutesToAdd = currentDate.getMinutes() + (opts.minutes || 0)

  // Set expiration time
  currentDate.setMonth(monthsToAdd)
  currentDate.setHours(hoursToAdd)
  currentDate.setMinutes(minutesToAdd)

  return currentDate
}

function expiredItem (item) {
  try {
    const expiresAt = item.options.expire
    if (!expiresAt) return false

    const currentDate    = new Date()
    const expirationDate = new Date(expiresAt)
    return currentDate > expirationDate
  } catch {
    return true
  }
}

// [Function: handle] manages localStorage of any value
// returned by the passed function argument
// @block   = function
// @options = { force: boolean, identifier: string, expire: @expire }
// @expire -> { months: integer, hours: integer, minutes: integer }
function handle (block, options = {}) {
  try {
    localStorageAvailable()
    const defaultIdentifier  = block.name
    const selectedIdentifier = options.identifier || defaultIdentifier
    if (!selectedIdentifier) throw new Error('Non identifier passed')

    const storedData = localStorage.getItem(selectedIdentifier)
    const parsedStoredData = parsedValue(storedData)
    const expired = expiredItem(parsedStoredData)
    if (storedData && !options.force && !expired) return parsedStoredData.value

    const blockResult = typeof block !== 'function' ? block : block()
    const expire = options.expire ? expireDate(options.expire) : null
    const clearOptions = { ...options, identifier: selectedIdentifier, expire }
    const itemToSave = JSON.stringify({ value: blockResult, options: clearOptions })
    localStorage.setItem(selectedIdentifier, itemToSave)
    return blockResult
  } catch (e) {
    console.error(e)
    return undefined
  }
}

module.exports = { handle }
