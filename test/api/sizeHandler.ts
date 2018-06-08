import Repository from '../../src/Repository'

const { send } = require('micro')

export default (repository: Repository) => async (req, res) => {
  const value = await repository.size()
  send(res, 200, value)
}
