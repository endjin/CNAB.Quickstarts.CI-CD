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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const yaml = __importStar(require("js-yaml"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let manifestPath = core.getInput("manifest_path");
            let workspacePath = process.env.GITHUB_WORKSPACE;
            let fullPath = path.join(workspacePath, manifestPath);
            let manifestContents = yield fs_1.promises.readFile(manifestPath, 'utf8');
            let manifest = yaml.safeLoad(manifestContents);
            let mixins = manifest.mixins.join(',');
            core.setOutput("mixins", mixins);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
