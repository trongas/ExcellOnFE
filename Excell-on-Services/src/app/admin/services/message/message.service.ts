import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from 'src/app/interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private chatConnection?: signalR.HubConnection;
  constructor(private http: HttpClient) {
  }
  private messageSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  public message$ = this.messageSubject.asObservable();
  public createChatConnection(email: string) {
    this.chatConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7260/chat", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
    this.chatConnection.start().catch(error => {
      console.log("Error : ");
      console.log(error); 

    });
    this.chatConnection.on('ReciveMessage', (message: Message) => {
      var curruntMessage = this.messageSubject.getValue();
      var updateMessage = [...curruntMessage,message]
      this.messageSubject.next(updateMessage);
    });
  }

  setMessage(message:Message[]){
    this.messageSubject.next(message)
    console.log(this.messageSubject.getValue());
  }
  public getAllGroupsByEmployeeId(id: number): Observable<Group[]> {
    return this.http.get<Group[]>(`https://localhost:7260/api/Chat/GetAllGroupByEmployeeId?employeeId=${id}`);
  }

  public getGroupByClientId(id: number): Observable<Group> {
    return this.http.get<Group>(`https://localhost:7260/api/Chat/GetGroupByClientId?clientId=${id}`)
  }

  public getAllMessageByGroupName(name: string): Observable<Message[]> {
    return this.http.get<Message[]>(`https://localhost:7260/api/Chat/GetAllMessageByGroupName?groupName=${name}`);
  }

  public getUserProfileByJwt(jwt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    });

    return this.http.post<any>(`https://localhost:7260/api/Auth/GetEmployeeProfileByJwt?token=${jwt}`, { headers })
  }

  public createGroupChat(group: any) {
    return this.http.post<any>(`https://localhost:7260/api/Chat/CreateGroupChat`, group);
  }

  async sendMessage(message: Message): Promise<any> {
    return this.chatConnection?.invoke('RecivePrivateMessage', message)
      .catch(err => console.log(err));
  }

}
