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

const failfastProducerConnect = (
  connector: () => any, 
  disconnector: () => void, 
  sender: (arg0: any) => Promise<any>, 
  message: any,
  recountNum: number) => {

  const errorMessageWrongTopic = () => {
    return sender(message)
    .then((res: any) => console.log('This is our res ', res))
        //{ retry: { retries: 0 }} from producer client
    .catch((e: { retryCount?: any; }) => {
        console.log('IM A CATCH==========')
       // kill       process once it hits recount target
      //  if (e.retryCount >= 0 ) {
         console.log(`disconnect after ${0} times!`);
         disconnector();
         SetIntervalSource.clear('sayMyName');
        // }
    })
  }
  //return a function that has timer built in
  return async () => {
    await connector();
    SetIntervalSource.start(errorMessageWrongTopic, 7000, 'sayMyName') // Swap out different message/error types here
  };
}

const failfastProducerClient = (num: number) => {retry: { retries: 2 }};


// const FailFastStrategy = 2;

module.exports = {
  failfastProducerConnect,
  failfastProducerClient
};