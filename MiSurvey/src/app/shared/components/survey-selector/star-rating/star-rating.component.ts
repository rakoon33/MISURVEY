import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() question: string = '';
  @Input() buttonTextColor: string = '';

  starRating: number | null = null;
  selectedStarColor: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['buttonTextColor']) {
      this.selectedStarColor = changes['buttonTextColor'].currentValue;
    }
  }
  setRating(rating: number) {
    this.starRating = rating;
  }
}
