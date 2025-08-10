import type { FormSchema } from '../types/form';
const STORAGE_KEY = 'rfb_forms_v1';

export const loadForms = (): FormSchema[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as FormSchema[] : [];
  } catch (e) {
    console.error('loadForms error', e);
    return [];
  }
};

export const saveForms = (forms: FormSchema[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (e) {
    console.error('saveForms error', e);
  }
};
