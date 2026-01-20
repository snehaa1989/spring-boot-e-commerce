import { Component, OnInit } from '@angular/core';
import { ProfileService, UserProfile } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ImageUtils } from '../utils/image.utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  isLoading = false;
  isEditing = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    
    // Initialize profile if user is logged in but no profile data exists
    if (this.authService.isLoggedIn && !this.profile) {
      // Create a basic profile from auth data if no profile exists
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        this.profile = {
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          profilePicture: this.getDefaultProfilePicture(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    }
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.snackBar.open('Failed to load profile', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.profile) {
      // Reset to original values when canceling edit
      this.loadProfile();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.profileService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (response) => {
        if (this.profile) {
          this.profile.profilePicture = response.profilePicture;
          // Update profile service with new picture
          this.profileService.updateProfilePicture(response.profilePicture);
        }
        this.selectedFile = null;
        this.previewUrl = null;
        this.isLoading = false;
        this.snackBar.open('Profile picture updated successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error uploading profile picture:', error);
        this.snackBar.open('Failed to upload profile picture', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  saveProfile(): void {
    if (!this.profile) return;

    this.isLoading = true;
    this.profileService.updateProfile(this.profile).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.isEditing = false;
        this.isLoading = false;
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.snackBar.open('Failed to update profile', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  get currentUser(): any {
    return this.authService.currentUserValue;
  }

  get initials(): string {
    return ImageUtils.getInitials(this.profile?.firstName, this.profile?.lastName);
  }

  getDefaultProfilePicture(): string {
    if (!this.profile) return 'https://via.placeholder.com/150';
    return ImageUtils.getDefaultProfilePicture(this.profile.username);
  }

  onImageError(event: any): void {
    ImageUtils.onProfileImageError(event, this.profile?.username || 'User');
  }
}
