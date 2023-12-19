import { Component } from '@angular/core';

@Component({
  selector: 'app-question-configure',
  templateUrl: './question-configure.component.html',
  styleUrls: ['./question-configure.component.scss']
})
export class QuestionConfigureComponent {
  currentType: 'text' | 'graphic' | 'numeric' = 'text';
  currentTitle = 'Configure Your Question';

  changeType(event: Event): void {
    const select = event.target as HTMLSelectElement; // Type assertion
    const type = select.value;

    if (type === 'text' || type === 'graphic' || type === 'numeric') {
      this.currentType = type;
    }
  }

  selectOption(option: 'stars' | 'thumbs' | 'smileys'): void {
    // Handle option selection logic here
  }
}