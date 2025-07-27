// import { streamResponse } from './llm_config/index.js';

// Mock response object for testing
const mockRes = {
  writeHead: (status, headers) => {
    console.log('Headers set:', headers);
  },
  write: (data) => {
    console.log('Streaming data:', data);
  },
  end: () => {
    console.log('Stream ended');
  }
};

async function testStreaming() {
  console.log('Testing streaming functionality...');
  // await streamResponse("Write a simple hello world program in JavaScript", mockRes);
}

testStreaming().catch(console.error); 