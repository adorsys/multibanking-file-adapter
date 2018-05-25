const { send, json } = require('micro')

module.exports = repository => async (req, res) => {
  const { key, value } = await json(req)
  const success = await repository.set(key, value)
  send(res, 201)
}
