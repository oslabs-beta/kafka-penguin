const failfastSource = require('./failfast.ts');
const deadLetterQueueSource = require('./deadLetterQueue.ts');
//import dlqsrc from './deadLetterQueue'
// module.exports = {
//   failfastsrc,
//   dlqsrc,
// }

module.exports = { failfastSource, deadLetterQueueSource }