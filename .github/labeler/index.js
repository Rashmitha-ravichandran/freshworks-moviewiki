const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/rest");

const GITHUB_TOKEN = core.getInput('repo-token');
const octokit = github.getOctokit(GITHUB_TOKEN);


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
  const prNumber = github.context.payload.number;
  console.log(`prNumber: ${prNumber}`);
  octokit.paginate("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
    owner: owner,
    repo: repo,
    pull_number: prNumber
  })
  .then((reviews) => {
    const reviewsStringified = JSON.stringify(reviews, undefined, 2)
    console.log(`Issues: ${reviewsStringified}`);
    // issues is an array of all issue objects. It is not wrapped in a { data, headers, status, url } object
    // like results from `octokit.request()` or any of the endpoint methods such as `octokit.rest.issues.listForRepo()`
  });

  octokit.rest.issues.addLabels({
    owner: owner,
    repo: repo,
    issue_number: prNumber,
    labels: ["force-merged"]
  })
  // octokit.rest.issues('PUT /repos/{owner}/{repo}/issues/{issue_number}/labels', {
  //   owner: owner,
  //   repo: repo,
  //   issue_number: prNumber
  // })
  // .then((labels) => {
  //   const labelsStringified = JSON.stringify(labels, undefined, 2)
  //   console.log(`labelsoutput: ${labelsStringified}`);
  // });
} catch (error) {
  core.setFailed(error.message);
}