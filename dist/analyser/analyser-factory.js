"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyser = void 0;
const logger_1 = __importDefault(require("../logger"));
const AxeAnalyser_1 = require("./axe/AxeAnalyser");
const CodeSnifferAnalyser_1 = require("./code-sniffer/CodeSnifferAnalyser");
function createAnalyser(analyserType, page, rules = []) {
    switch (analyserType) {
        case "axe":
            return new AxeAnalyser_1.AxeAnalyser(page, rules);
        case "code-sniffer":
            return new CodeSnifferAnalyser_1.CodeSnifferAnalyser(page, rules);
        case "css":
        // optional todo if rastin would like to use this method.
        default:
            logger_1.default.error("No analyser passed in...");
            throw new Error("No Analyser Selected");
    }
}
exports.createAnalyser = createAnalyser;
//# sourceMappingURL=analyser-factory.js.map