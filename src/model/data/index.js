//module.exports = require('./memory');
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');
