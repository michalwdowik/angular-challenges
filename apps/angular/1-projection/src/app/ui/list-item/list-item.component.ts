import { Component, output } from '@angular/core';
import { CardType } from '../../model/card.model';

@Component({
  selector: 'app-list-item',
  template: `
    <div class="border-grey-300 flex justify-between border px-2 py-1">
      <ng-content />
      <button (click)="delete.emit()">
        <img class="h-5" src="assets/svg/trash.svg" />
      </button>
    </div>
  `,
  standalone: true,
})
export class ListItemComponent {
  delete = output<void>();
  CardType = CardType;
}
