import { AbstractControl } from '@angular/forms';

export default function DuplicatedAmountCalcValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  if (!control.value) return null;

  const checkNetAmount = control.get('netAmount')?.value > 0;
  const checkGrossAmount = control.get('grossAmount')?.value > 0;
  const checkVatAmount = control.get('vatAmount')?.value > 0;

  return (checkNetAmount && (checkGrossAmount || checkVatAmount)) ||
    (checkGrossAmount && (checkNetAmount || checkVatAmount)) ||
    (checkVatAmount && (checkNetAmount || checkGrossAmount))
    ? { valueDuplicated: true }
    : null;
}
