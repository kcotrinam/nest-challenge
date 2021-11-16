export interface emailVerification {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  token?: string;
}
