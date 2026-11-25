import clsx, { ClassValue } from 'clsx';

export const cn = (...i: ClassValue[]) => clsx(i);
export const fmtDate = (s: string) => new Date(s).toLocaleString();
