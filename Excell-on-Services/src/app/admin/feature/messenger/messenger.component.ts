import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message/message.service';
import { Group } from 'src/app/interfaces/group';
import { Message } from 'src/app/interfaces/message';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer?: ElementRef;
  public groups: Group[] = [];
  public selectedGroup?: Group;
  public employee?: any;
  public message: Message[] = [];
  public messageContent: string = '';
  constructor(public messageService: MessageService) { }
  ngOnInit(): void {
    const email = localStorage.getItem('loginEmail');
    if (email != null) {
      console.log(email);
      this.messageService.createChatConnection(email.toString());
    }
    this.getEmployee();
    this.messageService.message$.subscribe((message) => {
      // Xử lý tin nhắn mới ở đây và cập nhật UI nếu cần
      this.message = message
    });
  }

  getAllGroupsByEmployeeId(id: number): void {
    this.messageService.getAllGroupsByEmployeeId(id).subscribe(
      (response) => {
        this.groups = response;
        console.log(this.groups);
      },
      (error) => {
        console.error('Error fetching groups:', error);
      }
    );
  }

  getInitials(name: string): string {
    const words = name.split(' ');
    const initials = words.map(word => word.charAt(0)).join('');
    return initials.substring(0, 2).toUpperCase();
  }
  randomColor(): string {

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const hexColor = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    return hexColor;
  }

  showChat(group: Group): void {
    this.selectedGroup = group;
    console.log(this.selectedGroup);
    this.getMessage();
    this.scrollToBottom();
  }


  getEmployee(): void {
    const jwt = localStorage.getItem("tokenAdmin");
    if (jwt) {
      this.messageService.getUserProfileByJwt(jwt).subscribe(
        (response: any) => {
          this.employee = response.userProfile;
          console.log(this.employee);
          this.getAllGroupsByEmployeeId(this.employee.id);
        },
        error => {
          console.error('Error fetching employee profile:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage.');
    }
  }

  getMessage(): void {
    if (!this.selectedGroup) {
      console.error('No group selected.');
      return;
    }
    this.messageService.getAllMessageByGroupName(this.selectedGroup.groupName).subscribe(
      (response: Message[]) => {
        this.message = [];
        this.message = response;
        this.messageService.setMessage(this.message);
        console.log(this.message);
      },
      error => {
        console.error('Error fetching messages:', error);
      }
    );
  }
  sendChatMessage(messageContent: string) {
    if (!this.selectedGroup || !messageContent.trim()) {
      return;
    }

    const message: Message = {
      groupName: this.selectedGroup.groupName,
      content: messageContent,
      senderUserName: this.employee.email,
      reciveUserName: this.selectedGroup.customerEmail
    };
    
    this.messageService.sendMessage(message).then(( ) => {
      console.log(this.message);
      this.messageContent = '';
    }).catch(error => {
      console.error('Error sending message:', error);

    });
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

}