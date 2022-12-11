//Put route handling
require('dotenv').config()
const { Fragment } = require('../../model/fragment');
const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    const splitId = (req.params.id).split('.')
    const value = await Fragment.byId(crypto.createHash('sha256').update(req.user).digest('hex'), splitId[0]);

    if (value.type == req.headers['content-type']) {
      const data = req.body;
      value.setData(data)

      res.status(200).json({
        'status': 'ok',
        'fragment': {
            'id': value.id,
            'ownerId': value.ownerId,
            'created': value.created,
            'updated': value.updated,
            'type': value.type,
            'size': value.size
        }
      });
    }
    else {
      throw `Content-Type of ${req.headers['content-type']} does not match fragment ${req.params.id}'s Content-Type of ${value.type}`
    }
  }
  catch (err) {
    if (err.toString().includes('Content-Type of')) {
      res.status(400).json({
        status: 'error',
        error: {
          'message': err,
          'code': 400
        }
      })
    }
    else {
      res.status(404).json({
        status: 'error',
        error: {
          'message': 'not found',
          'code': 404,
        },
      });
    }
  }
};
