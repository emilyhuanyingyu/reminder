import { Component, OnInit, Input } from '@angular/core';
import { MainService } from '../main.service'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  completed: any;
  allCompleted: any;
  showHide: string = "show completed";
  atLeastOneCompleted: boolean;

  constructor(private service: MainService) { }

  ngOnInit() {
    this.service.completedReminders.subscribe((data) => {
      if(data){
        this.completed = data;
        this.atLeastOneCompleted = true;
      }
    })

    this.service.fetchAllReminders().subscribe((data:any) => {
      if(data){
        this.allCompleted = data;
        for(let i = 0; i < this.allCompleted.length; i++){
          if(this.allCompleted[i].completed == true){
            this.atLeastOneCompleted = true;
          } else {
            this.atLeastOneCompleted = false;
          }
        }
      }
    })

    this.service.deletedListId.subscribe((data) => {
      if (data) {
        for (let i = 0; i < this.allCompleted.length; i++) {
          if (this.allCompleted[i].listId == data) {
            this.allCompleted.splice(i, 1);
          }
        }
        if (this.completed !== undefined) {
          for (let i = 0; i < this.completed.length; i++) {
            if (this.completed[i].listId == data) {
              this.completed.splice(i, 1);
            }
          }
        }
      }
    })

  }

  showCompleted() {
    if (this.showHide == "show completed") {
      this.showHide = "hide completed";
    } else {
      this.showHide = "show completed";
    }
  }

}