import test from 'ava'
import axios from 'axios'
import micro, { RequestHandler, send } from 'micro'

const listen = require('test-listen')

/** @type RequestHandler */
const testHandler = async (req, res) => {
  send(res, 200, {
    test: 'woot'
  })
}

test('micro', async t => {
  const service = micro(testHandler)

  const url = await listen(service)
  const body = await axios.get(url)

  t.is(body.data.test, 'woot', 'returning bad value')
  service.close()
})
