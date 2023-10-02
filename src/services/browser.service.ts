import { BadRequestException, Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";

import { Browser, Page } from 'puppeteer';

export interface BrowserInstance
{
    browser: Browser,
    page: Page,
}

export interface RenderBrowserPage {
    url: string,
    timeout: number,
    user_agent: string,
}

import logger from "../logger";

@Injectable()
export class BrowserService
{
    /**
     * Creates a new browser instance with a page.
     * @param renderBrowserParams The render data to use.
     * @returns A browser instance or null if there is an error.
     */
	public async createInstance(renderBrowserParams: RenderBrowserPage): Promise<BrowserInstance>
    {

        // Create Browser Instance:
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.CHROMIUM_PATH,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--window-size=1920,1080",
                "--incognito",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-infobars",
                "--ignore-certificate-errors",
                "--ignore-certifcate-errors-spki-list",
                `--user-agent=${renderBrowserParams.user_agent ? renderBrowserParams.user_agent : 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'}`,
            ],
        });
        // page fix for avoiding double launch
        let [page] = await browser.pages();
        const browserInstance: BrowserInstance = {
            browser,
            page,
        };
        await browserInstance.page.setViewport({
            width: 1920,
            height: 1080
        });
        const timeout: number = (renderBrowserParams.timeout ?? 120) * 1000;

        // Navigate:
        try {
            await browserInstance.page.goto(renderBrowserParams.url, {
                timeout,
                waitUntil: "networkidle2"
            });
        } catch (error: any) {
            await browserInstance.browser.close();
            logger.warn("[Browser Service] Error loading page: " + renderBrowserParams.url);
            console.log(error);
            throw new BadRequestException(error.message);
        }
        logger.debug("[Browser Service] Loaded page: " + renderBrowserParams.url);

        // Return Browser Instance:
        return browserInstance;
	}
}
