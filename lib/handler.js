/**
 * @module handler
 */
/**
 * localStorage functions to wrap callbacks execution
 */

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

/**
 * Takes a regular identifier as 'state' and convert
 * it into the smart necessary 'state_handler'
 *
 * @private
 * @param {*} identifier
 */

function sufixedIdentifier(identifier) {
  const clearedIdentifier = identifier.replace(/ /g, '')
  return `${clearedIdentifier}${DEFAULT_SUFIX}`
}

/**
 * @private
 * @param {object | dateString} options
 * { months: integer, hours: integer, minutes: integer }
 * '2020-02-25T16:59:41.059Z'
 */
function expireDate (options) {
  if (typeof options === 'string') return new Date(options)

  const currentDate  = new Date()
  const monthsToAdd  = currentDate.getMonth() + (options.months || 0)
  const hoursToAdd   = currentDate.getHours() + (options.hours || 0)
  const minutesToAdd = currentDate.getMinutes() + (options.minutes || 0)

  // Set expiration time
  currentDate.setMonth(monthsToAdd)
  currentDate.setHours(hoursToAdd)
  currentDate.setMinutes(minutesToAdd)

  return currentDate
}

/**
 * Look the passed expire option and format it
 * @param {object} item - Argument item
 */
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

/**
 * Look for item presence in localStorage based on passed identifier
 * @param {string} identifier - Argument identifier
 * @param {boolean} force - Allow storage override
 */
function storedItem (identifier, force = false) {
  const storedData = localStorage.getItem(identifier)
  const parsedStoredData = parsedValue(storedData)
  const expired = expiredItem(parsedStoredData)
  if (storedData && !force && !expired) return parsedStoredData.value
}

function executeCallback (block) {
  return typeof block !== 'function' ? block : block()
}

/**
 * [Function: saveItem] takes care about format data and store the item
 * @param {any} value - result of callback
 * @param {object} settings - options to define the execution behavior
 * @param {string} identifier - key to identify data in localStorage
 */
function saveItem (value, settings, identifier) {
  // Set expiration date if applies
  const expire = settings.expire ? expireDate(settings.expire) : null
  const options = { ...settings, identifier, expire }
  const itemToSave = JSON.stringify({ value, options })
  localStorage.setItem(identifier, itemToSave)
}

/**
 * [Function: handle] manages localStorage of any value
 * @param {any} block - Callback or primitive type to be executed or saved
 * @param {object} options - { force: boolean, identifier: string, expire: @expire }
 * @expire { months: integer, hours: integer, minutes: integer }
 */
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

/**
 * Allows to retrieve stored information
 * from the localStorage. Also it provide a way to destroy
 * data after getting it.
 * @param {object | string} options - { identifier: string, cleanAfter: boolean } | 'identifier'
 * If not options are passed it will return all handled data
 */
function stored (options) {
  try {
    let storedData
    if (options) {
      let identifier, cleanAfter
      const stringOptions = typeof options === 'string'
      if (stringOptions) {
        identifier = stringOptions ? options : options.identifier
        cleanAfter = stringOptions ? false : options.cleanAfter
      }
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

/**
 * remove item from localStorage by passing smart identifier
 * @param {string} identifier
 */
function destroyStoredItem (identifier) {
  localStorage.removeItem(identifier)
}

module.exports = { handle, stored }
