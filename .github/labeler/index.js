const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

axios.get('https://api.github.com/repos/Rashmitha-ravichandran/freshworks-moviewiki/branches/custom-_action_hello_world')
    .then(response => {
        console.log(response);
        // console.log(response.data);
        //res.send(response.data.status);
    })
    .catch(error => {
        console.log(error);
    });
// try {
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const context = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event context: ${context}`);
//   const pr = JSON.stringify(github.context.head_ref, undefined, 2)
//   console.log(`The event pr: ${pr}`);
// } catch (error) {
//   core.setFailed(error.message);
// }