<<<<<<< HEAD
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
=======
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
