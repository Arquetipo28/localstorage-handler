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

// Look for item presence in localStorage based on passed identifier
function storedItem (identifier, force) {
  const storedData = localStorage.getItem(identifier)
  const parsedStoredData = parsedValue(storedData)
  const expired = expiredItem(parsedStoredData)
  if (storedData && !force && !expired) return parsedStoredData.value
}

function executeCallback (block) {
  return typeof block !== 'function' ? block : block()
}

// [Function: saveItem] takes care about format data and store the item
// @value      = result of callback
// @settings   = {...@options}
// @identifier = string
function saveItem (value, settings, identifier) {
  const expire = settings.expire ? expireDate(settings.expire) : null
  const options = { ...settings, identifier, expire }
  const itemToSave = JSON.stringify({ value, options })
  localStorage.setItem(identifier, itemToSave)
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

    const foundItem = storedItem(selectedIdentifier, options.force)
    if (foundItem) return foundItem

    const blockResult = executeCallback(block)
    saveItem(blockResult, options, selectedIdentifier)
    return blockResult
  } catch (e) {
    console.error(e)
    return undefined
  }
}

module.exports = { handle }
