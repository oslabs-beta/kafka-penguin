const failfast = require('./failfast.ts');
const deadLetterQueueSource = require('./deadLetterQueue.ts');

// Export default strategies
module.exports = {
  failfast,
  deadLetterQueueSource,
}
