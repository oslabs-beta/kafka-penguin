
interface messageValue {
  topic: string,
  messages: object[],
}

// create FailFast Class
class FailFast {
  // Create  method that returns object with all producer methods
   //  Mock user flow:
    // const failfast = new FailFast(0, client obj)
  retry: number;
  client: any; 
  innerProducer: any;
  constructor(num: number, kafkaJSClient: any) {
    this.retry = num;
    this.client = kafkaJSClient;
    this.innerProducer = null;
  }
    // const producer = failfast.producer()
  producer() {
    const options = {
      retry:
        { retries: this.retry }
    }
    this.innerProducer = this.client.producer(options);

    return this;
  }
      // -> clientobj.producer(retry# )
      // await producer.connect()
  connect() { 
    return this.innerProducer.connect()
  }
      //  await producer.send({ message object })
  
  send(message: messageValue) {
    return this.innerProducer.send(message)
    .then((res: any) => { console.log('This is our res ', res) })
    .catch((e: { retryCount?: any }) => {
      console.log(`disconnect after ${this.retry + 1} times!`);
      this.innerProducer.disconnect();
    })
  } 

}



// class FailFastProducer {
//   retry: number;
//   constructor (recountNum: number) {
//     this.retry = recountNum - 1;
//   }

//   connect (connector: () => any, 
//   disconnector: () => void, 
//   sender: (arg0: any) => Promise<any>, 
//   message: any) {
//       const errorMessageWrongTopic = () => {
//         return sender(message)
//         .then((res: any) => console.log('This is our res ', res))
//             //{ retry: { retries: 0 }} from producer client
//         .catch((e: { retryCount?: any; }) => {
//             console.log('IM A CATCH==========')
//           // kill       process once it hits recount target
//           //  if (e.retryCount >= 0 ) {
//             console.log(`disconnect after ${this.retry + 1} times!`);
//             disconnector();
//             //  SetIntervalSource.clear('sayMyName');
//             // }
//         })
//       }
//       //return a function that has timer built in
//       return async () => {
//         await connector();
//         // SetIntervalSource.start(errorMessageWrongTopic, 7000, 'sayMyName')
//         errorMessageWrongTopic()
//         // Swap out different message/error types here
//       };
//   }
  
//   FFPClient () {
//     return {retry: { retries: this.retry }};
//   }
// }


module.exports = {
  FailFast,
};