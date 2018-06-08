import Repository from '../../src/Repository'

const { send, json } = require('micro')

export default (repository: Repository) => async (req, res) => {
  const { key } = await json(req)
  const success = await repository.remove(key)
  send(res, 200, `${success}`)
}
