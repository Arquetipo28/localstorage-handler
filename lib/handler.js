const DEFAULT_SUFIX = '_handler'

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

function sufixedIdentifier(identifier) {
  const clearedIdentifier = identifier.replace(/ /g, '')
  return `${clearedIdentifier}${DEFAULT_SUFIX}`
}

// [Function: expireDate] takes one argument that can
// be of type string (containning a date) or an object
// with properties { months: integer, hours: integer, minutes: integer }
// @opts = string | object
function expireDate (opts) {
  if (typeof opts === 'string') return new Date(opts)

  const currentDate  = new Date()
  const monthsToAdd  = currentDate.getMonth() + (opts.months || 0)
  const hoursToAdd   = currentDate.getHours() + (opts.hours || 0)
  const minutesToAdd = currentDate.getMinutes() + (opts.minutes || 0)

  // Set expiration time
  currentDate.setMonth(monthsToAdd)
  currentDate.setHours(hoursToAdd)
  currentDate.setMinutes(minutesToAdd)

  return currentDate
}

// Look the passed expire option and format it
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
function storedItem (identifier, force = false) {
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
  // Set expiration date if applies
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
    const defaultIdentifier = block.name
    // Add a sufix to save and retrieve data it in a smart way
    const clearedIdentifier = sufixedIdentifier(options.identifier || defaultIdentifier)
    if (!clearedIdentifier) throw new Error('Non identifier passed')

    const foundItem = storedItem(clearedIdentifier, options.force)
    if (foundItem) return foundItem

    const blockResult = executeCallback(block)
    saveItem(blockResult, options, clearedIdentifier)
    return blockResult
  } catch (e) {
    console.error(e)
    return undefined
  }
}

// [Function: stored] allows to retrieve stored information
// from the localStorage. Also it provide a way to destroy
// data after getting it.
// @options = {
//  identifier: string,
//  cleanAfter: boolean || false
// }
// If not options are passed it will return all handled data
function stored (options) {
  try {
    let storedData
    if (options) {
      const { identifier, cleanAfter } = options
      const clearedIdentifier = sufixedIdentifier(identifier)
      storedData = storedItem(clearedIdentifier)
      if (cleanAfter) destroyStoredItem(clearedIdentifier)
    } else {
      const storedKeys = Object.keys(localStorage).filter(key => {
        return key.includes(DEFAULT_SUFIX)
      })
      storedData = storedKeys.map(key => localStorage[key])
    }
    return storedData
  } catch (e) {
    console.error(e)
    return undefined
  }
}

function destroyStoredItem (identifier) {
  localStorage.removeItem(identifier)
}

module.exports = { handle, stored }
