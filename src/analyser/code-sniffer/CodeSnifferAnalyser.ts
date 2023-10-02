import { Page } from "puppeteer";

import { Issue } from "../../type/issue";
import logger from "../../logger";
import { AbstractAnalyser } from "../AbstractAnalyser";

export class CodeSnifferAnalyser extends AbstractAnalyser {
  wcagRuleset: string[];
  constructor(
    page: Page,
    rules: string[] = [],
    wcagRuleset = ['WCAG2A', 'WCAG2AA', 'WCAG2AAA'],
  ) {
    super(page, rules)
    this.wcagRuleset = wcagRuleset;
  }

  async analyse(): Promise<Issue[]> {

    this.page.on('console', (msg) => {
      console.log(msg.text());
    });
    await this.page.addScriptTag({
      path: './node_modules/html_codesniffer/build/HTMLCS.js',
    });

    let HTMLCS: any; // switch to the core call
    let newResults: any[] = []; // hold the results
    const typeMap: { [key: number]: string } = {
      1: "error",
      2: "warning",
      3: "notice",
    };

    /**
     * quick eval to get the HTMLCS object and messages back for each wcag rule
     */
    for (const rule of this.wcagRuleset) {
      const result = await this.page.evaluate(async (wcagRuleset, filterRules, typeMap) => {
        return new Promise<any>((resolve, reject) => {
          HTMLCS.process(wcagRuleset, window.document, () => {});

          /**
           * process the results into a simple serializable object so it can be sent back to the main thread
           * @param issue <HTMLCS_Error>
           * @returns mapped issue
           */
          const processIssue = (issue: any) => {
            const sanitizedCodeParts = sanitizeCodeParts(issue.code)
            const guideline = extractGuidelineCode(sanitizedCodeParts)
            const techniqueIds = [
              ...sanitizedCodeParts
                .split('.')
                [sanitizedCodeParts.split('.').length - 1].split(','),
            ]
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
              }
            }

            // Filter out irrelevant technique IDs based on filterRules
            const filteredTechniqueIds = filterRules.length === 0
              ? techniqueIds
              : techniqueIds.filter(
                  (techniqueId: string) => filterRules.includes(techniqueId)
                );

            return filteredTechniqueIds.map(techniqueId => {
                const selector = getSelector(issue.element, [])
                return {
                  code: guideline,
                  message: issue.msg,
                  element: issue.element.outerHTML,
                  selector: !selector ? "html" : selector,
                  severity: typeMap[issue.type] || "unknown",
                  device: 'desktop',
                  technique_id: techniqueId,
                  runner: 'code-sniffer'
                }
          });
          };

          /**
           * get the selector for an element including nth-child if needed
           * @param element <HTMLElement>
           * @param parts <Array> of parts to build the selector
           * @returns selector <string>
           */
          const getSelector = (
            element: HTMLElement | any,
            parts: Array<string>,
          ): string => {
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
          const getElementIdentifier = (element: HTMLElement): string => {
            let identifier = element.tagName.toLowerCase();
            if (!element.parentNode) {
              return identifier;
            }

            const siblings = [...element.parentNode.childNodes].filter(
              isElementNode,
            );
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
          const isOnlySibling = (
            siblings: Array<HTMLElement | any>,
            element: HTMLElement,
          ): boolean => {
            const matchingSibilings = siblings.filter(
              (sibling: HTMLElement | any) => {
                return (
                  sibling.tagName.toLowerCase() === element.tagName.toLowerCase()
                );
              },
            );
            return matchingSibilings.length <= 1;
          };

          /**
           * check if an element is a node type of element
           * @param element <HTMLElement>
           * @returns boolean
           */
          const isElementNode = (element: HTMLElement | any): boolean => {
            return element.nodeType === window.Node.ELEMENT_NODE;
          };

          const sanitizeCodeParts = (code: string): string => {
        
            // recursively remove any value that does not match to a correct fid value
            const regexPattern = /(\.|,)[A-Z]+\d+$/;
            if (regexPattern.test(code)) {
              return code;
            } else {
              if (code.length > 0) {
                return sanitizeCodeParts(code.slice(0, -1));
              } else {
                return "";
              }
            }
          }
        
          const extractGuidelineCode = (newGuideline: string) => {
            let guideline = newGuideline.replaceAll("_", ".");
            const match = guideline.match(/\d+\.\d+\.\d+\.\d+\.\d+/);
            if (match) {
              const guidelineCode = match[0].split('.').slice(-3).join('.');
              return guidelineCode;
            }
            return guideline;
          }
          try {
            resolve(HTMLCS.getMessages().flatMap(processIssue));
          } catch (err: any) {
            logger.error(`Error message: ${err.message}`);
          }
        });
      }, rule, this.rules, typeMap);
      newResults = newResults.concat(result);
    }

    return newResults;
  }
}
