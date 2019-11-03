import Bee from 'bee-queue';
import cancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [cancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  } // end of construtor

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: Failed`, err);
  }
} // end of Queue

export default new Queue();
