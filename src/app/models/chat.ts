
export type message = {
  belongsTo: string,
  content: string,
  sentAt: string,
}

export interface Chat {
  _id: string,
  person1: {
    picture: string,
    name: string,
    email: string,
  },
  person2: {
    picture: string,
    name: string,
    email: string,
  },
  newMessages: number,
  messages: message[]
}

