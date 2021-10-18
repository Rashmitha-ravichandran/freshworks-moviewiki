const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/action");
// const axios = require('axios');
const octokit = new Octokit();

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
  const owner = github.context.payload.repository.owner.login;
  const repo = github.context.payload.repository.name;
  console.log(`The owner and repo in context: ${owner} ${repo} `);
  const { data } = await octokit.request("POST /repos/{owner}/{repo}/commits/check_the_checks/check-runs", {
    owner,
    repo,
  });
  console.log("data from octokit: %s", data);
  const strdata = JSON.stringify(data, undefined, 2)
  console.log(`The stringified  data: ${strdata}`);
} catch (error) {
  core.setFailed(error.message);
}