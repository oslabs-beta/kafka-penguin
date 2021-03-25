const SetIntervalSource =  require('set-interval');
// const client = require('./clientConfig.ts')
// class FailFastStrategy {
//   constructor () {
      
//     }

//   consumer () {
    
//     }

//   producer () {

//   }
// }
class FailFastProducer {
  retry: number;
  constructor (recountNum: number) {
    this.retry = recountNum - 1;
  }

  FFPConnect (connector: () => any, 
  disconnector: () => void, 
  sender: (arg0: any) => Promise<any>, 
  message: any) {
      const errorMessageWrongTopic = () => {
        return sender(message)
        .then((res: any) => console.log('This is our res ', res))
            //{ retry: { retries: 0 }} from producer client
        .catch((e: { retryCount?: any; }) => {
            console.log('IM A CATCH==========')
          // kill       process once it hits recount target
          //  if (e.retryCount >= 0 ) {
            console.log(`disconnect after ${this.retry + 1} times!`);
            disconnector();
            //  SetIntervalSource.clear('sayMyName');
            // }
        })
      }
      //return a function that has timer built in
      return async () => {
        await connector();
        // SetIntervalSource.start(errorMessageWrongTopic, 7000, 'sayMyName')
        errorMessageWrongTopic()
        // Swap out different message/error types here
      };
  }
  
  FFPClient () {
    return {retry: { retries: this.retry }};
  }
}


module.exports = {
  FailFastProducer
};