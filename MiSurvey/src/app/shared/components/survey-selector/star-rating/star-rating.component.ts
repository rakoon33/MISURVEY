import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  @Input() question: string = '';
  starRating: number | null = null;

  setRating(rating: number) {
    this.starRating = rating;
  }
}
