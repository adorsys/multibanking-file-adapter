const { send, json } = require('micro')

module.exports = repository => async (req, res) => {
  const { key } = await json(req)
  const value = await repository.get(key)
  if (value === null) {
    send(res, 204)
  } else {
    send(res, 200, JSON.stringify(value))
  }
}
