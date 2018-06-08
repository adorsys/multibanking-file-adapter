import Repository from '../../src/Repository'
import readHandler from './readHandler'
import writeHandler from './writeHandler'
import removeHandler from './removeHandler'
import sizeHandler from './sizeHandler'

import { router, get, post } from 'microrouter'

export default (repository: Repository) =>
  router(
    post('/store/read', readHandler(repository)),
    post('/store/write', writeHandler(repository)),
    post('/store/remove', removeHandler(repository)),
    get('/store/size', sizeHandler(repository))
  )
