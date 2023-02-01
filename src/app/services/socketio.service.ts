import { message } from './../models/chat';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: any;
  constructor() {}

  setupSocketConnection(email: string) {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      query: { studentEmail: email, transports: ['websocket'], upgrade: false},
    });
  }

  sendMessage(msg: message, chatID: string) {
    this.socket.emit('send-message', msg, chatID);
  }

  notifyForANewComment(targetEmail: string){
    this.socket.emit("add-comment",targetEmail)
  }

  notifyForANewReply(targetEmail: string){
    this.socket.emit("add-reply",targetEmail)
  }

  notifyForANewReact(targetEmail: string){
    this.socket.emit("add-react",targetEmail)
  }

  online(id: string) {
    this.socket.emit('online', id);
  }

  joinChat(chatID: string) {
    if(this.socket)
      this.socket.emit('join-chat', chatID);
  }

  typingMessage(chatID: string, message: string) {
    this.socket.emit('typing-message', chatID, message);
  }

  disconnect() {
    this.socket.disconnect()
  }
}

export const environment = {
  production: false,
  SOCKET_ENDPOINT: 'http://localhost:1234',
};

export const API_URL = 'http://localhost:1234';
