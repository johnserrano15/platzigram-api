'use strict'

import HttpHash from 'http-hash'
import { send, json } from 'micro'
import Db from 'Platzigramdb'
import config from './config'
import utils from './lib/utils'
import DbStub from './test/stub/db'

const env = process.env.NODE_ENV || 'production'
let db = new Db(config.db)
// en este caso no se uso proxyrequire porque el modelado de la app no dio para hacerlo ya que estamos trabajando con common.js
if (env === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

// esto de async no se puede usar con express funcionalidad asyncronada.
/* hash.set('GET /:id', async function getPicture (req, res, params) {
  send(res, 200, params)
}) */

// Nota: Tener en cuenta el orden en como se definen las rutas puede haber problemas con el /:id por eso es mejor definir primero /list lo mismo puede pasar con express.

hash.set('GET /tag/:tag', async function byTag (req, res, params) {
  let tag = params.tag
  await db.connect()
  let images = await db.getImagesByTag(tag)
  await db.disconnect()
  send(res, 200, images)
})

hash.set('GET /list', async function list (req, res, params) {
  await db.connect
  // Siempre agregar await para resolver promesas
  let images = await db.getImages()
  await db.disconnect()
  send(res, 200, images)
})

hash.set('GET /:id', async function getPicture (req, res, params) {
  let id = params.id
  await db.connect()
  let image = await db.getImage(id)
  await db.disconnect()
  send(res, 200, image)
})

hash.set('POST /', async function postPicture (req, res, params) {
  let image = await json(req)

  try {
    let token = await utils.extractToken(req)
    let encoded = await utils.verifyToken(token, config.secret)
    if (encoded && encoded.userId !== image.userId) {
      throw new Error('Invalid token')
    }
  } catch (e) {
    return send(res, 401, { error: 'invalid token' })
  }

  await db.connect()
  let created = await db.saveImage(image)
  await db.disconnect()
  // El status Code debe ser 201 porque asi lo definimos en el test
  send(res, 201, created)
})

hash.set('POST /:id/like', async function likePicture (req, res, params) {
  let id = params.id
  await db.connect()
  let image = await db.likeImage(id)
  await db.disconnect()
  send(res, 200, image)
})

export default async function main (req, res) {
  let { method, url } = req // una funcionalidad de ES2015
  let match = hash.get(`${method.toUpperCase()} ${url}`)

  if (match.handler) {
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, { error: 'route not found ' })
  }
}
