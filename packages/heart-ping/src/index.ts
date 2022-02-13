import http from 'http';
import https from 'https';

const DEFAULT_TIMEOUT = 5000;
const DEFAULT_INTERVAL = 3000;

export default class HeartPing {
  private interval = DEFAULT_INTERVAL;
  private lastHeartbeatTime = 0;
  private timeout = DEFAULT_TIMEOUT;

  private timer: NodeJS.Timer | undefined;
  private timeoutTimer: NodeJS.Timer | undefined;

  private timeoutFn = (): void => {
    // User defined timeout function.
  };

  /**
   * Returns the current heartbeat interval.
   */
  public getBeatInterval(): number {
    return this.interval;
  }

  /**
   * Sets the current heartbeat interval to the given one.
   *
   * @param number newInterval The new interval period.
   */
  public setBeatInterval(newInterval: number): void {
    this.interval = newInterval;
  }

  /**
   * Returns the current heartbeat timeout period.
   */
  public getBeatTimeout(): number {
    return this.timeout;
  }

  /**
   * Sets the current timeout to the given one.
   *
   * Setting the timeout this way will immediately affect the `hasTimedOut` function
   * without the need to restart the heartbeat object. Invoking this function does
   * restart the timer controlling the `onTimeout` event.
   *
   * @param number newTimeout The new timeout period
   *
   */
  public setBeatTimeout(newTimeout: number): void {
    this.timeout = newTimeout;
    if (this.timeoutTimer !== undefined) {
      clearTimeout(this.timeoutTimer);
    }
    this.timeoutTimer = setTimeout(this.timeoutFn, this.timeout);
  }

  /**
   * Used to detected if a heartbeat has timed out.
   */
  public hasTimedOut(): boolean {
    return Date.now() - this.lastHeartbeatTime > this.timeout;
  }

  /**
   * Runs the given function when the heartbeat detects a timeout.
   *
   * @param function fn The function to be executed when a timeout occurs.
   */
  public setOnTimeout(timeoutHandler: () => void): void {
    this.timeoutFn = timeoutHandler;
  }

  /**
   * Returns true if the heartbeat is active, otherwise false.
   *
   * A heartbeat is considered active if it was started and has not been stopped yet.
   *
   * @returns True if the heartbeat is active, else false.
   */
  public isBeating(): boolean {
    return this.timer !== undefined;
  }

  /**
   * Stops the heartbeat object and clears all internal states.
   */
  public stop(): void {
    this.lastHeartbeatTime = -1;
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
    this.timer = undefined;
    if (this.timeoutTimer !== undefined) {
      clearTimeout(this.timeoutTimer);
    }
    this.timeoutTimer = undefined;
  }

  /**
   * Starts the heartbeat object, executing the a ping function at the defined interval
   *
   * @param url The destination url, e.g. www.google.com
   * @param port Optional: The port of the destination url.
   * @param function successFn The function to be executed on a successful ping.
   * @param function failedFn The function to be executed on a failed ping.
   */
  public start(
    url: string,
    port: number,
    successFunction: (time: number) => void,
    failedFunction: () => void,
  ): void {
    this.lastHeartbeatTime = Date.now();
    this.timer = setInterval(() => {
      this.timeoutTimer = setTimeout(this.timeoutFn, this.timeout);
      this.ping(url, port).then(successFunction).catch(failedFunction);
    }, this.interval);
  }

  /**
   * Stops the heartbeat if it is beating, and resets
   * all properties to the original default values.
   */
  public reset(): void {
    this.stop();
    this.interval = DEFAULT_INTERVAL;
    this.timeout = DEFAULT_TIMEOUT;
    this.timeoutFn = (): void => {
      // Reset timeout function
    };
  }

  /**
   * A promise that returns the round trip time in milliseconds.
   *
   * @param url The destination url, e.g. www.google.com.
   * @param port Optional: The port of the destination url.
   *
   * @returns Returns -1 if an error occurred.
   */
  public ping(url: string, port?: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const useHttps = url.indexOf('https') === 0;
      const protocolModule = useHttps ? https.request : http.request;
      const outPort = port || (useHttps ? 443 : 80);
      const baseUrl = url.replace('http://', '').replace('https://', '');

      const options = { host: baseUrl, port: outPort, path: '/' };
      const startTime = Date.now();

      const pingRequest = protocolModule(options, () => {
        this.lastHeartbeatTime = Date.now();
        if (this.timeoutTimer !== undefined) {
          clearTimeout(this.timeoutTimer);
        }
        resolve(Date.now() - startTime);
        pingRequest.destroy();
      });

      pingRequest.on('error', () => {
        if (this.timeoutTimer !== undefined) {
          clearTimeout(this.timeoutTimer);
        }
        reject(-1);
        pingRequest.destroy();
      });

      pingRequest.write('');
      pingRequest.end();
    });
  }
}
