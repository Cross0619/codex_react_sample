export function getDueTimestamp(date, time) {
  if (!date) return null;
  const safeTime = time && typeof time === 'string' && time.length > 0 ? time : '00:00';
  const timestamp = new Date(`${date}T${safeTime}`);
  const value = timestamp.getTime();
  return Number.isNaN(value) ? null : value;
}

export function formatDateForDisplay(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) {
    return date;
  }
  return `${year}/${month}/${day}`;
}

export function formatTimeForDisplay(time) {
  if (!time) return '';
  return time.slice(0, 5);
}
