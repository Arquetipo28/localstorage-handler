# @arquetipo28/localstorage-handler

localstorage-handler is a javascript function wrapper which allows you to save any kind of data into localStorage passing a serie of arguments to make it more useful. It:
  - Is bases on JavaScript
  - Allow to save JSON and primitive values
  - Provides a way to configure localStorage data saving
  - Allow force data override
  - Allow set data expiration
  - Allow set data key by function name or specific string
  - Allow to retrieve data once and then destroy it 

### Installation and Usage

localStorage-handler requires [Node.js](https://nodejs.org/) v12 to run.

```sh
$ npm install @arquetipo28/localStorage-handler
```

Import it into your project or file
```javascript
// handle is the principal function that will allow you
// to save your data into localStorage
import { handle, stored } from '@arquetipo28/localstorage-handler'
```
### Arguments
Here are described all the arguments you can pass to configure the store of your data with the `handle` function.

```ruby
[Function: handle] (@block, @options)
@block = callback
@options = { force: boolean, identifier: string, expire: @expire }
@expire -> { months: integer, hours: integer, minutes: integer } | dateString
```

And in the other side we have the stored method to retrieve saved information. It also allows you to modify its behavior trough the options.cleanAfter property which specifies if the getted information is going to be deleted after taking it. You can look for some examples below.

```ruby
[Function: stored] (@options)
@options = { identifier: string, cleanAfter: boolean }
```

It is important to define that as default each `@expire` argument will be equal to 0


### Examples (handle)

We provide you some useful examples to know how to implement this package.

Using function name as key with array result:
```javascript
import { handle } from "@arquetipo28/localstorage-handle"
const data = handle(function usersData () {
    // This data will be stored using 'usersData' as key
    return [{}]
})
```

Passing identifier name as key with array result:
```javascript
import { handle } from "@arquetipo28/localstorage-handle"
const data = handle(() => {
    // This data will be stored using 'usersData' as key
    return [{}]
}, { identifier: 'usersData' })
```

Passing identifier name as key with primitive result, including expiration time:
```javascript
import { handle } from "@arquetipo28/localstorage-handle"
const data = handle(() => {
    // This data will be stored using 'usersData' as key
    return 'Hello World :D'
}, { identifier: 'usersData', expire: { minutes: 30, hours: 0 } })
```

Implicit identifier name, including expiration time as string:
```javascript
import { handle } from "@arquetipo28/localstorage-handle"

const expire = new Date()
// Data expires in 10 seconds
expire.setSeconds(expire.getSeconds() + 10)
const data = handle(function expirationDateString () {
    // This data will be stored using 'usersData' as key
    return 'Hello World :D'
}, { expire })
```

### Examples (stored)

`stored` method provides a way to take or retrieve some of the saved data and then apply certain behaviors to it, like destroy the the stored state by key

Taking stored information once and remove it from localStorage.
```javascript
import { stored } from "@arquetipo28/localstorage-handle"

// here we assume that you have been handling some data with a 'state'
// implicit or explicit identifier
const data = stored({ identifier: 'state', cleanAfter: true })
// 'state' data was removed from localStorage but is was saved in `data` before
console.log(data) // Output: { state: { message: 'Hello again' } }
console.log(localStorage) // It should not contain the 'state' data
```

But you can also retrieve it in a safest way, without destroying it, just removing the cleanAfter key from the argument, or passing false instead. 
```javascript
import { stored } from "@arquetipo28/localstorage-handle"

// here we assume that you have been handling some data with a 'state'
// implicit or explicit identifier
const data = stored({ identifier: 'state', cleanAfter: false })
// 'state' data was removed from localStorage but is was saved in `data` before
console.log(data) // Output: { state: { message: 'Hello again' } }
console.log(localStorage) // It should not contain the 'state' data
```

### Todos

 - Write Tests
 - Add Examples
 - Test asynchronous integration
 - Test importation cases

License
----

MIT


**Open Software, Hell Yeah!**