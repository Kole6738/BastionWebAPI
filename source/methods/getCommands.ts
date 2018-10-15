/**
 * @todo Add typings
 */

import * as request from "request-promise-native";

import redisClient from "../redisClient";

export default (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let redisKey: string = "bastion:commands";

    redisClient.get(redisKey, async (error, user): Promise<void> => {
      try {
        if (error) reject(error);

        if (user) {
          resolve(JSON.parse(user));
        }
        else {
          let url: string = "https://raw.github.com/TheBastionBot/Bastion/master/data/commands.json";
          let options: request.RequestPromiseOptions = {
            headers: {
              "User-Agent": "The Bastion Bot API",
            },
            json: true,
          };

          let response = await request(url, options);

          // TODO: Show commands which are only in `master` as NEW!
          for (let command in response) {
            if (response.hasOwnProperty(command)) {
              response[command].branch = "master";
            }
          }

          redisClient.setex(redisKey, 3600, JSON.stringify(response));

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
