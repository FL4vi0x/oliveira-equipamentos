# Design System 
**Sistema ERP Oliveira Equipamentos**

O Design System da Oliveira Equipamentos foi desenhado para ser uma arquitetura extensível, madura e consistente baseada na linguagem premium aprovada no Desktop (Dashboard e PDV). Ele prioriza clareza, alta usabilidade para fluxos de ERP e um visual limpo sem perder o caráter moderno (Dark Mode-friendly no futuro, se necessário).

---

## 1. Princípios Visuais
- **Fidelidade e Retenção:** Nossas composições sempre operam baseadas no *layout* em Grid. O foco é a informação de negócio.
- **Hierarquia:** Ação principal (Primary) é destacada. Ações destrutivas (Danger) seguem padrão vermelho.
- **Micro-interações:** Toda superfície (Card/Input/Button) possui um estado de *hover* e *focus*, ajudando na navegação via teclado muito comum em ERPs Desktop.

---

## 2. Design Tokens

O sistema possui uma gama de CSS Custom Properties (`var(--...)`) localizadas no arquivo global `src/design-system/tokens.css`. Elas devem ser usadas **obrigatoriamente** sempre que houver necessidade de aplicar cores, bordas e espaçamentos.

### ✅ Cores Principais
| Prefixo             | CSS Variable Exemple       | Uso Comum |
|---------------------|----------------------------|------------|
| **Brand (Azul)**    | `var(--color-primary-500)` | Botões primários, badges de informação, foco. |
| **Neutral (Slate)** | `var(--color-neutral-900)` | Textos principais, background de Sidebar. |
| **Success (Verde)** | `var(--color-success-500)` | Botões de confirmar pagamento, badges de ok. |
| **Danger (Vermelho)** | `var(--color-danger-500)` | Exclusão, badges críticos, alertas de estoque faltante. |

### ✅ Superfícies (Alias)
- `var(--bg-app)`: Cor de fundo principal onde os cartões habitam (`#f8fafc`).
- `var(--bg-surface)`: Fundo branco dos cards/painéis (`#ffffff`).
- `var(--bg-sidebar)`: Cor sólida da Sidebar escura (`#0f172a`).

### ✅ Tipografia e Espaçamentos
- Espaçamento escala de 4px: `var(--space-1)` = 4px, `var(--space-2)` = 8px ... `var(--space-8)` = 32px.
- Bordas: `var(--radius-md)` = 8px para a maioria dos inputs/botões. `var(--radius-lg)` = 12px para Cards.

---

## 3. Componentes UI (Primitives)

Localizados em `src/components/ui/`. Devem ser preferidos frente à tags HTML puras.

### 🔘 Button 
Oferece as variantes: `primary`, `secondary`, `ghost`, `danger`, `success`. 
```tsx
import { Button } from '@/components/ui/Button';

// Action Principal
<Button variant="primary" size="lg">Finalizar Venda</Button>
// Cancelar
<Button variant="danger" size="md">Cancelar</Button>
```

### ⌨️ Input
Componente base para campos de texto, preparado com estados de validação (`error`), e suporte a ícones nas laterais (para `Search` por exemplo).

```tsx
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

<Input 
  placeholder="Buscar produto..." 
  iconLeft={<Search size={18} />} 
  error={false}
  helperText="Pressione ENTER para buscar"
/>
```

### 🏷️ Badge
Pílulas de Status/Marcação. Variantes: `default`, `success`, `warning`, `critical`.
```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="warning">Atenção</Badge>
```

### 🗂️ Card
Container padrão contendo o Box-Shadow suave e bordas arredondadas validadas no layout Premium.

---

## 4. Padrões de Layout a Seguir
1. **Sidebar Mestre**: Escura, sempre agrupa navegação por módulos (Gestão, PDV). 
2. **Dashboard Grid Layout**: Estruturado em css-grid para permitir adaptação. `StatCard` no topo, divisões de 70/30 (SalesOverview e QuickActions).
3. **Frente de Caixa (PDV)**: Tela 100% de preenchimento (`100vh`), layout "Operacional". Painéis fixos laterais, lista infinita scrolável na esquerda.

## 5. Próximos Passos (Guia para o desenvolvedor)
Aos construir novas telas (Ex: Tabela de Clientes, Criação de Produto), crie novos subcomponentes reutilizando `Card`, `Input` e `Button`. Evite adicionar `#hex` ou `sizes` inline no código que já não sejam abstraídos pelos tokens.
