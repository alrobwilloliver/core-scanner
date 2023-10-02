import { Page } from "puppeteer";
import { AxeAnalyser } from "./axe/AxeAnalyser";
import { CodeSnifferAnalyser } from "./code-sniffer/CodeSnifferAnalyser";
import { analyserType } from "../type/scanner-core";
export declare function createAnalyser(analyserType: analyserType | string, page: Page, rules?: any[]): AxeAnalyser | CodeSnifferAnalyser;
//# sourceMappingURL=analyser-factory.d.ts.map