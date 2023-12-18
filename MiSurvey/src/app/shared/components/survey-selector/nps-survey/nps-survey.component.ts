import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nps-survey',
  templateUrl: './nps-survey.component.html',
  styleUrls: ['./nps-survey.component.scss']
})
export class NpsSurveyComponent {
  @Input() question: string = '';
  @Input() buttonTextColor: string = '';
  npsScore: number | null = null;

  getDarkerColor(hexColor: string, darkenBy: number): string {
    if (!hexColor.startsWith('#') || hexColor.length !== 7) {
      return hexColor;
    }

  
    // Chuyển đổi từ HEX sang RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
  
    if (hexColor === '#000000' || (r === 0 && g === 0 && b === 0)) {
      return '#a1a1a1';
    }
  
    if (hexColor === '#FFFFFF' || (r === 255 && g === 255 && b === 255)) {
      return '#a1a1a1';
    }

    // Làm đậm màu bằng cách giảm giá trị của mỗi kênh
    const darkerR = Math.max(0, r - darkenBy).toString(16).padStart(2, '0');
    const darkerG = Math.max(0, g - darkenBy).toString(16).padStart(2, '0');
    const darkerB = Math.max(0, b - darkenBy).toString(16).padStart(2, '0');
  
    // Kết hợp lại và trả về dưới dạng HEX
    return `#${darkerR}${darkerG}${darkerB}`;
  }

  
  setScore(score: number) {
    this.npsScore = score;
  }
}
