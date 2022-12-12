// src/routes/api/get.js
const { Fragment } = require('../../model/fragment');
const crypto = require('crypto');
const { serialize } = require('v8');
const MarkdownIt = require ('markdown-it');
const sharp = require ('sharp');

/**
 * Get a list of fragments for the current user
 */
  // TODO: this is just a placeholder to get something working...
  async function getByUser (req, res) {
    try {
      const value = await Fragment.byUser(crypto.createHash('sha256').update(req.user).digest('hex'));
      var fragmentIds = [];
      for(var i = 0; i < value.length; i++) {
        fragmentIds.push(value[i]);
      }
      res.status(200).json({
        'status': 'ok',
        'fragments': fragmentIds
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

  async function getByUserExpand (req, res) {
    try {
      const value = await Fragment.byUser(crypto.createHash('sha256').update(req.user).digest('hex'));
      var fragmentsMeta = [];
      for(var i = 0; i < value.length; i++) {
        const meta = await Fragment.byId(crypto.createHash('sha256').update(req.user).digest('hex'), value[i]);
        fragmentsMeta.push(meta);
      }
      res.status(200).json({
        'status': 'ok',
        'fragments': fragmentsMeta
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
      var mdi = new MarkdownIt();
      const splitId = (req.params.id).split('.')
      const value = await Fragment.byId(crypto.createHash('sha256').update(req.user).digest('hex'), splitId[0]);
      var data = await value.getData();
      if (splitId[1]) {
        switch (value.type) {
          case 'text/plain':
            switch(splitId[1]) {
              case 'txt':
                data = data.toString();
                value.type = 'text/plain';
                break;
              default:
                throw 'Invalid conversion for fragment of type ' + value.type;
            }
            break;
          case 'text/markdown':
            switch(splitId[1]) {
              case 'md':
                data = data.toString();
                value.type = 'text/markdown';
                break;
              case 'html':
                data = mdi.render(data.toString());
                value.type = 'text/html';
                break;
              case 'txt':
                data = data.toString();
                value.type = 'text/plain';
                break;
              default:
                throw 'Invalid conversion for fragment of type ' + value.type;
            }
            break;
          case 'text/html':
            switch(splitId[1]) {
              case 'html':
                data = data.toString();
                value.type = 'text/html';
                break;
              case 'txt':
                data = data.toString();
                value.type = 'text/plain';
                break;
              default:
                throw 'Invalid conversion for fragment of type ' + value.type;
            }
            break;
          case 'application/json':
            switch(splitId[1]) {
              case 'json':
                data = data.toJSON();
                value.type = 'application/json';
                break;
              case 'txt':
                data = data.toString();
                value.type = 'text/plain';
                break;
              default:
                throw 'Invalid conversion for fragment of type ' + value.type;
            }
            break;
          default:
            if (value.type.includes('image')) {
              switch(splitId[1]) {
                case 'png':
                  data = await sharp(data).toFormat('png').toBuffer();
                  value.type = 'image/png'
                  break;
                case 'jpg':
                  data = await sharp(data).toFormat('jpg').toBuffer();
                  value.type = 'image/jpeg'
                  break;
                case 'webp':
                  data = await sharp(data).toFormat('webp').toBuffer();
                  value.type = 'image/webp'
                  break;
                case 'gif':
                  data = await sharp(data).toFormat('gif').toBuffer();
                  value.type = 'image/gif'
                  break;
                default:
                  break;
              }
            }
            break;
        }
      }
      else {
        switch (value.type) {
          case 'text/plain':
              data = data.toString();
              break;
          case 'text/markdown':
              data = mdi.render(data.toString());
              break;        
          case 'text/html':
              data = data.toString();
              break;
          case 'application/json':
              data = JSON.parse(data.toString());
              break;
        }
      }
      
      /*res.status(200).json({
        'status': 'ok',
        'content-type': value.type,
        'content-length': value.size,
        'data': data
      });*/
      res.set('status', 'ok')
      res.set('content-type', value.type);
      res.send(data);
    }
    catch (err) {
      if (err.toString().includes('Invalid conversion for fragment of type')) {
        res.status(415).json({
          status: 'error',
          error: {
            'message': err,
            'code': 415,
          },
        });
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
  }

  async function getByIdInfo(req, res) {
    try {
      const value = await Fragment.byId(crypto.createHash('sha256').update(req.user).digest('hex'), req.params.id);
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

  module.exports = { getByUser, getByUserExpand, getById, getByIdInfo }
