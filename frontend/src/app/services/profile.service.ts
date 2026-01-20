import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentProfile = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('http://localhost:8080/api/profile').pipe(
      map(profile => {
        this.profileSubject.next(profile);
        return profile;
      })
    );
  }

  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>('http://localhost:8080/api/profile', profile).pipe(
      map(updatedProfile => {
        this.profileSubject.next(updatedProfile);
        return updatedProfile;
      })
    );
  }

  uploadProfilePicture(file: File): Observable<{ profilePicture: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{ profilePicture: string }>('http://localhost:8080/api/profile/picture', formData);
  }

  getCurrentProfile(): UserProfile | null {
    return this.profileSubject.value;
  }

  // For demo purposes - set default profile picture
  setDefaultProfilePicture(): void {
    const currentProfile = this.profileSubject.value;
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        profilePicture: `https://ui-avatars.com/api/?name=${currentProfile.username}&background=random&color=fff`
      };
      this.profileSubject.next(updatedProfile);
    }
  }

  // Update profile picture in the service
  updateProfilePicture(profilePictureUrl: string): void {
    const currentProfile = this.profileSubject.value;
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        profilePicture: profilePictureUrl
      };
      this.profileSubject.next(updatedProfile);
    }
  }
}
