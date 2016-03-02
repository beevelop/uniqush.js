[![npm](https://img.shields.io/npm/v/uniqush.js.svg?style=flat-square)](https://www.npmjs.com/package/uniqush.js)[![Code Climate](https://img.shields.io/codeclimate/github/beevelop/uniqush.js.svg?style=flat-square)](https://codeclimate.com/github/beevelop/uniqush.js)[![Gemnasium](https://img.shields.io/gemnasium/beevelop/uniqush.js.svg?style=flat-square)]()[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)[![Beevelop](https://links.beevelop.com/honey-badge)](https://beevelop.com)

# Uniqush.js ([API-Docs](https://htmlpreview.github.io/?https://github.com/beevelop/uniqush.js/blob/master/docs/uniqush.js/0.0.1/Uniqush.html))

> Simple Node.js API abstraction for Uniqush

## Example
```js
'use strict'

const uniq = require('uniqush.js')('http://uniqush.beevelop.com')

uniq.version
  .then(console.log)

  // Add GCM via addpsp
  .then(() => {
    return uniq.addGCM('unicorn', 'MagicProjectId', '[**yourGCMapikey**]')
  })
  .then(console.log)

  // Subscribe user "dom.cobb" to GCM PSP
  .then(() => {
    return uniq.subscribeGCM('unicorn', 'dom.cobb', '[**yourDeviceRegId**]')
  })
  .then(console.log)

  // Push to "dom.cobb" via service "unicorn" (the GCM PSP)
  .then(() => {
    return uniq.push('unicorn', 'dom.cobb', {
      title: 'Oh yeah',
      message: 'Did you know that unicorns are awesome?'
    })
  })
  .then(console.log)

  // Unsubscribe "dom.cobb" from "unicorn" (the GCM PSP)
  .then(() => {
    return uniq.unsubscribeGCM('unicorn', 'dom.cobb', '[**yourDeviceRegId**]')
  })
  .then(console.log)

  // Remove "unicorn", the GCM PSP
  .then(() => {
    return uniq.rmGCM('unicorn', 'MagicProjectId', '[**yourGCMapikey**]')
  })
  .then(console.log)

  // Aaaannnnd time for a coffe break
  .then(() => {
    console.log('Done.')
  })
```
