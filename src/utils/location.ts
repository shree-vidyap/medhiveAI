// Geolocation & Distance Calculation Utilities

export interface Coordinates {
  lat: number;
  lng: number;
}

// Default fallback location: Mandya District, Karnataka, India
export const DEFAULT_RURAL_LOCATION: Coordinates = {
  lat: 12.5218,
  lng: 76.8951,
};

/**
 * Calculates Haversine geodesic distance between two lat/lng coordinates in kilometers.
 */
export function calculateHaversineDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  return Math.round(distanceKm * 10) / 10; // 1 decimal place
}

/**
 * Estimate travel time in minutes based on distance and average rural road speed (~35 km/h)
 */
export function estimateTravelTimeMinutes(distanceKm: number): number {
  const avgSpeedKmH = 35;
  const timeHours = distanceKm / avgSpeedKmH;
  const timeMinutes = Math.round(timeHours * 60);
  return Math.max(5, timeMinutes); // Minimum 5 mins
}

/**
 * Get user's current position using browser Geolocation API
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}
