import { readdir, readFile } from "node:fs/promises";
const path = require("node:path");
const TwitterAPI = require("./TwitterAPI");
const AirtableAPI = require("./AirtableAPI");

enum Actions {
  POST_A_TWEET = "Post a tweet.",
  FETCH_ACCESS_TOKENS = "Fetch access tokens.",
}

const inquirer = require("inquirer");

function evalMessage(str: string, names: string[]) {
  return str.replace(/\$\{names\}/i, names.join(", "));
}

async function main() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [Actions.POST_A_TWEET, Actions.FETCH_ACCESS_TOKENS],
    },
  ]);

  switch (action) {
    case Actions.POST_A_TWEET:
      try {
        const files = await readdir(path.join(__dirname, "../templates/"));
        const { template } = await inquirer.prompt([
          {
            type: "list",
            name: "template",
            message: "Which template do you want to use?",
            choices: [...files],
          },
        ]);

        const message = await readFile(path.join(__dirname, "../templates/", template), "utf8");

        AirtableAPI.getNames(async (names: string[]) => {
          const result = await TwitterAPI.postATweet(evalMessage(message, names));
          console.log(result);
        });
      } catch (err) {
        console.error(err);
      }
      break;
    case Actions.FETCH_ACCESS_TOKENS:
      try {
        const accessTokens = await TwitterAPI.fetchAccessTokens(inquirer);
        console.log(accessTokens);
      } catch (err) {
        console.error(err);
      }
      break;
    default:
  }
}

(async () => {
  await main();
})();
