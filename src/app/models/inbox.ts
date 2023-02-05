export interface Inbox {
  _id: string,
  to: string,
  subject: string,
  sentAt: string,
  body: string,
  read: boolean,
}
