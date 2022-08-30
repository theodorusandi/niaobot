"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const crypto = __importStar(require("crypto"));
const got = require('got');
const OAuth = require('oauth-1.0a');
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
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});
function input(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            readline.question(prompt, (out) => {
                readline.close();
                resolve(out);
            });
        }));
    });
}
function parse(body) {
    return new Proxy(new URLSearchParams(body), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
}
function requestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = oauth.toHeader(oauth.authorize({
            url: requestTokenURL,
            method: 'POST'
        }));
        const req = yield got.post(requestTokenURL, {
            headers: {
                Authorization: authHeader["Authorization"]
            }
        });
        if (req.body) {
            return parse(req.body);
        }
        else {
            throw new Error('Cannot get an OAuth request token');
        }
    });
}
function accessToken({ oauth_token, oauth_token_secret }, verifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = oauth.toHeader(oauth.authorize({
            url: accessTokenURL,
            method: 'POST'
        }));
        const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`;
        const req = yield got.post(path, {
            headers: {
                Authorization: authHeader["Authorization"]
            }
        });
        if (req.body) {
            return parse(req.body);
        }
        else {
            throw new Error('Cannot get an OAuth request token');
        }
    });
}
function getRequest({ oauth_token, oauth_token_secret }) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = {
            key: oauth_token,
            secret: oauth_token_secret
        };
        const authHeader = oauth.toHeader(oauth.authorize({
            url: endpointURL,
            method: 'POST'
        }, token));
        const req = yield got.post(endpointURL, {
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
        }
        else {
            throw new Error('Unsuccessful request');
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oAuthRequestToken = yield requestToken();
        authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token || '');
        console.log('Please go here and authorize:', authorizeURL.href);
        const pin = yield input('Paste the PIN here: ');
        const oAuthAccessToken = yield accessToken(oAuthRequestToken, pin.trim());
        const response = yield getRequest(oAuthAccessToken);
        console.dir(response, {
            depth: null
        });
    }
    catch (e) {
        console.log(e);
        process.exit(-1);
    }
    process.exit();
}))();
