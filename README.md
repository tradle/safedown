
# safedown

Wrapper for [leveldown](https://github.com/Level/leveldown) implementations to ensure `close()` doesn't cause segfaults due to pending operations. See ['./segfault.js'](https://github.com/tradle/safedown/blob/master/segfault.js) for an example of what this fixes.

## Usage

```js
var leveldown = require('safedown')(require('leveldown'))
// use leveldown as usual
```
