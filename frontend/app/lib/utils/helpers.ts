export function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const mapUsageToProgress = (usage: number, maxLimit: number=5): number => {
  // 1. Handle edge case: If maxLimit is 0 (or negative), return 0 to prevent division by zero.
  if (maxLimit <= 0) {
    return 0;
  }

  // 2. Calculate the percentage
  const percentage = (usage / maxLimit) * 100;

  // 3. Clamp the value between 0 and 100.
  // - Math.max(0, ...): Ensures the value is never negative.
  // - Math.min(100, ...): Ensures the value never exceeds 100.
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return clampedPercentage;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // Jan, Feb, Mar...
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}


