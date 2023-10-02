import { Browser, Page } from 'puppeteer';
export interface BrowserInstance {
    browser: Browser;
    page: Page;
}
export interface RenderBrowserPage {
    url: string;
    timeout: number;
    user_agent: string;
}
export declare class BrowserService {
    /**
     * Creates a new browser instance with a page.
     * @param renderBrowserParams The render data to use.
     * @returns A browser instance or null if there is an error.
     */
    createInstance(renderBrowserParams: RenderBrowserPage): Promise<BrowserInstance>;
}
//# sourceMappingURL=browser.service.d.ts.map