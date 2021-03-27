
class FailFastConsumer {
  constructor () {
  }
  FFCSubscribe (topic: string) {
    return {topic: topic, fromBeginning: false}
  }
}

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
        .catch((e: { retryCount?: any; }) => {
            //console.log('IM A CATCH==========')
            console.log(`disconnect after ${this.retry + 1} times!`);
            disconnector();


        })
      }
      //return a function that has timer built in
      return async () => {
        await connector();
        errorMessageWrongTopic()
        // Swap out different message/error types here
      };
  }
  
  FFPClient () {
    return {retry: { retries: this.retry }};
  }
}


module.exports = {
  FailFastProducer,
  FailFastConsumer

};