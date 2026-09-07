export function getKSTDate(date?: Date | string | null): Date {
  const d = date ? new Date(date) : new Date();
  // Get time in UTC
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  // KST is UTC + 9
  return new Date(utc + (9 * 60 * 60 * 1000));
}

export function calculatePregnancyWeek(currentDate: Date, dueDate: Date): number {
  // Due date is 40 weeks (280 days) from the start of pregnancy
  const msPerDay = 1000 * 60 * 60 * 24;
  const startOfPregnancy = new Date(dueDate.getTime() - (280 * msPerDay));
  
  const diffTime = currentDate.getTime() - startOfPregnancy.getTime();
  const diffDays = Math.floor(diffTime / msPerDay);
  
  if (diffDays < 0) return 0; // Before pregnancy starts
  if (diffDays > 308) return 44; // Post due date capped at 44 (1 month after birth)
  
  const weeks = Math.floor(diffDays / 7);
  return weeks === 0 ? 1 : weeks; // Return 1 for the first week
}

export function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
