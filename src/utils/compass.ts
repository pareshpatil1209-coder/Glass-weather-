export function getCompassDirection(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 
    'E', 'ESE', 'SE', 'SSE', 
    'S', 'SSW', 'SW', 'WSW', 
    'W', 'WNW', 'NW', 'NNW'
  ];
  const normalized = (degrees % 360 + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}
