const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
});

export const formatDate = (date: Date | string | number, format: string = 'd.m.Y H:i:s') => {
  const dt = (date instanceof Date) ? date : new Date(date);

  return format
    .replace('d', dt.getDate().toString().padStart(2, '0'))
    .replace('m', (dt.getMonth() + 1).toString().padStart(2, '0'))
    .replace('M', (monthFormatter.format(dt).toString()))
    .replace('Y', dt.getFullYear().toString())
    .replace('H', dt.getHours().toString().padStart(2, '0'))
    .replace('i', dt.getMinutes().toString().padStart(2, '0'))
    .replace('s', dt.getSeconds().toString().padStart(2, '0'));
};
