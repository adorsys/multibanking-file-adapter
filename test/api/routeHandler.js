const readHandler = require('./readHandler')
const writeHandler = require('./writeHandler')
const removeHandler = require('./removeHandler')
const sizeHandler = require('./sizeHandler')
const { router, get, post } = require('microrouter')

module.exports = repository => router(
  post('/store/read', readHandler(repository)),
  post('/store/write', writeHandler(repository)),
  post('/store/remove', removeHandler(repository)),
  get('/store/size', sizeHandler(repository))
)
