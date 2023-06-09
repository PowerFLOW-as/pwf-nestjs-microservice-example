export interface BdsHeaders extends Headers {
  authorization: string;
  'x-jwt-token': string;
}
