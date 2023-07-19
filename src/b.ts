const a = require('./tulind.js');
const p = require('./tulind.wasm');

export
function hello() {
  console.log(a);
  console.log('你好，世界');
}
