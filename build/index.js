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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("node:fs/promises");
var path = require("node:path");
var TwitterAPI = require("./TwitterAPI");
var AirtableAPI = require("./AirtableAPI");
var Actions;
(function (Actions) {
    Actions["POST_A_TWEET"] = "Post a tweet.";
    Actions["FETCH_ACCESS_TOKENS"] = "Fetch access tokens.";
})(Actions || (Actions = {}));
var inquirer = require("inquirer");
function evalMessage(str, names) {
    return str.replace(/\$\{names\}/i, names.join(", "));
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var action, _a, files, template, message_1, err_1, accessTokens, err_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([
                        {
                            type: "list",
                            name: "action",
                            message: "What do you want to do?",
                            choices: [Actions.POST_A_TWEET, Actions.FETCH_ACCESS_TOKENS],
                        },
                    ])];
                case 1:
                    action = (_b.sent()).action;
                    _a = action;
                    switch (_a) {
                        case Actions.POST_A_TWEET: return [3 /*break*/, 2];
                        case Actions.FETCH_ACCESS_TOKENS: return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 12];
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, (0, promises_1.readdir)(path.join(__dirname, "../templates/"))];
                case 3:
                    files = _b.sent();
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: "list",
                                name: "template",
                                message: "Which template do you want to use?",
                                choices: __spreadArray([], files, true),
                            },
                        ])];
                case 4:
                    template = (_b.sent()).template;
                    return [4 /*yield*/, (0, promises_1.readFile)(path.join(__dirname, "../templates/", template), "utf8")];
                case 5:
                    message_1 = _b.sent();
                    AirtableAPI.getNames(function (names) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, TwitterAPI.postATweet(evalMessage(message_1, names))];
                                case 1:
                                    result = _a.sent();
                                    console.log(result);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _b.sent();
                    console.error(err_1);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 12];
                case 8:
                    _b.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, TwitterAPI.fetchAccessTokens(inquirer)];
                case 9:
                    accessTokens = _b.sent();
                    console.log(accessTokens);
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _b.sent();
                    console.error(err_2);
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, main()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
