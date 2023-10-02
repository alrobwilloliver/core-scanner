import { Page } from "puppeteer";
import { Issue } from "../../type/issue";
import { AbstractAnalyser } from "../AbstractAnalyser";
export declare class CodeSnifferAnalyser extends AbstractAnalyser {
    wcagRuleset: string[];
    constructor(page: Page, rules?: string[], wcagRuleset?: string[]);
    analyse(): Promise<Issue[]>;
}
//# sourceMappingURL=CodeSnifferAnalyser.d.ts.map