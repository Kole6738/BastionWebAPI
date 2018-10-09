/**
 * @todo Add typings
 */

"use strict";

import * as request from "request-promise-native";

/**
 * Fetches a reply, from Cleverbot, for the specified message.
 * @module writeToBastion
 * @param {string} message The message for which reply is to be fetched
 * @returns {object} The response object
 */
export default (message: string): object => {
  return new Promise<object>(async (resolve, reject) => {
    try {
      let url = "https://cleverbot.io/1.0/ask/";
      let options: request.RequestPromiseOptions = {
        headers: {
          "User-Agent": "Bastion Chat"
        },
        form: {
          user: process.env.CLEVERBOT_API_USER,
          key: process.env.CLEVERBOT_API_KEY,
          nick: "bastion",
          text: message
        },
        json: true
      };

      let response = await request.post(url, options);

      resolve(response);
    }
    catch (e) {
      if (e.name === "StatusCodeError") {
        delete e.options;
        delete e.response;
      }

      reject(e);
    }
  });
}
