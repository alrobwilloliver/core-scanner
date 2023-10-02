import { Page } from 'puppeteer';
import { AxeResults } from 'axe-core';
import { Issue } from '../../type/issue';
import { AbstractAnalyser } from '../AbstractAnalyser';
export declare class AxeAnalyser extends AbstractAnalyser {
    constructor(page: Page, rules?: any[]);
    /**
     *
     * ITS FULL ON CHOP SUEY IN HERE MAN WENT oLD SCHOOL
     */
    analyse(): Promise<Issue[]>;
    handleIssues(results: AxeResults): Promise<Issue[]>;
    getCodeFromTag(tag: string): string;
    getCodeFromTags(tags: string[]): string;
    ruleDisabled(rule: string): boolean;
}
//# sourceMappingURL=AxeAnalyser.d.ts.map