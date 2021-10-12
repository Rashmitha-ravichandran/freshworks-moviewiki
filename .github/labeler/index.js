const core = require('@actions/core');
const github = require('@actions/github');
// const axios = require('axios');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const prdetails = core.getInput('pr-details');
  console.log(`the pr details from main.yml ${prdetails}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const context = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event context: ${context}`);
  //const pr = JSON.stringify(github.context.head_ref, undefined, 2)
} catch (error) {
  core.setFailed(error.message);
}