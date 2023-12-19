import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-emoticon-rating',
  templateUrl: './emoticon-rating.component.html',
  styleUrls: ['./emoticon-rating.component.scss']
})
export class EmoticonRatingComponent {
  @Input() question: string = '';
  @Input() buttonTextColor: string = '#000000';
  emoticonRating: string | null = null;

  setEmoticonRating(rating: string) {
    this.emoticonRating = rating;
  }
}
