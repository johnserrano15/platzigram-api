'use strict'

import test from 'ava'
// Con micro se puede traspilar el código por eso usamos ES2015 y ES2016
// import micro, { send } from 'micro'
import micro from 'micro'
// import uuid from 'uuid-base62'
// Listen se complementa con micro
import listen from 'test-listen'
// Request es para hacer peticiones http es muy popular
import request from 'request-promise'
import users from '../users'
import fixtures from './fixtures'

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

// Test de prueba
/* test('GET /:id', async t => {
  let id = uuid.v4()

  let srv = micro(pictures)

  let url = await listen(srv)
  let body = await request({ uri: `${url}/${id}`, json: true })
  t.deepEqual(body, { id })
}) */

test.beforeEach(async t => {
  let srv = micro(users)
  // console.log('este es el servicio ', srv)
  t.context.url = await listen(srv)
  // http://localhost:52625 -> es la url
  // console.log('este es el servicio ', t.context.url)
})

test('POST /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      name: user.name,
      username: user.username,
      password: user.password,
      email: user.email
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)
  // Por cuestiones de seguridad a al hora de dar una respuesta esperamos que en la respuesta eliminamos el email y password para que el test pase
  delete user.email
  delete user.password

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, user)
})

test.todo('GET /:username')
