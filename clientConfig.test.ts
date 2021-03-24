import { idText } from "typescript";
require('dotenv').config();


const clientConfig = require('./clientConfig.ts');
const request =  require('supertest');

// testing clientId
describe('client configuration', () => {
  it("client id isn't empty", () => {
    expect(clientConfig.clientId).not.toBeNull();
  } )
//   it("broker list is greater than 0", () => {
//     // const numBrokers = clientConfig.brokers.length;
//     // console.log(clientConfig.brokers);
//     expect(clientConfig.brokers.length).toHaveLength(1);
//   } )
});




