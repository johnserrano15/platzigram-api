'use strict'

import jwt from 'jsonwebtoken'
import bearer from 'token-extractor'

export default {
  async signToken (payload, secret, options) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err)

        resolve(token)
      })
    })
  },

  async verifyToken (token, secrect, options) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secrect, options, (err, decoded) => {
        if (err) return reject(err)

        resolve(decoded)
      })
    })
  },

  async extractToken (req) {
    return Promise((resolve, reject) => {
      bearer(req, (err,token) => {
        if (err) return reject(err)

        resolve(token)
      })
    })
  }
}