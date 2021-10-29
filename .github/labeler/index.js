const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({});
octokit.authenticate({
  type: 'token',
  username: 'Rashmitha-ravichandran',
  token: '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'
});

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const prdetails = core.getInput('pr-details');
  console.log(`the pr details from main.yml ${prdetails}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  console.log(`*****************************`);
  const owner = github.context.payload.repository.owner.login;
  console.log(`owner: ${owner}`);
  const repo = github.context.payload.repository.name;
  console.log(`repo: ${repo}`);
  octokit.paginate("GET /repos/{owner}/{repo}/issues", {
    owner: "octokit",
    repo: "rest.js",
  })
  .then((issues) => {
    console.log(`The event payload: ${issues}`);
    // issues is an array of all issue objects. It is not wrapped in a { data, headers, status, url } object
    // like results from `octokit.request()` or any of the endpoint methods such as `octokit.rest.issues.listForRepo()`
  });
} catch (error) {
  core.setFailed(error.message);
}