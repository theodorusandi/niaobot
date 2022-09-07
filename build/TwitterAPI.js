"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var crypto = require("crypto");
var got = require("got");
var OAuth = require("oauth-1.0a");
function parse(body) {
    return new Proxy(new URLSearchParams(body), {
        get: function (searchParams, prop) { return searchParams.get(prop); },
    });
}
var TwitterAPI = {
    oauth: OAuth({
        consumer: {
            key: process.env.TWITTER_API_KEY,
            secret: process.env.TWITTER_API_KEY_SECRET,
        },
        signature_method: "HMAC-SHA1",
        hash_function: function (baseString, key) {
            return crypto.createHmac("sha1", key).update(baseString).digest("base64");
        },
    }),
    getOAuthRequestToken: function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestTokenURL, authHeader, req, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestTokenURL = "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write";
                        authHeader = this.oauth.toHeader(this.oauth.authorize({
                            url: requestTokenURL,
                            method: "POST",
                        }));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, got.post(requestTokenURL, {
                                headers: {
                                    Authorization: authHeader["Authorization"],
                                },
                            })];
                    case 2:
                        req = _a.sent();
                        if (req.body) {
                            return [2 /*return*/, parse(req.body)];
                        }
                        else {
                            throw new Error("Cannot get an OAuth request token");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    getOAuthAccessToken: function (_a, verifier) {
        var oauth_token = _a.oauth_token;
        return __awaiter(this, void 0, void 0, function () {
            var authHeader, req, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        authHeader = this.oauth.toHeader(this.oauth.authorize({
                            url: "https://api.twitter.com/oauth/access_token",
                            method: "POST",
                        }));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, got.post("https://api.twitter.com/oauth/access_token?oauth_verifier=".concat(verifier, "&oauth_token=").concat(oauth_token), {
                                headers: {
                                    Authorization: authHeader["Authorization"],
                                },
                            })];
                    case 2:
                        req = _b.sent();
                        if (req.body) {
                            return [2 /*return*/, parse(req.body)];
                        }
                        else {
                            throw new Error("Cannot get an OAuth access token");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        console.error(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    fetchAccessTokens: function (inquirer) {
        return __awaiter(this, void 0, void 0, function () {
            var authorizeURL, oAuthRequestToken, oAuthAccessToken, pin, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authorizeURL = new URL("https://api.twitter.com/oauth/authorize");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.getOAuthRequestToken()];
                    case 2:
                        oAuthRequestToken = _a.sent();
                        if (!oAuthRequestToken) return [3 /*break*/, 5];
                        authorizeURL.searchParams.append("oauth_token", (oAuthRequestToken === null || oAuthRequestToken === void 0 ? void 0 : oAuthRequestToken.oauth_token) || "");
                        console.log("Please go here and authorize:", authorizeURL.href);
                        return [4 /*yield*/, inquirer.prompt({
                                type: "input",
                                name: "pin",
                                message: "Please enter your PIN here ... ",
                            })];
                    case 3:
                        pin = (_a.sent()).pin;
                        return [4 /*yield*/, this.getOAuthAccessToken(oAuthRequestToken, pin.trim())];
                    case 4:
                        oAuthAccessToken = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (oAuthAccessToken) {
                            return [2 /*return*/, {
                                    oauth_access_token: oAuthAccessToken.oauth_token,
                                    oauth_access_token_secret: oAuthAccessToken.oauth_token_secret,
                                }];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    getRequest: function (_a) {
        var _this = this;
        var oauth_token = _a.oauth_token, oauth_token_secret = _a.oauth_token_secret;
        return function (text) { return __awaiter(_this, void 0, void 0, function () {
            var endpointURL, token, authHeader, req, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpointURL = "https://api.twitter.com/2/tweets";
                        token = {
                            key: oauth_token,
                            secret: oauth_token_secret,
                        };
                        authHeader = this.oauth.toHeader(this.oauth.authorize({
                            url: endpointURL,
                            method: "POST",
                        }, token));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, got.post(endpointURL, {
                                json: { text: text },
                                responseType: "json",
                                headers: {
                                    Authorization: authHeader["Authorization"],
                                    "user-agent": "v2CreateTweetJS",
                                    "content-type": "application/json",
                                    accept: "application/json",
                                },
                            })];
                    case 2:
                        req = _a.sent();
                        if (req.body) {
                            return [2 /*return*/, req.body];
                        }
                        else {
                            throw new Error("Unsuccessful request");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    },
    postATweet: function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRequest({
                            oauth_token: process.env.TWITTER_ACCESS_TOKEN,
                            oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
                        })(message)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    },
};
module.exports = TwitterAPI;
