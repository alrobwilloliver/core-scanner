import { Page } from "puppeteer";
import { Issue } from "../type/issue";

export abstract class AbstractAnalyser {
    page: Page;
    rules: any[];
    constructor(page: Page, rules: any[] = []) {
        this.page = page;
        this.rules = rules;
    }

    public abstract analyse(): Promise<Issue[]>
}