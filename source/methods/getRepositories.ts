/**
 * @todo Add typings
 */

import * as request from "request-promise-native";

import redisClient from "../redisClient";

export default (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let redisKey: string = "github:TheBastionBot:repositories";

    redisClient.get(redisKey, async (error, user): Promise<void> => {
      try {
        if (error) reject(error);

        if (user) {
          resolve(JSON.parse(user));
        }
        else {
          let url: string = "https://api.github.com/orgs/TheBastionBot/repos";
          let options: request.RequestPromiseOptions = {
            headers: {
              "User-Agent": "The Bastion Bot API",
              Authorization: "token " + process.env.GITHUB_ACCESS_TOKEN,
            },
            json: true,
          };

          let response = await request(url, options);

          redisClient.setex(redisKey, 86400, JSON.stringify(response));

          resolve(response);
        }
      }
      catch (e) {
        if (e.name === "StatusCodeError") {
          delete e.options;
          delete e.response;
        }

        reject(e);
      }
    });
  });
};
