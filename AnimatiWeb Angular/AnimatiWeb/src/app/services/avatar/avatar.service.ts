import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../localStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarSubject = new BehaviorSubject<string>('avatar1.png');
  public avatar$ = this.avatarSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    this.loadInitialAvatar();
  }

  loadInitialAvatar(): void {
    const savedAvatar = this.localStorage.getItem('usuario_avatar');
    if (savedAvatar) {
      this.avatarSubject.next(savedAvatar);
    }
  }

  updateAvatar(avatarFileName: string): void {
    this.localStorage.setItem('usuario_avatar', avatarFileName);
    this.avatarSubject.next(avatarFileName);
  }
}
