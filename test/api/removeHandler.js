const { send, json } = require('micro')

module.exports = repository => async (req, res) => {
  const { key } = await json(req)
  const success = await repository.remove(key)
  send(res, 200, `${success}`)
}
