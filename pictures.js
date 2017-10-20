'use strict'

import HttpHash from 'http-hash'
import { send } from 'micro'

const hash = HttpHash()

// esto de async no se puede usar con express funcionalidad asyncronada.
hash.set('GET /:id', async function getPicture (req, res, params) {
  send(res, 200, params)
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
