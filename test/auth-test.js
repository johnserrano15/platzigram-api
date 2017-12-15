'use strict'

import test from 'ava'
// Con micro se puede traspilar el código por eso usamos ES2015 y ES2016
import micro from 'micro'
// Listen se complementa con micro
import listen from 'test-listen'
// Request es para hacer peticiones http es muy popular
import request from 'request-promise'
import fixtures from './fixtures'
import utils from '../lib/utils'
import auth from '../auth'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(auth)
  // console.log('este es el servicio ', srv)
  t.context.url = await listen(srv)
  // http://localhost:52625 -> es la url
  // console.log('este es el servicio ', t.context.url)
})

test('success POST /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    body: {
      username: user.username,
      password: user.password
    },
    json: true
  }

  let token = await request(options)
  let decoded = await utils.verifyToken(token, config.secret)

  t.is(decoded.username, user.username)
})
