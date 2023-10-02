"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = __importStar(require("puppeteer"));
const logger_1 = __importDefault(require("../logger"));
let BrowserService = class BrowserService {
    /**
     * Creates a new browser instance with a page.
     * @param renderBrowserParams The render data to use.
     * @returns A browser instance or null if there is an error.
     */
    async createInstance(renderBrowserParams) {
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
        const browserInstance = {
            browser,
            page,
        };
        await browserInstance.page.setViewport({
            width: 1920,
            height: 1080
        });
        const timeout = (renderBrowserParams.timeout ?? 120) * 1000;
        // Navigate:
        try {
            await browserInstance.page.goto(renderBrowserParams.url, {
                timeout,
                waitUntil: "networkidle2"
            });
        }
        catch (error) {
            await browserInstance.browser.close();
            logger_1.default.warn("[Browser Service] Error loading page: " + renderBrowserParams.url);
            console.log(error);
            throw new common_1.BadRequestException(error.message);
        }
        logger_1.default.debug("[Browser Service] Loaded page: " + renderBrowserParams.url);
        // Return Browser Instance:
        return browserInstance;
    }
};
BrowserService = __decorate([
    (0, common_1.Injectable)()
], BrowserService);
exports.BrowserService = BrowserService;
//# sourceMappingURL=browser.service.js.map