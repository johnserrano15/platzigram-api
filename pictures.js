'use strict'

import HttpHash from 'http-hash'
import { send } from 'micro'
import Db from 'Platzigramdb'
import config from './config'
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

hash.set('GET /:id', async function getPicture (req, res, params) {
  let id = params.id
  await db.connect()
  let image = await db.getImage(id)
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
