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
  // Properties
  item: string = '';
  itemsList: Array<string> = [];
  buttonText: 'down' | 'up' = 'down';
  sortAction: number = 1;

  /**
   * Adds a new item to the list and sorts it
   */
  addListItem(): void {
    if (this.item.length) {
      this.itemsList.push(this.item);
      this.sortHandler(this.buttonText);
    }
    this.item = '';
  }

  /**
   * Toggles sort direction and triggers sort
   */
  sortItems(action: string): void {
    this.buttonText = action === 'down' ? 'up' : 'down';
    this.sortHandler(this.buttonText);
  }

  /**
   * Handles the sorting of items based on direction
   */
  sortHandler(action: string): void {
    this.itemsList.sort((item1, item2) => {
      if (action === 'up') {
        return item2.localeCompare(item1);
      } else {
        return item1.localeCompare(item2);
      }
    });
  }

  /**
   * Clears the input and list
   */
  clear(): void {
    this.item = '';
    this.itemsList = [];
  }
}
