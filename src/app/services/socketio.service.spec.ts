import { TestBed } from '@angular/core/testing';
import { environment, SocketioService } from './socketio.service';

describe('SocketioService', () => {
  let service: SocketioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setupSocketConnection()', () => {
    it('should setup socket connection with student email', () => {
      const email = 'student@example.com';
      const socketEndpoint = environment.SOCKET_ENDPOINT;
      spyOn(service, 'setupSocketConnection').and.callThrough();
      service.setupSocketConnection(email);
      expect(service.socket.io.uri).toEqual(socketEndpoint);
      expect(service.socket.io.opts.query).toEqual({
        studentEmail: email,
        transports: ['websocket'],
        upgrade: false,
      });
    });
  });

  describe('sendMessage()', () => {
    it('should emit `send-message` event with message and chat ID', () => {
      const message = {
        belongsTo: 'axasd',
        content: 'Hello',
        sentAt: 'dasjd',
      };
      const chatID = '1234';
      service.setupSocketConnection('hady@gmail.com');
      spyOn(service.socket, 'emit').and.callThrough();
      service.sendMessage(message, chatID);
      expect(service.socket.emit).toHaveBeenCalledWith(
        'send-message',
        message,
        chatID
      );
    });
  });

  describe('notifyForANewComment()', () => {
    it('should emit `add-comment` event with target email', () => {
      const targetEmail = 'teacher@example.com';
      service.setupSocketConnection('hady@gmail.com');
      spyOn(service.socket, 'emit').and.callThrough();
      service.notifyForANewComment(targetEmail);
      expect(service.socket.emit).toHaveBeenCalledWith(
        'add-comment',
        targetEmail
      );
    });
  });

  describe('notifyForANewReply', () => {
    it('should emit `add-reply` event with target email', () => {
      const targetEmail = 'teacher@example.com';
      service.setupSocketConnection('hady@gmail.com');
      spyOn(service.socket, 'emit').and.callThrough();
      service.notifyForANewReply(targetEmail);
      expect(service.socket.emit).toHaveBeenCalledWith(
        'add-reply',
        targetEmail
      );
    });
  });

  describe('notifyForANewReact()', () => {
    it('should emit `add-react` event with target email', () => {
      const targetEmail = 'teacher@example.com';
      service.setupSocketConnection('hady@gmail.com');
      spyOn(service.socket, 'emit').and.callThrough();
      service.notifyForANewReact(targetEmail);
      expect(service.socket.emit).toHaveBeenCalledWith(
        'add-react',
        targetEmail
      );
    });
  });

  describe('online()', () => {
    it('should emit `online` event with ID', () => {
      const id = '1234';
      service.setupSocketConnection('hady@gmail.com');
      spyOn(service.socket, 'emit').and.callThrough();
      service.online(id);
      expect(service.socket.emit).toHaveBeenCalledWith('online', id);
    });
  });

  describe('joinChat()', () => {
    it('should emit `join-chat` event with chat ID', () => {
      const chatID = '1234';
      service.setupSocketConnection('hady@gmail.com');
      spyOn(service.socket, 'emit').and.callThrough();
      service.joinChat(chatID);
      expect(service.socket.emit).toHaveBeenCalledWith('join-chat', chatID);
    });
  });

  describe('typingMessage()', () => {
    it('should emit `typing-message` event with chat ID and message', () => {
      const chatID = '1234';
      const message = 'Hello';
      service.setupSocketConnection('hady@gmail.com');
      spyOn(service.socket, 'emit').and.callThrough();
      service.typingMessage(chatID, message);
      expect(service.socket.emit).toHaveBeenCalledWith(
        'typing-message',
        chatID,
        message
      );
    });
  });

  describe('disconnect()', () => {
    it('should disconnect socket connection', () => {
      service.setupSocketConnection('hady@gmail.com');
      spyOn(service.socket, 'disconnect').and.callThrough();
      service.disconnect();
      expect(service.socket.disconnect).toHaveBeenCalled();
    });
  });
});
