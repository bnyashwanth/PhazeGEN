export function getGCColor(value: number): string {
  if (value > 60) return "#d73027";   // high GC
  if (value > 50) return "#fc8d59";
  if (value > 40) return "#fee08b";
  return "#91bfdb";                  // low GC
}

export function getResistanceColor(value: number): string {
  if (value > 0.75) return "#7f0000"; // strong resistance
  if (value > 0.5) return "#b30000";
  if (value > 0.25) return "#e34a33";
  return "#fdbb84";                  // weak / none
}
