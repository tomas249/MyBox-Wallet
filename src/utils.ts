export function generateId() {
  return String(Date.now() + Math.floor(Math.random() * 100));
}

export function calc(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
