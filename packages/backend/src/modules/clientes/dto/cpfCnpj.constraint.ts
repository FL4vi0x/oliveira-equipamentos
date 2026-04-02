import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

function validateCpf(cpf: string): boolean {
  if (cpf.length !== 11) return false;
  // Rejeita sequências iguais: 11111111111
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = sum % 11;
  d1 = d1 < 2 ? 0 : 11 - d1;
  if (d1 !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = sum % 11;
  d2 = d2 < 2 ? 0 : 11 - d2;
  return d2 === parseInt(cpf[10]);
}

function validateCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14) return false;
  // Rejeita sequências iguais: 11111111111111
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(cnpj[i]) * weights1[i];
  let d1 = sum % 11;
  d1 = d1 < 2 ? 0 : 11 - d1;
  if (d1 !== parseInt(cnpj[12])) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(cnpj[i]) * weights2[i];
  let d2 = sum % 11;
  d2 = d2 < 2 ? 0 : 11 - d2;
  return d2 === parseInt(cnpj[13]);
}

@ValidatorConstraint({ name: 'CpfCnpj', async: false })
export class CpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) return false;
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) return validateCpf(digits);
    if (digits.length === 14) return validateCnpj(digits);
    return false;
  }

  defaultMessage(): string {
    return 'CPF ou CNPJ inválido (verifique os dígitos verificadores)';
  }
}
