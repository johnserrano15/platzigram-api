'use strict'

import test from 'ava'
// Con micro se puede traspilar el código por eso usamos ES2015 y ES2016
// import micro, { send } from 'micro'
import micro from 'micro'
import uuid from 'uuid-base62'
// Listen se complementa con micro
import listen from 'test-listen'
// Request es para hacer peticiones http es muy popular
import request from 'request-promise'
import pictures from '../pictures'

// test básico para aprender a usar micro.
/* test('GET /:id', async t => {
  let id = uuid.v4()

  let srv = micro(async (req, res) => {
    // Es lo mismo que { id: id }
    send(res, 200, { id })
  })

  let url = await listen(srv)
  let body = await request({ uri: url, json: true })
  t.deepEqual(body, { id })
}) */

test('GET /:id', async t => {
  let id = uuid.v4()

  let srv = micro(pictures)

  let url = await listen(srv)
  let body = await request({ uri: `${url}/${id}`, json: true })
  t.deepEqual(body, { id })
})

test.todo('POST /')
test.todo('POST /:id/like')
