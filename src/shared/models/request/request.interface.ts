import type { BdsHeaders } from './headers.interface';

export interface BdsRequest extends Request {
  headers: BdsHeaders;
}
