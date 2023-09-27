import { Job, Queue } from 'bull';
import { Inject } from "@nestjs/common";
import { OnQueueError, OnQueueCompleted, Processor, Process, InjectQueue } from '@nestjs/bull';
import axios, { AxiosRequestConfig } from "axios";
import { Browser } from 'puppeteer';

import logger from '../logger';
import { BrowserInstance, BrowserService } from '../services/browser.service';
import { Issue } from "../type/issue";
import { BullConfig } from '../scanner-core.config';

import { PROCESSOR_NAME } from '../scanner-core.config';
import { createAnalyser } from '../analyser/analyser-factory';

export type ScanJob =  {
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
}

@Processor(PROCESSOR_NAME)
export class ScanProcessor {
  browserInstance: BrowserInstance | undefined
  constructor(
      private readonly browserService: BrowserService,
      @InjectQueue(PROCESSOR_NAME) private readonly scanQueue: Queue,
      @Inject("BULL_CONFIG") private readonly bullConfig: BullConfig
  ) {}

  @Process(PROCESSOR_NAME)
  async handleScan(job: Job<ScanJob>): Promise<void> {
    const maxRetrys = 2;
    try {
      logger.debug(`Handling scan with id: ${job.id}...`);
      this.browserInstance = await this.browserService.createInstance({
        url: job.data.scanUrl,
        timeout: job.data.timeout,
        user_agent: job.data.user_agent,
      });

      job.data.issues = await createAnalyser(PROCESSOR_NAME, this.browserInstance.page, job.data.rules).analyse();
    } catch (err: any) {
      logger.warn(`Error scanning url: ${job.data.scanUrl} with error message: ${err.message}`);
      // throw the error to initiate a retry unless exceeding max retry (attempts starts from 0)
      if (job.data.attempts < maxRetrys) {
        job.data.failed = true
        logger.debug(`Retrying scan for url: ${job.data.scanUrl} Attempt: ${job.data.attempts + 1}`);

        // must add a new scan to the list with priority 1 to retry instantly
        await this.scanQueue.add("scan-axe", {
          scanUrl: job.data.scanUrl,
          job_id: job.data.job_id,
          authHeader: job.data.authHeader,
          timeout: 30000,
          rules: job.data.rules,
          callback: job.data.callback,
          level: job.data.level,
          attempts: job.data.attempts + 1,
          user_agent: job.data.user_agent
        }, {
          priority: 1,
          attempts: 1 
        });

        if (this.browserInstance) {
          await this.closePage(this.browserInstance?.browser);
        }
        return
      }
    }
    if (!job.data.issues) {
      job.data.failed = true
      logger.debug(`Failed to analyze scan results for scan with id: ${job.id}`);

      const config: AxiosRequestConfig = {
        headers: { authorization: job.data.authHeader ?? "" },
      };
      axios.post(job.data.callback, {
        status: "failed",
        job_id: job.data.job_id,
        payload: {
          scan_url: job.data.scanUrl,
          status: "failed",
          issues: []
        },
        error: {
          message: "Failed to complete scan"
        }
      }, config).then(() => {
        logger.warn(`Sent message "failed" to scan url: ${job.data.scanUrl} relayed to ${job.data.callback}`);
      }).catch(() => {
        logger.error(`Failed to send error message "failure" status at url: ${job.data.callback} for scan url:${job.data.scanUrl} To url: ${job.data.callback}`);
      });
    }
   
    if (this.browserInstance) {
      await this.closePage(this.browserInstance?.browser);
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job<ScanJob>) {
    if (job.data.failed) {
      logger.warn(`Job Failed for scan url: ${job.data.scanUrl} and job id: ${job.id}`)
      return
    }
    logger.info(`Completed scan job ${job.id} of type ${job.name} with ${job.data?.issues?.length} issues`);
    try {
      const config: AxiosRequestConfig = {
        headers: { authorization: job.data.authHeader ?? "" },
      };
      logger.info(`Sending completed ${job.data.issues?.length} issues to be proccessed at callback url: ${job.data.callback} and at at scan url: ${job.data.scanUrl}`);
      await axios.post(job.data.callback, {
        status: "complete",
        job_id: job.data.job_id,
        payload: {
          scan_url: job.data.scanUrl,
          status: "complete",
          issues: job.data.issues
        },
      }, config);

    } catch (err: any) {
      const config: AxiosRequestConfig = {
        headers: { authorization: job.data.authHeader ?? "" },
      };
      logger.error(`Failed to send ${job.data.issues?.length} issues with a job id of ${job.id} to be proccessed for scan url: ${job.data.scanUrl} To url: ${job.data.callback}`);
      axios.post(job.data.callback, {
        status: "failed",
        job_id: job.data.job_id,
        payload: {
          scan_url: job.data.scanUrl,
          status: "failed",
          issues: []
        },
        error: {
          message: err.message
        }
      }, config).catch(() => {
        logger.error(`Failed to send error message "failure" status at url: ${job.data.callback} for scan url:${job.data.scanUrl} To url: ${job.data.callback}`)
      });
    }
  }

  @OnQueueError()
  onError(error: Error) {
    logger.error(`Scan Job errored: ${error}`)
  }

  async closePage(browser: Browser | undefined) {
    await browser?.close();
  }
}
