# @arquetipo28/localstorage-handler

localstorage-handler is a javascript function wrapper which allows you to save any kind of data into localStorage passing a serie of arguments to make it more useful. It:
  - Is bases on JavaScript
  - Allow to save JSON and primitive values
  - Provides a way to configure localStorage data saving
  - Allow force data override
  - Allow set data expiration
  - Allow set data key by function name or specific string

### Installation and Usage

localStorage-handler requires [Node.js](https://nodejs.org/) v12 to run.

```sh
$ npm install @arquetipo28/localStorage-handler
```

Import it into your project or file
```javascript
// handle is the principal function that will allow you
// to save your data into localStorage
import { handle } from '@arquetipo28/localstorage-handler'
```
### Arguments
Here are described all the arguments you can pass to configure the store of your data
```ruby
[Function: handle] (@block, @options)
@block = callback
@options = { force: boolean, identifier: string, expire: @expire }
@expire -> { months: integer, hours: integer, minutes: integer } | dateString
```

It is important to define that as default each `@expire` argument will be equal to 0


### Examples

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

### Todos

 - Write Tests
 - Add Examples
 - Test asynchronous integration
 - Test importation cases

License
----

MIT


**Open Software, Hell Yeah!**