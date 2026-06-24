export function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getKoreanDateTime(isoString: string): string {
  const date = new Date(isoString);

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}