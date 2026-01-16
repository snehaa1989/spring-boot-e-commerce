export class ImageUtils {
  
  static getDefaultProductImage(productName: string): string {
    // Generate placeholder images based on product name
    const seed = productName.toLowerCase().replace(/\s+/g, '-');
    return `https://picsum.photos/seed/${seed}/300/200.jpg`;
  }

  static getDefaultProfilePicture(username: string): string {
    return `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=200`;
  }

  static onProductImageError(event: any): void {
    event.target.src = 'https://picsum.photos/seed/placeholder/300/200.jpg';
  }

  static onProfileImageError(event: any, username: string): void {
    event.target.src = this.getDefaultProfilePicture(username);
  }

  static getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }
}
