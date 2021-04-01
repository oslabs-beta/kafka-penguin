"use strict";
const failfast = require('./failfast.js');
const deadLetterQueueSource = require('./deadLetterQueue.js');
// Export default strategies
module.exports = {
    failfast,
    deadLetterQueueSource,
};
