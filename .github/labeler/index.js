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
  //console.log(`The event payload: ${payload}`);
  console.log(`*****************************`);
  const owner = github.context.payload.repository.owner.login;
  console.log(`owner: ${owner}`);
  const repo = github.context.payload.repository.name;
  console.log(`repo: ${repo}`);
  const prNumber = github.context.payload.number;
  console.log(`prNumber: ${prNumber}`);
  const commitHash = github.context.payload.pull_request.head.sha;
  console.log(`commitHash: ${commitHash}`);
  octokit.paginate("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
    owner: owner,
    repo: repo,
    pull_number: prNumber
  })
  .then((reviews) => {
    const reviewsStringified = JSON.stringify(reviews, undefined, 2)
    console.log(`..reviews..: ${reviewsStringified}`);
    let arr=[];
   for(let i=0;i<reviews.length;i++){
    console.log(`...review states each..: ${reviews[i].state}`);
    arr.push(reviews[i].state);
    }
   console.log(arr);
   octokit.request("GET /repos/{owner}/{repo}/commits/{commitSha}/status", {
    owner: owner,
    repo: repo,
    commitSha: commitHash
  })
  .then((status) => {
    const statusStringified = JSON.stringify(status, undefined, 2)
    console.log(`..status Json..: ${statusStringified}`);
    })
  });



  // octokit.rest.issues.addLabels({
  //   owner: owner,
  //   repo: repo,
  //   issue_number: prNumber,
  //   labels: ["force-merged"]
  // }).then((response) => {
  //   const responseStringified = JSON.stringify(response, undefined, 2)
  //   console.log(`Issues: ${responseStringified}`);
  // });


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