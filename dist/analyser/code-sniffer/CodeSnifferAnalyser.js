"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSnifferAnalyser = void 0;
const logger_1 = __importDefault(require("../../logger"));
const AbstractAnalyser_1 = require("../AbstractAnalyser");
class CodeSnifferAnalyser extends AbstractAnalyser_1.AbstractAnalyser {
    wcagRuleset;
    constructor(page, rules = [], wcagRuleset = ['WCAG2A', 'WCAG2AA', 'WCAG2AAA']) {
        super(page, rules);
        this.wcagRuleset = wcagRuleset;
    }
    async analyse() {
        this.page.on('console', (msg) => {
            console.log(msg.text());
        });
        await this.page.addScriptTag({
            path: './node_modules/html_codesniffer/build/HTMLCS.js',
        });
        let HTMLCS; // switch to the core call
        let newResults = []; // hold the results
        const typeMap = {
            1: "error",
            2: "warning",
            3: "notice",
        };
        /**
         * quick eval to get the HTMLCS object and messages back for each wcag rule
         */
        for (const rule of this.wcagRuleset) {
            const result = await this.page.evaluate(async (wcagRuleset, filterRules, typeMap) => {
                return new Promise((resolve, reject) => {
                    HTMLCS.process(wcagRuleset, window.document, () => { });
                    /**
                     * process the results into a simple serializable object so it can be sent back to the main thread
                     * @param issue <HTMLCS_Error>
                     * @returns mapped issue
                     */
                    const processIssue = (issue) => {
                        const sanitizedCodeParts = sanitizeCodeParts(issue.code);
                        const guideline = extractGuidelineCode(sanitizedCodeParts);
                        const techniqueIds = [
                            ...sanitizedCodeParts
                                .split('.')[sanitizedCodeParts.split('.').length - 1].split(','),
                        ];
                        if (!techniqueIds.length) {
                            return {
                                code: guideline,
                                message: issue.msg,
                                element: issue.element.outerHTML,
                                selector: getSelector(issue.element, []),
                                severity: typeMap[issue.type] || "unknown",
                                device: 'desktop',
                                technique_id: "",
                                runner: 'code-sniffer'
                            };
                        }
                        // Filter out irrelevant technique IDs based on filterRules
                        const filteredTechniqueIds = filterRules.length === 0
                            ? techniqueIds
                            : techniqueIds.filter((techniqueId) => filterRules.includes(techniqueId));
                        return filteredTechniqueIds.map(techniqueId => {
                            const selector = getSelector(issue.element, []);
                            return {
                                code: guideline,
                                message: issue.msg,
                                element: issue.element.outerHTML,
                                selector: !selector ? "html" : selector,
                                severity: typeMap[issue.type] || "unknown",
                                device: 'desktop',
                                technique_id: techniqueId,
                                runner: 'code-sniffer'
                            };
                        });
                    };
                    /**
                     * get the selector for an element including nth-child if needed
                     * @param element <HTMLElement>
                     * @param parts <Array> of parts to build the selector
                     * @returns selector <string>
                     */
                    const getSelector = (element, parts) => {
                        if (isElementNode(element)) {
                            const identifier = getElementIdentifier(element);
                            parts.unshift(identifier);
                            if (element.parentNode) {
                                return getSelector(element.parentNode, parts);
                            }
                        }
                        return parts.join(' > ');
                    };
                    /**
                     * get the identifier for an element including nth-child if needed
                     * @param element <HTMLElement>
                     * @returns element identifier <string>
                     */
                    const getElementIdentifier = (element) => {
                        let identifier = element.tagName.toLowerCase();
                        if (!element.parentNode) {
                            return identifier;
                        }
                        const siblings = [...element.parentNode.childNodes].filter(isElementNode);
                        const elementIndex = siblings.indexOf(element);
                        if (!isOnlySibling(siblings, element)) {
                            identifier += `:nth-child(${elementIndex + 1})`;
                        }
                        return identifier;
                    };
                    /**
                     * check if an element is the only sibling of its tag type
                     * @param siblings <Array<HTMLElement>> of siblings
                     * @param element <HTMLElement>
                     * @returns boolean
                     */
                    const isOnlySibling = (siblings, element) => {
                        const matchingSibilings = siblings.filter((sibling) => {
                            return (sibling.tagName.toLowerCase() === element.tagName.toLowerCase());
                        });
                        return matchingSibilings.length <= 1;
                    };
                    /**
                     * check if an element is a node type of element
                     * @param element <HTMLElement>
                     * @returns boolean
                     */
                    const isElementNode = (element) => {
                        return element.nodeType === window.Node.ELEMENT_NODE;
                    };
                    const sanitizeCodeParts = (code) => {
                        // recursively remove any value that does not match to a correct fid value
                        const regexPattern = /(\.|,)[A-Z]+\d+$/;
                        if (regexPattern.test(code)) {
                            return code;
                        }
                        else {
                            if (code.length > 0) {
                                return sanitizeCodeParts(code.slice(0, -1));
                            }
                            else {
                                return "";
                            }
                        }
                    };
                    const extractGuidelineCode = (newGuideline) => {
                        let guideline = newGuideline.replaceAll("_", ".");
                        const match = guideline.match(/\d+\.\d+\.\d+\.\d+\.\d+/);
                        if (match) {
                            const guidelineCode = match[0].split('.').slice(-3).join('.');
                            return guidelineCode;
                        }
                        return guideline;
                    };
                    try {
                        resolve(HTMLCS.getMessages().flatMap(processIssue));
                    }
                    catch (err) {
                        logger_1.default.error(`Error message: ${err.message}`);
                    }
                });
            }, rule, this.rules, typeMap);
            newResults = newResults.concat(result);
        }
        return newResults;
    }
}
exports.CodeSnifferAnalyser = CodeSnifferAnalyser;
//# sourceMappingURL=CodeSnifferAnalyser.js.map