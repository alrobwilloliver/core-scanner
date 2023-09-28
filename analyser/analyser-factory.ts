import { Page } from "puppeteer";

import logger from "../logger";

import { AxeAnalyser } from "./axe/AxeAnalyser";
import { CodeSnifferAnalyser } from "./code-sniffer/CodeSnifferAnalyser";
import { analyserType } from "../type/scanner-core";

export function createAnalyser(analyserType: analyserType | string, page: Page, rules: any[] = []) {
    switch (analyserType) {
        case "axe":
            return new AxeAnalyser(page, rules);
        case "code-sniffer":
            return new CodeSnifferAnalyser(page, rules);
        case "css":
            // optional todo if rastin would like to use this method.
        default:
            logger.error("No analyser passed in...");
            throw new Error("No Analyser Selected");
    }
}