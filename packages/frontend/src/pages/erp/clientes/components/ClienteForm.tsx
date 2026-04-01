import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, MapPin } from 'lucide-react';
import { clientesService, type Cliente, type CreateClienteInput } from '../../../../services/clientes.service';
import { useToast } from '../../../../contexts/ToastContext';
import {
  formatCpfCnpj,
  formatPhone,
  formatCep,
  validateCpfCnpj,
  cleanDocument,
} from '../../../../utils/cpfCnpj';
import { buscarCep } from '../../../../utils/viaCep';
import './ClienteForm.css';

// ─── UFs brasileiras ────────────────────────────────────────────────────────
const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

// ─── Tipos ──────────────────────────────────────────────────────────────────
type TipoCliente = 'FISICA' | 'JURIDICA';

interface FormData {
  tipo: TipoCliente;
  nome: string;
  cpfCnpj: string;          // valor formatado para exibição
  email: string;
  telefone: string;
  celular: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  observacoes: string;
}

interface FormErrors {
  nome?: string;
  cpfCnpj?: string;
  email?: string;
  cep?: string;
  estado?: string;
}

interface Props {
  clienteId?: string;
  initialData?: Cliente | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EMPTY_FORM: FormData = {
  tipo: 'FISICA',
  nome: '',
  cpfCnpj: '',
  email: '',
  telefone: '',
  celular: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  nomeFantasia: '',
  inscricaoEstadual: '',
  observacoes: '',
};

// ─── Componente ─────────────────────────────────────────────────────────────
export const ClienteForm = ({ clienteId, initialData, onSuccess, onCancel }: Props) => {
  const { toast } = useToast();
  const isEdit = !!clienteId;

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [buscandoCep, setBuscandoCep] = useState(false);

  // ── Pré-popula em modo edição (usa initialData se disponível, senão busca) ──
  const { data: clienteData } = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: () => clientesService.getById(clienteId!),
    enabled: isEdit && !initialData,
  });

  useEffect(() => {
    const source = initialData ?? (clienteData as unknown as Cliente);
    if (!source) return;
    setForm({
      tipo: source.tipo ?? 'FISICA',
      nome: source.nome ?? '',
      cpfCnpj: formatCpfCnpj(source.cpfCnpj ?? ''),
      email: source.email ?? '',
      telefone: formatPhone(source.telefone ?? ''),
      celular: formatPhone(source.celular ?? ''),
      cep: formatCep(source.cep ?? ''),
      endereco: source.endereco ?? '',
      numero: source.numero ?? '',
      complemento: source.complemento ?? '',
      bairro: source.bairro ?? '',
      cidade: source.cidade ?? '',
      estado: source.estado ?? '',
      nomeFantasia: source.nomeFantasia ?? '',
      inscricaoEstadual: source.inscricaoEstadual ?? '',
      observacoes: source.observacoes ?? '',
    });
    setErrors({});
  }, [initialData, clienteData]);

  // ── Quando tipo muda, limpa CPF/CNPJ para evitar formato errado ──
  const handleTipoChange = (novoTipo: TipoCliente) => {
    setForm((f) => ({ ...f, tipo: novoTipo, cpfCnpj: '' }));
    setErrors((e) => ({ ...e, cpfCnpj: undefined }));
  };

  // ── Handler de campo genérico ──────────────────────────────────────────────
  const setField = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  // ── CPF/CNPJ: aplica máscara em tempo real ────────────────────────────────
  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCpfCnpj(e.target.value);
    setField('cpfCnpj', masked);
  };

  const handleCpfCnpjBlur = () => {
    const result = validateCpfCnpj(form.cpfCnpj);
    if (!result.valid && form.cpfCnpj) {
      setErrors((e) => ({ ...e, cpfCnpj: result.message }));
    }
  };

  // ── CEP: máscara + busca automática ao completar 8 dígitos ───────────────
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCep(e.target.value);
    setField('cep', masked);

    const digits = masked.replace(/\D/g, '');
    if (digits.length === 8) {
      setBuscandoCep(true);
      try {
        const endereco = await buscarCep(digits);
        setForm((f) => ({
          ...f,
          cep: masked,
          endereco: endereco.endereco,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
        }));
        setErrors((e) => ({ ...e, cep: undefined }));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'CEP não encontrado';
        setErrors((e) => ({ ...e, cep: msg }));
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  // ── Validação antes do submit ──────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.nome.trim()) newErrors.nome = 'Nome é obrigatório';

    const docResult = validateCpfCnpj(form.cpfCnpj);
    if (!docResult.valid) newErrors.cpfCnpj = docResult.message;

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (form.estado && form.estado.length !== 2) {
      newErrors.estado = 'Selecione um estado válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: CreateClienteInput) => clientesService.create(data),
    onSuccess: () => {
      toast('Cliente cadastrado com sucesso!', 'success');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao cadastrar cliente';
      toast(msg, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateClienteInput) => clientesService.update(clienteId!, data),
    onSuccess: () => {
      toast('Cliente atualizado com sucesso!', 'success');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Erro ao atualizar cliente';
      toast(msg, 'error');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateClienteInput = {
      tipo: form.tipo,
      nome: form.nome.trim(),
      cpfCnpj: cleanDocument(form.cpfCnpj),
      email: form.email.trim() || undefined,
      telefone: form.telefone.replace(/\D/g, '') || undefined,
      celular: form.celular.replace(/\D/g, '') || undefined,
      cep: form.cep.replace(/\D/g, '') || undefined,
      endereco: form.endereco.trim() || undefined,
      numero: form.numero.trim() || undefined,
      complemento: form.complemento.trim() || undefined,
      bairro: form.bairro.trim() || undefined,
      cidade: form.cidade.trim() || undefined,
      estado: form.estado || undefined,
      nomeFantasia: form.nomeFantasia.trim() || undefined,
      inscricaoEstadual: form.inscricaoEstadual.trim() || undefined,
      observacoes: form.observacoes.trim() || undefined,
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPJ = form.tipo === 'JURIDICA';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form className="cliente-form" onSubmit={handleSubmit} noValidate>

      {/* ── Seção 1: Identificação ── */}
      <fieldset className="cf-fieldset">
        <legend className="cf-legend">Identificação</legend>

        {/* Tipo */}
        <div className="cf-tipo-group">
          <label className="cf-tipo-label">Tipo de Pessoa</label>
          <div className="cf-tipo-options">
            <button
              type="button"
              className={`cf-tipo-btn ${form.tipo === 'FISICA' ? 'active' : ''}`}
              onClick={() => handleTipoChange('FISICA')}
            >
              Pessoa Física
            </button>
            <button
              type="button"
              className={`cf-tipo-btn ${form.tipo === 'JURIDICA' ? 'active' : ''}`}
              onClick={() => handleTipoChange('JURIDICA')}
            >
              Pessoa Jurídica
            </button>
          </div>
        </div>

        <div className="cf-row cf-row-2">
          {/* Nome / Razão Social */}
          <div className={`cf-field ${isPJ ? '' : 'cf-col-full'}`}>
            <label className="cf-label" htmlFor="cf-nome">
              {isPJ ? 'Razão Social' : 'Nome Completo'} <span className="cf-required">*</span>
            </label>
            <input
              id="cf-nome"
              type="text"
              value={form.nome}
              onChange={(e) => setField('nome', e.target.value)}
              className={`cf-input ${errors.nome ? 'cf-input-error' : ''}`}
              placeholder={isPJ ? 'Razão Social da empresa' : 'Nome completo do cliente'}
            />
            {errors.nome && <span className="cf-error-msg">{errors.nome}</span>}
          </div>

          {/* Nome Fantasia — só PJ */}
          {isPJ && (
            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-nome-fantasia">Nome Fantasia</label>
              <input
                id="cf-nome-fantasia"
                type="text"
                value={form.nomeFantasia}
                onChange={(e) => setField('nomeFantasia', e.target.value)}
                className="cf-input"
                placeholder="Nome fantasia (opcional)"
              />
            </div>
          )}
        </div>

        <div className="cf-row cf-row-2">
          {/* CPF / CNPJ */}
          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-cpf-cnpj">
              {isPJ ? 'CNPJ' : 'CPF'} <span className="cf-required">*</span>
            </label>
            <input
              id="cf-cpf-cnpj"
              type="text"
              value={form.cpfCnpj}
              onChange={handleCpfCnpjChange}
              onBlur={handleCpfCnpjBlur}
              className={`cf-input ${errors.cpfCnpj ? 'cf-input-error' : ''}`}
              placeholder={isPJ ? '00.000.000/0000-00' : '000.000.000-00'}
              maxLength={isPJ ? 18 : 14}
              inputMode="numeric"
            />
            {errors.cpfCnpj && <span className="cf-error-msg">{errors.cpfCnpj}</span>}
          </div>

          {/* Inscrição Estadual — só PJ */}
          {isPJ && (
            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-ie">Inscrição Estadual</label>
              <input
                id="cf-ie"
                type="text"
                value={form.inscricaoEstadual}
                onChange={(e) => setField('inscricaoEstadual', e.target.value)}
                className="cf-input"
                placeholder="Inscrição Estadual ou ISENTO"
              />
            </div>
          )}
        </div>
      </fieldset>

      {/* ── Seção 2: Contato ── */}
      <fieldset className="cf-fieldset">
        <legend className="cf-legend">Contato</legend>
        <div className="cf-row cf-row-3">
          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-email">E-mail</label>
            <input
              id="cf-email"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              className={`cf-input ${errors.email ? 'cf-input-error' : ''}`}
              placeholder="email@exemplo.com"
            />
            {errors.email && <span className="cf-error-msg">{errors.email}</span>}
          </div>

          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-telefone">Telefone</label>
            <input
              id="cf-telefone"
              type="tel"
              value={form.telefone}
              onChange={(e) => setField('telefone', formatPhone(e.target.value))}
              className="cf-input"
              placeholder="(00) 0000-0000"
              maxLength={14}
              inputMode="numeric"
            />
          </div>

          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-celular">Celular / WhatsApp</label>
            <input
              id="cf-celular"
              type="tel"
              value={form.celular}
              onChange={(e) => setField('celular', formatPhone(e.target.value))}
              className="cf-input"
              placeholder="(00) 00000-0000"
              maxLength={15}
              inputMode="numeric"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Seção 3: Endereço ── */}
      <fieldset className="cf-fieldset">
        <legend className="cf-legend">
          Endereço
          {buscandoCep && (
            <span className="cf-cep-loading">
              <Loader2 size={13} className="cf-spin" /> Buscando CEP...
            </span>
          )}
        </legend>

        <div className="cf-row cf-row-2">
          {/* CEP */}
          <div className="cf-field cf-cep-field">
            <label className="cf-label" htmlFor="cf-cep">
              CEP
              <span className="cf-cep-hint">
                <MapPin size={12} /> preenchimento automático
              </span>
            </label>
            <input
              id="cf-cep"
              type="text"
              value={form.cep}
              onChange={handleCepChange}
              className={`cf-input ${errors.cep ? 'cf-input-error' : ''}`}
              placeholder="00000-000"
              maxLength={9}
              inputMode="numeric"
              disabled={buscandoCep}
            />
            {errors.cep && <span className="cf-error-msg">{errors.cep}</span>}
          </div>

          {/* Estado */}
          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-estado">Estado</label>
            <select
              id="cf-estado"
              value={form.estado}
              onChange={(e) => setField('estado', e.target.value)}
              className="cf-input cf-select"
            >
              <option value="">Selecione...</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            {errors.estado && <span className="cf-error-msg">{errors.estado}</span>}
          </div>
        </div>

        <div className="cf-row cf-row-3">
          <div className="cf-field cf-col-2">
            <label className="cf-label" htmlFor="cf-endereco">Endereço</label>
            <input
              id="cf-endereco"
              type="text"
              value={form.endereco}
              onChange={(e) => setField('endereco', e.target.value)}
              className="cf-input"
              placeholder="Rua, Av., etc."
            />
          </div>
          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-numero">Número</label>
            <input
              id="cf-numero"
              type="text"
              value={form.numero}
              onChange={(e) => setField('numero', e.target.value)}
              className="cf-input"
              placeholder="Nº"
            />
          </div>
        </div>

        <div className="cf-row cf-row-3">
          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-complemento">Complemento</label>
            <input
              id="cf-complemento"
              type="text"
              value={form.complemento}
              onChange={(e) => setField('complemento', e.target.value)}
              className="cf-input"
              placeholder="Apto, Sala, etc."
            />
          </div>
          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-bairro">Bairro</label>
            <input
              id="cf-bairro"
              type="text"
              value={form.bairro}
              onChange={(e) => setField('bairro', e.target.value)}
              className="cf-input"
              placeholder="Bairro"
            />
          </div>
          <div className="cf-field">
            <label className="cf-label" htmlFor="cf-cidade">Cidade</label>
            <input
              id="cf-cidade"
              type="text"
              value={form.cidade}
              onChange={(e) => setField('cidade', e.target.value)}
              className="cf-input"
              placeholder="Cidade"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Seção 4: Observações ── */}
      <fieldset className="cf-fieldset">
        <legend className="cf-legend">Observações</legend>
        <textarea
          id="cf-observacoes"
          value={form.observacoes}
          onChange={(e) => setField('observacoes', e.target.value)}
          className="cf-input cf-textarea"
          placeholder="Informações adicionais sobre o cliente..."
          rows={3}
        />
      </fieldset>

      {/* ── Ações ── */}
      <div className="cf-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending && <Loader2 size={16} className="cf-spin" />}
          {isPending ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </button>
      </div>
    </form>
  );
};
