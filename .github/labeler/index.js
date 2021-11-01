const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/rest");

const GITHUB_TOKEN = core.getInput('github-token');
const octokit = github.getOctokit(GITHUB_TOKEN);

try {
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  const pr = github.context.payload.pull_request;
  const prs = JSON.stringify(pr, undefined, 2)
  console.log(`pr: ${prs}`);
  console.log(`*****************************`);
  const owner = github.context.payload.repository.owner.login;
  console.log(`owner: ${owner}`);
  const repo = github.context.payload.repository.name;
  console.log(`repo: ${repo}`);
  const prNumber = github.context.payload.number;
  console.log(`prNumber: ${prNumber}`);
  const commitHash = github.context.payload.pull_request.head.sha;
  console.log(`commitHash: ${commitHash}`);
  const baseBranch = github.context.payload.pull_request.base.ref;
  console.log(`baseBranch: ${baseBranch}`);

  if (baseBranch == "master") {
    console.log(`..inside first if..`);
    const promise1 = octokit.paginate("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
      owner: owner,
      repo: repo,
      pull_number: prNumber
    })
    const promise2 = octokit.request("GET /repos/{owner}/{repo}/commits/{commitSha}/status", {
      owner: owner,
      repo: repo,
      commitSha: commitHash
    })

    Promise.all([promise1, promise2]).then((values) => {
      console.log(values);
      let reviews = values[0];
      let approvalCount = 0;
      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].state === 'APPROVED') {
          approvalCount++
        }
      }
      console.log(approvalCount);
      let status = values[1];
      let state = status.data.state;
      console.log(`..state oFa PR..: ${state}`);
      if (state != "success" || approvalCount < 1) {
        console.log(`..inside if..`);
        octokit.rest.issues.addLabels({
          owner: owner,
          repo: repo,
          issue_number: prNumber,
          labels: ["force-merged"]
        }).then((response) => {
          const responseStringified = JSON.stringify(response, undefined, 2)
          console.log(`Issues: ${responseStringified}`);
        });
      }
    });
  }
  // octokit.paginate("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
  //   owner: owner,
  //   repo: repo,
  //   pull_number: prNumber
  // })
  //   .then((reviews) => {
  //     const reviewsStringified = JSON.stringify(reviews, undefined, 2)
  //     console.log(`..reviews..: ${reviewsStringified}`);
  //     let arr = [];
  //     let approvalCount = 0;
  //     for (let i = 0; i < reviews.length; i++) {
  //       console.log(`...review states each..: ${reviews[i].state}`);
  //       arr.push(reviews[i].state);
  //       if (reviews[i].state === 'APPROVED') {
  //         approvalCount++
  //       }
  //     }
  //     console.log(arr);
  //     console.log(approvalCount);
  //     octokit.request("GET /repos/{owner}/{repo}/commits/{commitSha}/status", {
  //       owner: owner,
  //       repo: repo,
  //       commitSha: commitHash
  //     })
  //       .then((status) => {
  //         const statusStringified = JSON.stringify(status, undefined, 2)
  //         console.log(`..status Json..: ${statusStringified}`);
  //         let state = status.data.state;
  //         console.log(`..state oFa PR..: ${state}`);
  //         if (approvalCount < 1 && state != "success") {
  //           octokit.rest.issues.addLabels({
  //             owner: owner,
  //             repo: repo,
  //             issue_number: prNumber,
  //             labels: ["force-merged"]
  //           }).then((response) => {
  //             const responseStringified = JSON.stringify(response, undefined, 2)
  //             console.log(`Issues: ${responseStringified}`);
  //           });
  //         }
  //       })
  //   });



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