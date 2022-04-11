import { AsyncLocalStorage } from 'async_hooks';
import { Logger } from 'winston';

export const storage = new AsyncLocalStorage<Map<string, Logger>>();
