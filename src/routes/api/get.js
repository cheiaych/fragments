// src/routes/api/get.js
const { Fragment } = require('../../model/fragment');
const crypto = require('crypto');

/**
 * Get a list of fragments for the current user
 */
  // TODO: this is just a placeholder to get something working...
  async function getByUser (req, res) {
    try {
      const value = await Fragment.byUser(crypto.createHash('sha256').update(req.user).digest('hex'));
      res.status(200).json({
        'status': 'ok',
        'fragments': value
      });
    }
    catch (err) {
      res.status(404).json({
        status: 'error',
        error: {
          'message': err,
          'code': 404
        },
      });
    }
  }

  async function getById (req, res) {
    try {
      const value = await Fragment.byId(crypto.createHash('sha256').update(req.user).digest('hex'), req.params.id)
      res.status(200).json({
        'status': 'ok',
        'fragment': value
      });
    }
    catch (err) {
      res.status(404).json({
        status: 'error',
        error: {
          'message': 'not found',
          'code': 404,
        },
      });
    }
  }

  module.exports = { getByUser, getById }
