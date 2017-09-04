import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ChatboxService } from './chatbox.service';
import { environment } from './../../../environments/environment';

import * as io from 'socket.io-client';


@Component({
  selector: 'rts-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit, OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chats: any;
  joinned: Boolean = false;
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io(environment.SOCKETURL);

  constructor(private chatService: ChatboxService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      this.getChatByRoom(user.room);
      this.msgData = {
        room: user.room,
        nickname: user.nickname,
        message: ''
      }
      this.joinned = true;
      this.scrollToBottom();
    }
    this.socket.on('new-message', function (data) {
      if (data.message.room === JSON.parse(localStorage.getItem('user')).room) {
        this.chats.push(data.message);
        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
      }
    }.bind(this));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getChatByRoom(room) {
    this.chatService
      .getChatByRoom(room)
      .then((res) => {
        this.chats = res;
      }, (err) => {
        console.log(err);
      });
  }

  joinRoom() {
    const date = new Date();
    localStorage.setItem('user', JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = {
      room: this.newUser.room,
      nickname: this.newUser.nickname,
      message: ''
    };
    this.joinned = true;

    this.socket.emit('save-message', {
      room: this.newUser.room,
      nickname: this.newUser.nickname,
      message: 'Join this room',
      updated_at: date
    });
  }

  sendMessage() {
    this.chatService
      .saveChat(this.msgData)
      .then((result) => {
        this.socket
          .emit('save-message', result);
      }, (err) => {
        console.log(err);
      });
  }

  logout() {
    const date = new Date();
    const user = JSON.parse(localStorage.getItem('user'));
    this.socket
      .emit('save-message', {
        room: user.room,
        nickname: user.nickname,
        message: 'Left this room',
        updated_at: date
      });
    localStorage
      .removeItem('user');
    this.joinned = false;
  }

}
