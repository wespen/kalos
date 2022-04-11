import { AsyncLocalStorage } from 'async_hooks';
import { Logger } from 'winston';

export interface StoreContents {
  logger: Logger;
  requestId: string;
}

export const storage = new AsyncLocalStorage<Map<string, StoreContents>>();
