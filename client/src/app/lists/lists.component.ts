import { Component, OnInit } from '@angular/core';
import { MainService } from "../main.service";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  lists = [];
  createdlist = {
    list: ''
  };
  editedList = {
    "id": null,
    "list": ''
  }

  constructor(private service: MainService) { }

  ngOnInit() {
    this.fetchAllLists();
  }

  fetchAllLists() {
    this.service.fetchAllLists().subscribe((data: any) => {
      this.lists = data;
      if (this.lists.length > 0) {
        this.service.listId.next(this.lists[0].id);
      }
    })
  }

  showReminders(id) {
    this.service.fetchReminders(id).subscribe((data) => {
      this.service.lists.next(data);
    })
    this.service.listId.next(id);

    for (var i = 0; i < this.lists.length; i++) {
      if (this.lists[i].id == id) {
        this.service.listName.next(this.lists[i].list);
      }
    }
  }

  createList() {
    if (this.createdlist.list.length > 0) {
      this.service.addList(this.createdlist).subscribe((data: any) => {
        this.service.atLeastOneList.next(data.list);
        this.lists.push(data);
        this.service.listId.next(data.id);
        this.service.listName.next(data.list);
      })
      this.createdlist.list = "";
    }
  }

  deleteList(listId, index) {
    this.service.deleteList(listId).toPromise().then((data) => {
      this.service.deleteMessage.next(this.lists[index].list);
      this.service.deletedListId.next(this.lists[index].id);

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
        this.service.delList.next(0);
        return;
      }
    })
  }

  editList(listId, editedList) {
    this.editedList = {
      "id": listId,
      "list": editedList
    }
    this.service.editList(listId, this.editedList).subscribe((data: any) => {
      console.log(data);
      this.service.listName.next(data.list)
    })
  }
}
