'use strict'

import HttpHash from 'http-hash'
import { send, json } from 'micro'
// eslint-disable-line no-unused-vars
import Db from 'Platzigramdb'
import config from './config'
import DbStub from './test/stub/db'

const env = process.env.NODE_ENV || 'production'
let db = new Db(config.db)
// Colocando esta linea al frente desactivamos errores de uso eslint-disable-line no-unused-vars
// en este caso no se uso proxyrequire porque el modelado de la app no dio para hacerlo ya que estamos trabajando con common.js
if (env === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

// si es el home, pero de este microservicio, y los microservicios son servidores independientes con su puerto especifico, el "/users" se usaria como namespace cuando se trabaja con una api completa.
hash.set('POST /', async function saveUser (req, res, params) {
  let user = await json(req)
  await db.connect()
  let created = await db.saveUser(user)
  await db.disconnect()

  delete created.email
  delete created.password

  send(res, 201, created)
})

hash.set('GET /:username', async function saveUser (req, res, params) {
  let username = params.username
  await db.connect()
  let user = await db.getUser(username)
  await db.disconnect()

  delete user.email
  delete user.password

  send(res, 200, user)
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
