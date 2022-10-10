//Post route handling
require('dotenv').config()
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  //const hashedEmail = crypto.createHash('sha256').update(req.user).digest('hex');
  try {
    const data = req.body;
    const type = req.headers['content-type']
    const fragment = new Fragment({ownerId: req.user, type: type});
    await fragment.save();
    await fragment.setData(data);
    res.set('Location', process.env.API_URL + '/fragments/:' + fragment.id)
    res.status(201).json({
      'status': 'ok',
      'fragment': {
          'id': fragment.id,
          'ownerId': fragment.ownerId,
          'created': fragment.created,
          'updated': fragment.updated,
          'type': fragment.type,
          'size': fragment.size
      }
    });
  }
  catch (err) {
    res.status(500).json({
      'status': 'Error',
      'message': err
    });
  }
};
