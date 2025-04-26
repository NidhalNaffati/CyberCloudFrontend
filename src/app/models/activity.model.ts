// src/app/models/activity.model.ts
export interface Activity {
  activityId: number;
  name: string;
  details: string;
  location: string;
  availableSeats: number;
  date: string;  // Original date from API
  price: number;
  imagePath?: string;
  image?: string;  // Transformed image URL
  formattedDate?: string;  // Add this line for the formatted date
}
