import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  lists = new Subject<any>();
  atLeastOneList = new Subject<any>();
  listId = new Subject<any>();
  delList = new Subject<any>();
  listName = new Subject<string>()
  deleteMessage = new Subject<string>();
  completedReminders = new Subject<any>();
  deletedListId = new Subject<any>();

  constructor(private http: HttpClient) { }

  fetchAllLists(){
    return this.http.get(`http://localhost:3000/lists`)
    .pipe(
      map((res) => res),
      catchError(err => {
        return throwError(err);
      })
    )
  }

  fetchReminders(id){
    return this.http.get(`http://localhost:5555/lists/${id}/reminders`)
  }

  fetchAllReminders(){
    return this.http.get(`http://localhost:5555/reminders`)
  }

  addList(list){
    return this.http.post(`http://localhost:5555/lists`, list)
  }

  addreminder(reminder){
    return this.http.post(`http://localhost:5555/reminders`, reminder)
  }

  deleteReminder(reminderId){
    return this.http.delete(`http://localhost:5555/reminders/${reminderId}`)
  }

  deleteList(listId){
    return this.http.delete(`http://localhost:5555/lists/${listId}`)
  }

  editReminder(reminderId, editedReminder){
    return this.http.put(`http://localhost:5555/reminders/${reminderId}`, editedReminder)
  }

  editList(listId, editedList){
    return this.http.put(`http://localhost:5555/lists/${listId}`, editedList)
  }


}
