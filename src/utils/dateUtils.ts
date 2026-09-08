export function getKSTDate(date?: Date | string | null): Date {
  // 인자가 있으면 해당 날짜 반환, 없으면 현재 시간 반환
  return date ? new Date(date) : new Date();
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
  // toISOString()은 항상 UTC 기준이므로 한국(KST)에서는 오전 9시 전까지 하루 전날로 표기되는 버그 발생.
  // Intl.DateTimeFormat을 사용하여 명시적으로 Asia/Seoul 타임존의 YYYY-MM-DD 형식을 가져옴 (sv-SE locale이 YYYY-MM-DD 포맷임)
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}
