import { Job, Queue } from 'bull';
import { Browser } from 'puppeteer';
import { BrowserInstance, BrowserService } from '../services/browser.service';
import { Issue } from "../type/issue";
import { BullConfig } from '../type/scanner-core';
export declare const PROCESSOR_NAME: string;
export type ScanJob = {
    authHeader: string;
    callback: string;
    scanUrl: string;
    timeout: number;
    rules: string[];
    issues: Issue[] | undefined;
    job_id: number;
    level: string;
    failed: boolean;
    attempts: number;
    user_agent: string;
};
export declare class ScanProcessor {
    private readonly browserService;
    private readonly scanQueue;
    private readonly bullConfig;
    browserInstance: BrowserInstance | undefined;
    constructor(browserService: BrowserService, scanQueue: Queue, bullConfig: BullConfig);
    handleScan(job: Job<ScanJob>): Promise<void>;
    onCompleted(job: Job<ScanJob>): Promise<void>;
    onError(error: Error): void;
    closePage(browser: Browser | undefined): Promise<void>;
}
//# sourceMappingURL=scan.processor.d.ts.map