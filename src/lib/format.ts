/** "+4" / "−1" — uses a true minus sign because hyphens are for amateurs. */
export function signed(n: number): string {
  return n < 0 ? `−${Math.abs(n)}` : `+${n}`;
}

export function comma(n: number): string {
  return n.toLocaleString("en-US");
}
