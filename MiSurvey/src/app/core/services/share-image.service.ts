import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareImageService {
  private fileSource = new BehaviorSubject<File | null>(null);
  file$ = this.fileSource.asObservable();

  setFile(file: File | null) {
    this.fileSource.next(file);
  }
}   