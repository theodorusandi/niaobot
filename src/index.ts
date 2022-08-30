require('dotenv').config();

import * as crypto from 'crypto';

const got = require('got');
const OAuth = require('oauth-1.0a');

interface OAuthTokenInterface extends URLSearchParams{
  oauth_token?: string;
  oauth_token_secret?: string
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const data = {
  "text": "Hello world!"
};

const endpointURL = `https://api.twitter.com/2/tweets`;

// this example uses PIN-based OAuth to authorize the user
const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
const oauth = OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY,
    secret: process.env.TWITTER_API_KEY_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString: string, key: string) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function input(prompt: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    readline.question(prompt, (out: string) => {
      readline.close();
      resolve(out);
    });
  });
}

function parse(body: string) {
  return new Proxy(new URLSearchParams(body), {
    get: (searchParams, prop: string) => searchParams.get(prop),
  });
}

async function requestToken() {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: requestTokenURL,
    method: 'POST'
  }));

  const req = await got.post(requestTokenURL, {
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return parse(req.body)
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

async function accessToken({
  oauth_token,
  oauth_token_secret
} : OAuthTokenInterface, verifier: string) {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: accessTokenURL,
    method: 'POST'
  }));
  const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
  const req = await got.post(path, {
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

async function getRequest({
  oauth_token,
  oauth_token_secret
}: OAuthTokenInterface) {

  const token = {
    key: oauth_token,
    secret: oauth_token_secret
  };

  const authHeader = oauth.toHeader(oauth.authorize({
    url: endpointURL,
    method: 'POST'
  }, token));

  const req = await got.post(endpointURL, {
    json: data,
    responseType: 'json',
    headers: {
      Authorization: authHeader["Authorization"],
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    }
  });
  if (req.body) {
    return req.body;
  } else {
    throw new Error('Unsuccessful request');
  }
}

(async () => {
  try {
    const oAuthRequestToken: OAuthTokenInterface = await requestToken();
    authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token || '');
    console.log('Please go here and authorize:', authorizeURL.href);
    const pin = await input('Paste the PIN here: ');
    const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
    const response = await getRequest(oAuthAccessToken);
    console.dir(response, {
      depth: null
    });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();