const { Fragment } = require('../../model/fragment');
const crypto = require('crypto');

async function deleteFragment (req, res) {
  const splitId = (req.params.id).split('.')
  try {
    Fragment.delete(crypto.createHash('sha256').update(req.user).digest('hex'), splitId[0]);
    res.status(200).json({
      'status': 'ok',
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

module.exports = { deleteFragment }
