export function getDueTimestamp(date, time) {
  // 日付が無い場合は締め切りを計算できないためnullを返す
  if (!date) return null;
  // 時刻が未入力なら00:00として扱う
  const safeTime = time && typeof time === 'string' && time.length > 0 ? time : '00:00';
  const timestamp = new Date(`${date}T${safeTime}`);
  const value = timestamp.getTime();
  // 不正な日付はNaNになるのでnullに置き換える
  return Number.isNaN(value) ? null : value;
}

export function formatDateForDisplay(date) {
  // YYYY-MM-DD形式を日本語表示用にYYYY/MM/DDへ変換する
  if (!date) return '';
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) {
    return date;
  }
  return `${year}/${month}/${day}`;
}

export function formatTimeForDisplay(time) {
  // 24時間表記HH:MM:ssの先頭5文字を切り出してHH:MMにする
  if (!time) return '';
  return time.slice(0, 5);
}
