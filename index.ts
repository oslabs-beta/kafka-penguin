const failfast = require('./src/failfast.ts');
const deadLetterQueueSource = require('./src/deadLetterQueue.ts');
// import strategies from './src/index'
// module.exports = {
//     strategies,
// };

// export default strategies
module.exports = {
    failfast,
    deadLetterQueueSource,
}
