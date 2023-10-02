import { Injectable } from '@nestjs/common';

import cluster from "cluster";
import * as process from 'node:process';
import logger from '../logger';

const workerCount = parseInt(process.env.WORKER_COUNT || "1", 10);

@Injectable()
export class ClusterService {
  static clusterize(callback: Function) {
    if (cluster.isPrimary) {
        logger.info(`PRIMARY PROCESS (${process.pid}) IS RUNNING `);
        logger.info(`WORKER_COUNT: ${workerCount}`)
      for (let i = 0; i < workerCount; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        logger.warn(`worker ${worker.process.pid} died`);
      });
    } else {
      callback();
    }
  }
}