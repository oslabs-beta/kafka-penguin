# Ignore

This strategy enables you to continuously process messages even after other messages are erroneously processed. It is meant to keep flows from producers or consumers unblocked even if there are failures.  Potential use cases for this strategy include services and systems that rely upon a constant stream of data.

## Syntax:

**Ignore\(kafka-client, topic, callback\)**

`kafka-client` A configured  [KafkaJS client](https://kafka.js.org/docs/configuration) provided by the developer.

`topic` The target topic that producers or consumers will publish or subscribe to in this strategy instance. Kafka-Penguin currently supports one topic per strategy instance. 

`callback` A callback that must return a boolean value. The callback will take in one argument: the messages received by the consumer. During execution, the strategy will pass to the callback each message consumed; Even if a message which returns `false`  , the producer or consumer will continue to produce or consume messages uninterrupted.  

#### **Producer**

`Ignore.producer` Returns a producer initialized from the strategy instance. The producer has "adapted" methods which execute the strategy under the hood. 

`producer.connect`  Connects the producer to the Kafka cluster indicated in the configured KafkaJS client. 

`producer.send(message)` This method takes in one argument, `messages` that are passed in with the same requirements as the counterpart method on KafkaJS, and sends it to the Kafka cluster. 

#### Consumer

`Ignore.consumer` Returns a consumer initialized from the strategy instance. The consumer has "adapted" methods which execute the strategy under the hood. 

`consumer.connect`  Connects the consumer to the Kafka cluster indicated in the configured KafkaJS client. 

`consumer.run` Starts consuming messages from the Kafka cluster to the consumer client. The `run` method also utilizes `eachMessage`to pass each message received through the callback provided at strategy instantiation. 

