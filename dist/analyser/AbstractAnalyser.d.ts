import { Page } from "puppeteer";
import { Issue } from "../type/issue";
export declare abstract class AbstractAnalyser {
    page: Page;
    rules: any[];
    constructor(page: Page, rules?: any[]);
    abstract analyse(): Promise<Issue[]>;
}
//# sourceMappingURL=AbstractAnalyser.d.ts.map