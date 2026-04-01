/// <reference types="vitest/importMeta" />

// ─────────────────────────────────────────────────────────────────────────────
// Limpeza — mantém apenas dígitos
// ─────────────────────────────────────────────────────────────────────────────
export function cleanDocument(value: string): string {
  return value.replace(/\D/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Máscara visual em tempo real
// ─────────────────────────────────────────────────────────────────────────────
export function formatCpfCnpj(value: string): string {
  const digits = cleanDocument(value).slice(0, 14);
  if (digits.length <= 11) {
    // CPF: 000.000.000-00
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  // CNPJ: 00.000.000/0000-00
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

// ─────────────────────────────────────────────────────────────────────────────
// Validação de CPF — algoritmo mod-11
// ─────────────────────────────────────────────────────────────────────────────
function validateCpf(cpf: string): boolean {
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // rejeita 111.111.111-11 etc.

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

// ─────────────────────────────────────────────────────────────────────────────
// Validação de CNPJ — pesos [5,4,3,2,9,8,7,6,5,4,3,2] e versão deslocada
// ─────────────────────────────────────────────────────────────────────────────
function validateCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false; // rejeita 11.111.111/1111-11 etc.

  const calc = (weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) sum += parseInt(cnpj[i]) * weights[i];
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  };

  const d1 = calc([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d1 !== parseInt(cnpj[12])) return false;

  const d2 = calc([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d2 === parseInt(cnpj[13]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Validação unificada — retorna resultado tipado
// ─────────────────────────────────────────────────────────────────────────────
export type DocumentValidation = {
  valid: boolean;
  tipo: 'CPF' | 'CNPJ' | null;
  message: string;
};

export function validateCpfCnpj(value: string): DocumentValidation {
  const digits = cleanDocument(value);

  if (digits.length === 0) {
    return { valid: false, tipo: null, message: 'CPF ou CNPJ é obrigatório' };
  }

  if (digits.length === 11) {
    const valid = validateCpf(digits);
    return {
      valid,
      tipo: 'CPF',
      message: valid ? '' : 'CPF inválido (verifique os dígitos verificadores)',
    };
  }

  if (digits.length === 14) {
    const valid = validateCnpj(digits);
    return {
      valid,
      tipo: 'CNPJ',
      message: valid ? '' : 'CNPJ inválido (verifique os dígitos verificadores)',
    };
  }

  return {
    valid: false,
    tipo: null,
    message: `Documento incompleto (${digits.length} de 11 ou 14 dígitos)`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Máscara de telefone — (00) 00000-0000 ou (00) 0000-0000
// ─────────────────────────────────────────────────────────────────────────────
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

// ─────────────────────────────────────────────────────────────────────────────
// Máscara de CEP — 00000-000
// ─────────────────────────────────────────────────────────────────────────────
export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

// ─────────────────────────────────────────────────────────────────────────────
// Testes Unitários Inline (Vitest)
// ─────────────────────────────────────────────────────────────────────────────
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('Document Validation', () => {
    it('deve formatar CPF corretamente', () => {
      expect(formatCpfCnpj('12345678909')).toBe('123.456.789-09');
    });

    it('deve formatar CNPJ corretamente', () => {
      expect(formatCpfCnpj('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('deve invalidar CPF com dígitos repetidos', () => {
      const res = validateCpfCnpj('111.111.111-11');
      expect(res.valid).toBe(false);
      expect(res.message).toContain('inválido');
    });

    it('deve invalidar CPF com dígito verificador errado', () => {
      const res = validateCpfCnpj('12345678900');
      expect(res.valid).toBe(false);
    });

    it('deve validar CPF correto (mock mod-11)', () => {
      // 52998224725 é um CPF matemático válido gerado para testes
      const res = validateCpfCnpj('52998224725');
      expect(res.valid).toBe(true);
      expect(res.tipo).toBe('CPF');
    });

    it('deve validar CNPJ correto', () => {
      // CNPJ da Receita Federal
      const res = validateCpfCnpj('00.000.000/0000-00');
      expect(res.valid).toBe(false); // Receita não passa no mod-11 normal de teste sem ser exato, testado embaixo

      const res2 = validateCpfCnpj('11222333000181'); 
      expect(res2.valid).toBe(true);
      expect(res2.tipo).toBe('CNPJ');
    });

    it('deve formatar telefone', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
      expect(formatPhone('1187654321')).toBe('(11) 8765-4321');
    });

    it('deve formatar CEP', () => {
      expect(formatCep('12345678')).toBe('12345-678');
    });
  });
}

