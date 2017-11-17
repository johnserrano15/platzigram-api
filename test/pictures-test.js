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
import pictures from '../pictures'
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
  let srv = micro(pictures)
  // console.log('este es el servicio ', srv)
  t.context.url = await listen(srv)
  // http://localhost:52625 -> es la url
  // console.log('este es el servicio ', t.context.url)
})

test('GET /:id', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  // console.log(`Esta es la url -> ${url}`)

  let body = await request({ uri: `${url}/${image.publicId}`, json: true })
  t.deepEqual(body, image)
})

test('POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    resolveWithFullResponse: true
  }

  // COn el resolveWithFullResponse habilitamos para que devuelva todo el object de la respuesta y no solo el body

  let response = await request(options)
  t.is(response.statusCode, 201)
  t.deepEqual(response.body, image)
})

test('POST /:id/like', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: `${url}/${image.id}/like`,
    json: true
  }

  let body = await request(options)
  // console.log('`esta es la image `', image)
  // let imageNew = JSON.parse(JSON.stringify(image))
  // console.log('`esta es la imagenNew `', imageNew)
  image.liked = true
  image.likes = 1

  t.deepEqual(body, image)
})

test('GET /list', async t => {
  let images = fixtures.getImages()
  let url = t.context.url

  let options = {
    method: 'GET',
    uri: `${url}/list`,
    json: true
  }

  let body = await request(options)

  t.deepEqual(body, images)
})

test('GET /tag/:tag', async t => {
  let images = fixtures.getImagesByTag()
  let url = t.context.url

  let options = {
    method: 'GET',
    uri: `${url}/tag/awesome`,
    json: true
  }

  let body = await request(options)

  t.deepEqual(body, images)
})
