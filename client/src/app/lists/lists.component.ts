import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MainService } from "../main.service";
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  lists: any;
  createdlist = {
    list: ''
  };
  editedList = {
    "id": null,
    "list": ''
  }

  constructor(
    private mainService: MainService,
    private messagesService: MessagesService
  ) { }

  ngOnInit() {
    this.fetchAllLists();
  }

  fetchAllLists() {
    this.mainService.fetchAllLists()
    .pipe(
      map(data => {
        this.lists = data;
        if (this.lists.length > 0) {
          this.mainService.listId.next(this.lists[0].id);
        }
      }),
      catchError(error => {
        const message = 'We are having technical errors.';
        this.messagesService.showErrors(message);
        return throwError(error); 
      })
    ).subscribe((data: any) => {})
  }

  showReminders(id) {
    this.mainService.fetchReminders(id).subscribe((data) => {
      this.mainService.lists.next(data);
    })
    this.mainService.listId.next(id);

    for (var i = 0; i < this.lists.length; i++) {
      if (this.lists[i].id == id) {
        this.mainService.listName.next(this.lists[i].list);
      }
    }
  }

  createList() {
    if (this.createdlist.list.length > 0) {
      this.mainService.addList(this.createdlist).subscribe((data: any) => {
        this.mainService.atLeastOneList.next(data.list);
        this.lists.push(data);
        this.mainService.listId.next(data.id);
        this.mainService.listName.next(data.list);
      })
      this.createdlist.list = "";
    }
  }

  deleteList(listId, index) {
    this.mainService.deleteList(listId).toPromise().then((data) => {
      this.mainService.deleteMessage.next(this.lists[index].list);
      this.mainService.deletedListId.next(this.lists[index].id);

      if (this.lists.length > 1) {
        if (index == this.lists.length - 1) {
          this.showReminders(this.lists[index - 1].id);
          this.lists.splice(index, 1);
          return;
        } else {
          this.showReminders(this.lists[index + 1].id);
          this.lists.splice(index, 1);
          return;
        }
      }
      if (this.lists.length == 1) {
        this.showReminders(this.lists[0].id);
        this.lists.splice(index, 1);
        this.mainService.delList.next(0);
        return;
      }
    })
  }

  editList(listId, editedList) {
    this.editedList = {
      "id": listId,
      "list": editedList
    }
    this.mainService.editList(listId, this.editedList).subscribe((data: any) => {
      this.mainService.listName.next(data.list)
    })
  }
}
