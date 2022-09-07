require("dotenv").config();

import * as crypto from "crypto";

const got = require("got");
const OAuth = require("oauth-1.0a");

interface OAuthTokenInterface {
  oauth_token?: string;
  oauth_token_secret?: string;
}

interface OAuthReqTokenInterface extends OAuthTokenInterface, URLSearchParams {}

function parse(body: string): OAuthReqTokenInterface {
  return new Proxy(new URLSearchParams(body), {
    get: (searchParams, prop: string) => searchParams.get(prop),
  });
}

const TwitterAPI = {
  oauth: OAuth({
    consumer: {
      key: process.env.TWITTER_API_KEY,
      secret: process.env.TWITTER_API_KEY_SECRET,
    },
    signature_method: "HMAC-SHA1",
    hash_function: (baseString: string, key: string) =>
      crypto.createHmac("sha1", key).update(baseString).digest("base64"),
  }),
  async getOAuthRequestToken() {
    const requestTokenURL =
      "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write";

    const authHeader = this.oauth.toHeader(
      this.oauth.authorize({
        url: requestTokenURL,
        method: "POST",
      })
    );

    try {
      const req = await got.post(requestTokenURL, {
        headers: {
          Authorization: authHeader["Authorization"],
        },
      });

      if (req.body) {
        return parse(req.body);
      } else {
        throw new Error("Cannot get an OAuth request token");
      }
    } catch (err) {
      console.error(err);
    }
  },
  async getOAuthAccessToken({ oauth_token }: OAuthTokenInterface, verifier: string) {
    const authHeader = this.oauth.toHeader(
      this.oauth.authorize({
        url: "https://api.twitter.com/oauth/access_token",
        method: "POST",
      })
    );

    try {
      const req = await got.post(
        `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`,
        {
          headers: {
            Authorization: authHeader["Authorization"],
          },
        }
      );

      if (req.body) {
        return parse(req.body);
      } else {
        throw new Error("Cannot get an OAuth access token");
      }
    } catch (err) {
      console.error(err);
    }
  },
  async fetchAccessTokens(inquirer: any) {
    const authorizeURL = new URL("https://api.twitter.com/oauth/authorize");
    let oAuthRequestToken;
    let oAuthAccessToken;

    try {
      oAuthRequestToken = await this.getOAuthRequestToken();

      if (oAuthRequestToken) {
        authorizeURL.searchParams.append("oauth_token", oAuthRequestToken?.oauth_token || "");
        console.log("Please go here and authorize:", authorizeURL.href);
        const { pin } = await inquirer.prompt({
          type: "input",
          name: "pin",
          message: "Please enter your PIN here ... ",
        });

        oAuthAccessToken = await this.getOAuthAccessToken(oAuthRequestToken, pin.trim());
      }

      if (oAuthAccessToken) {
        return {
          oauth_access_token: oAuthAccessToken.oauth_token,
          oauth_access_token_secret: oAuthAccessToken.oauth_token_secret,
        };
      }
    } catch (e) {
      console.error(e);
    }
  },
  getRequest({
    oauth_token,
    oauth_token_secret,
  }: OAuthTokenInterface): (message: string) => Promise<any> {
    return async (text: string) => {
      const endpointURL = `https://api.twitter.com/2/tweets`;
      const token = {
        key: oauth_token,
        secret: oauth_token_secret,
      };

      const authHeader = this.oauth.toHeader(
        this.oauth.authorize(
          {
            url: endpointURL,
            method: "POST",
          },
          token
        )
      );

      try {
        const req = await got.post(endpointURL, {
          json: { text },
          responseType: "json",
          headers: {
            Authorization: authHeader["Authorization"],
            "user-agent": "v2CreateTweetJS",
            "content-type": "application/json",
            accept: "application/json",
          },
        });
        if (req.body) {
          return req.body;
        } else {
          throw new Error("Unsuccessful request");
        }
      } catch (err) {
        console.error(err);
      }
    };
  },
  async postATweet(message: string) {
    const response = await this.getRequest({
      oauth_token: process.env.TWITTER_ACCESS_TOKEN,
      oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    })(message);

    return response;
  },
};

module.exports = TwitterAPI;
