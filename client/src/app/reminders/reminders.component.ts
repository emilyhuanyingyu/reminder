import { Component, OnInit } from '@angular/core';
import { MainService } from "../main.service";

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {
  reminders: any = [];
  reminder = {
    "todo": "",
    "completed": false,
    "listId": null,
    "deadline": null
  };
  listId: number;
  lists = [];
  listName: string = '';
  editedReminder = {
    "todo": "",
    "completed": false,
    "listId": null,
    "deadline": null
  };
  deleteMessage: string = '';
  atLeastOneList: boolean = false;
  showHide: string = 'Show Completed';
  allCompleted = [];

  constructor(private service: MainService) { }

  ngOnInit() {
    this.service.lists.subscribe((data: any) => {
      if (data) {
        data.map((item) => {
          if (item.deadline !== null) {
            item.deadline = new Date(item.deadline);
          }
        })
        this.reminders = data;
      }
    })

    this.service.fetchAllLists().subscribe((lists: any) => {
      if (lists) {
        if (lists.length > 0) {
          this.atLeastOneList = true;
          this.lists = lists;
          this.getHightlightLists(lists[0].id);
          
        }
      }
    })

    this.service.atLeastOneList.subscribe((list: any) => {
      if (list) {
        if (list.length > 0) {
          this.atLeastOneList = true;
        }
      }
    })

    this.service.listId.subscribe((data: any) => {
      if (data) {
        this.listId = data;
        for (var i = 0; i < this.lists.length; i++) {
          if (this.lists[i].id == this.listId) {
            this.listName = this.lists[i].list;
          }
        }
        this.service.fetchReminders(this.listId).subscribe((data: any) => {
          // console.log(data);
        })
        if (this.listId == 0) {
          this.atLeastOneList = false;
        }
      }
      if (this.listId == undefined) {
        this.atLeastOneList = false;
      }

    });

    this.service.listName.subscribe((data) => {
      if (data) {
        this.listName = data;
      }
    })

    this.service.delList.subscribe((data) => {
      if (typeof data === 'number') {
        this.atLeastOneList = false;
      }
    })

    this.service.deleteMessage.subscribe((data) => {
      if (data) {
        this.deleteMessage = data;
        setTimeout(() => {
          this.deleteMessage = '';
        }, 1000);
        this.reminders = [];
        this.listId = undefined;
      }
    })
  }

  getHightlightLists(id: number) {
    for (var i = 0; i < this.lists.length; i++) {
      if (this.lists[i].id == id) {
        this.listName = this.lists[i].list;
      }
    }
    this.service.fetchReminders(id).subscribe((data: any) => {

      if (data) {
        data.map((item) => {
          if(item.deadline !== null){
            item.deadline = new Date(item.deadline);
          }
        })
        this.reminders = data;
      }
    })
  }

  createReminder() {
    if (!this.listId) {
      alert('Please select a list.');
      return;
    }
    else {
      this.reminder.listId = this.listId;
      this.service.addreminder(this.reminder).subscribe((data) => {
        this.reminders.push(data);
      })
      this.reminder.todo = "";
    }
  }

  deleteReminder(reminderId, index) {
    this.service.deleteReminder(reminderId).toPromise().then(() => {
      this.reminders.splice(index, 1);
    })
  }

  editReminder(reminderId, reminderContent) {
    this.reminders.forEach((item) => {
      if (item.id == reminderId) {
        let temp = { ...item };
        temp.todo = reminderContent;
        this.service.editReminder(reminderId, temp).subscribe((data: any) => {
          this.reminders.map((reminder) => {
            if (reminder.id == data.id) {
              reminder.todo = data.todo;
            }
          })
        })
      }
    })
  }

  onChange(id, index) {
    this.reminders.forEach(element => {
      if (element.id == id) {
        element.deadline = new Date(this.reminders[index].deadline);
        this.service.editReminder(id, element).subscribe((data: any) => {
          this.reminders[index].deadline = new Date(data.deadline);
        })
      }
    })
  }

  completeReminder(reminderId, index){
    this.reminders[index].completed = true;
    this.service.editReminder(reminderId, this.reminders[index]).subscribe((data:any) => {
      this.allCompleted.push(data);
    })
    this.reminders.splice(index,1);
    this.service.completedReminders.next(this.allCompleted);
  }

  toggle_visibility(id) {
    var e = document.getElementById(id);
    if(e.style.height == '50px'){
      e.style.height = '0'
    }else{
      e.style.height = '50px'
    }
 }

}
