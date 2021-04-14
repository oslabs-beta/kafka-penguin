# Home

## Kafka-Penguin

### About

Kafka-Penguin is an easy-to-use, lightweight KafkaJS library for message processing. It provides developers with a single strategy for handling message processing failures by failing fast.

For more information on KafkaJS, check out [Getting Started](https://kafka.js.org/docs/getting-started).

Accelerated by [OS Labs](https://github.com/oslabs-beta/) and developed by [Ziyad El Baz](https://github.com/zelbaz946), [Kushal Talele](https://github.com/ktrane1), [Timeo Williams](https://github.com/timeowilliams) and [Ausar English](https://github.com/ausarenglish).

**WIP: This project is not ready for use as of yet**

### Getting Started

Install kafka-penguin as an npm module and save it to your package.json file as a development dependency:

```bash
npm install kafka-penguin
```

Once installed it can now be referenced by simply calling `require('kafka-penguin');`

### Example

Kafka-penguin works with any Kafka client, here is an example with the client exported from another file:

```javascript
//Import your kafkajs client from another file
const kafkaPenguin = require('kafka-penguin');
const devClient = require('./clientConfig.js')

const strategies = kafkaPenguin.failfast
// Initialize strategy-- passing in the # of retries and your kafkjs client
const newStrategy = new strategies.FailFast(2, devClient) 

//Create a wrong topic message 
const message = {
  topic: 'wrong-topic',
    messages: [
      {key: "hello",
       value: "world",
      }
    ]
}

// Initialize producer from the failfast strategy
const producer = newStrategy.producer();

producer.connect()
  .then(() => console.log('Connected!'))
  .then(() => producer.send(message))
  .catch((e: any) => console.log("error: ", e.message))
```

## Strategies/Documentation

[FailFast ](https://github.com/timeowilliams/kafka-penguin/tree/b0ca78adbe9f7b4dbb2c4ccd905139ff491f8efa/strategies/readme/strategies-readme-fail-fast.md)

[Ignore](strategies/readme/strategies-readme-ignore.md)

[Dead Letter Queue](https://github.com/timeowilliams/kafka-penguin/tree/b0ca78adbe9f7b4dbb2c4ccd905139ff491f8efa/strategies/readme/strategies-readme-dlq.md)

{% page-ref page="./" %}

{% page-ref page="./" %}

## **Contributors**

[Ausar English](https://www.linkedin.com/in/ausarenglish) [@ausarenglish](https://github.com/ausarenglish)

[Kushal Talele](https://www.linkedin.com/in/kushal-talele-29040820b/) [@ktrane1](https://github.com/ktrane1)

[Timeo Williams](https://www.linkedin.com/in/timeowilliams/) [@timeowilliams](https://github.com/timeowilliams)

[Ziyad El Baz](https://www.linkedin.com/in/ziyadelbaz) [@zelbaz946](https://github.com/zelbaz946)

