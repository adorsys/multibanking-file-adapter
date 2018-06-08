import Repository from '../../src/Repository'

const { send, json } = require('micro')

export default (repository: Repository) => async (req, res) => {
  const { key } = await json(req)
  const value = await repository.get(key)
  if (value === null) {
    send(res, 204)
  } else {
    send(res, 200, JSON.stringify(value))
  }
}
