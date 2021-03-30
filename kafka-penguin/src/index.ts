const failfast = require('./src/failfast.ts');
const deadLetterQueueSource = require('./src/deadLetterQueue.ts');

// Export default strategies
module.exports = {
  failfast,
  deadLetterQueueSource,
}
