import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ordered-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './ordered-list.component.html',
  styleUrl: './ordered-list.component.css'
})
export class OrderedListComponent {
   item:string = "";
  itemsList: Array<string> = [];
  buttonText: "down"|"up" = "down";
  sortAction: number = 1;
  
  addListItem() {
    if(this.item.length) {
      this.itemsList.push(this.item)
      this.sortHandler(this.buttonText);
    }
    this.item="";
  }
  
  sortItems(action: string){
    this.buttonText = action === "down" ? "up" : "down";
    this.sortHandler(this.buttonText);
  } 

  sortHandler(action: string) {
    this.itemsList.sort((item1, item2) => {
      if(action === "up") {
        return item2.localeCompare(item1);
      }else {
        return item1.localeCompare(item2);
      }
    })
    
  }
  
  clear() {
    this.item = "";
    this.itemsList = [];
  }
  
}
