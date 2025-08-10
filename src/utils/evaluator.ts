import dayjs from 'dayjs';

/**
 * Evaluate derived expression with allowed operations only.
 * - ageFromDOB: expects first parent to be a date string (YYYY-MM-DD)
 * - sum: sums numeric parent values
 * - concat: concatenates parent values with space
 *
 * Returns string | number | null
 */
export function evalDerived(expressionName: string | undefined, parentValues: any[]): any {
  if (!expressionName) return null;

  switch (expressionName) {
    case 'ageFromDOB': {
      const dob = parentValues[0];
      if (!dob) return '';
      const d = dayjs(dob);
      if (!d.isValid()) return '';
      return dayjs().diff(d, 'year');
    }
    case 'sum': {
      let total = 0;
      for (const p of parentValues) {
        const n = Number(p);
        if (!isNaN(n)) total += n;
      }
      return total;
    }
    case 'concat': {
      return parentValues.map(p => (p ?? '')).join(' ');
    }
    default:
      return '';
  }
}
