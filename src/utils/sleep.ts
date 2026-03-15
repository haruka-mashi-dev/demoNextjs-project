export const calcSleepMinutes = (start: string, end: string) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startTotal = sh * 60 + sm;
  let endTotal = eh * 60 + em;

  if (endTotal < startTotal) {
    endTotal += 24 * 60;
  }

  return endTotal - startTotal;
};

export const formatMinutes = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${hour}時間${minute}分`;
};

