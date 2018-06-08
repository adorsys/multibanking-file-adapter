import Repository from '../../src/Repository'

const { send, json } = require('micro')

export default (repository: Repository) => async (req, res) => {
  const { key, value } = await json(req)
  const success = await repository.set(key, value)
  send(res, 201)
}
