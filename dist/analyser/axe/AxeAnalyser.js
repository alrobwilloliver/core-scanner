"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxeAnalyser = void 0;
const logger_1 = __importDefault(require("../../logger"));
const axe_core_1 = require("./axe-core");
const AbstractAnalyser_1 = require("../AbstractAnalyser");
// return {
//     code: issue.code,
//     type: issue.type,
//     typeCode: issueCodeMap[issue.type] || 0,
//     message: issue.message,
//     context: issue.element ? getElementContext(issue.element) : "",
//     selector: issue.element
//         ? getElementSelector(issue.element)
//         : "",
//     nodeType: issue.element.nodeType,
//     parent: issue.parent,
//     coords: issue.hasOwnProperty("coords")
//         ? issue.coords
//         : getCoords(issue.element),
//     fontColour: getTrueFontColor(getElementSelector(issue.element)),
//     fontSize: issue.fontSize != null ? issue.fontSize : "",
//     bgColour: issue.bgColour != null ? issue.bgColour : "",
//     runner: issue.runner,
//     runnerExtras: issue.runnerExtras || {},
//     device: options.device,
//     childNode: issue.childNode ? issue.childNode : 0,
//     xpath: "placeholder",
//     fid: issue.fid ? issue.fid : "no fid",
//     fids: issue.fids ? issue.fids : "",
//     contrastFullTest: issue.contrastFullTest
//         ? issue.contrastFullTest
//         : false,
// };
const rulesToSkip = [
    // color contrast is turned off for not functioning properly
    "color-contrast",
    // these rules are experimental
    "css-orientation-lock", "focus-order-semantics", "hidden-content", "label-content-name-mismatch", "p-as-heading", "table-fake-caption", "td-has-header"
];
class AxeAnalyser extends AbstractAnalyser_1.AbstractAnalyser {
    constructor(page, rules = []) {
        super(page, rules);
    }
    /**
     *
     * ITS FULL ON CHOP SUEY IN HERE MAN WENT oLD SCHOOL
     */
    async analyse() {
        await this.page.addScriptTag({
            path: './node_modules/axe-core/axe.min.js',
        });
        let axe;
        let options = {};
        const res = await this.page.evaluate((axeOptions) => {
            return new Promise((resolve) => {
                setTimeout(resolve, 0);
            }).then(async () => await axe.run(axeOptions));
        }, options);
        const issues = await this.handleIssues(res);
        return this.rules.length ? issues.filter((issue) => this.rules.includes(issue.technique_id)) : issues;
    }
    /*
        Handles AxeResults and parses into issues
    */
    async handleIssues(results) {
        logger_1.default.info(`going to work on ${results.violations.length} violations`);
        const issues = [];
        results.violations
            .filter(result => {
            // Only process rules that are in wcag and not disabled
            // The rule must be linked to a code in the tags e.g. wcag311 wcag422
            return this.ruleDisabled(result.id)
                && !result.tags.includes("best-practice")
                && this.getCodeFromTags(result.tags) !== "0";
        })
            .forEach(result => {
            const code = this.getCodeFromTags(result.tags);
            for (let i = 0; i < result.nodes.length; i++) {
                for (const target of result.nodes[i].target) {
                    for (const technique of axe_core_1.axeCodes[result.id].techniqueId ?? []) {
                        issues.push({
                            code,
                            severity: result.impact === "minor" ? "warning" : "error",
                            message: result.description + "\n" + (result.nodes[i].failureSummary),
                            selector: target,
                            element: result.nodes[i].html,
                            device: "desktop",
                            runner: "axe",
                            technique_id: technique
                        });
                    }
                }
            }
        }, issues);
        return issues;
    }
    getCodeFromTag(tag) {
        const wcagRegex = /^wcag(\d{1})(\d{1})(\d{1})$/;
        const wcagMatch = tag.match(wcagRegex);
        if (wcagMatch) {
            const [, first, second, third] = wcagMatch;
            return `${first}.${second}.${third}`;
        }
        return '0';
    }
    getCodeFromTags(tags) {
        for (const tag of tags) {
            const code = this.getCodeFromTag(tag);
            if (code !== "0") {
                return code;
            }
        }
        return "0";
    }
    ruleDisabled(rule) {
        return !rulesToSkip.includes(rule);
    }
}
exports.AxeAnalyser = AxeAnalyser;
//# sourceMappingURL=AxeAnalyser.js.map