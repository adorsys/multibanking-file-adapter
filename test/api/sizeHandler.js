const { send } = require('micro')

module.exports = repository => async (req, res) => {
  const value = await repository.size()
  send(res, 200, value)
}
