
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.1.0
 * Query Engine version: 11f085a2012c0f4778414c8db2651556ee0ef959
 */
Prisma.prismaVersion = {
  client: "6.1.0",
  engine: "11f085a2012c0f4778414c8db2651556ee0ef959"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CategoriaScalarFieldEnum = {
  id: 'id',
  nome: 'nome'
};

exports.Prisma.ProdutoScalarFieldEnum = {
  id: 'id',
  codigoInterno: 'codigoInterno',
  codigoBarras: 'codigoBarras',
  nome: 'nome',
  descricao: 'descricao',
  categoriaId: 'categoriaId',
  unidadeMedida: 'unidadeMedida',
  precoCompra: 'precoCompra',
  precoVenda: 'precoVenda',
  margemLucro: 'margemLucro',
  estoqueAtual: 'estoqueAtual',
  estoqueMinimo: 'estoqueMinimo',
  estoqueMaximo: 'estoqueMaximo',
  ativo: 'ativo',
  ncm: 'ncm',
  cest: 'cest',
  observacoes: 'observacoes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MovimentacaoEstoqueScalarFieldEnum = {
  id: 'id',
  produtoId: 'produtoId',
  tipo: 'tipo',
  quantidade: 'quantidade',
  motivo: 'motivo',
  usuarioId: 'usuarioId',
  createdAt: 'createdAt'
};

exports.Prisma.ClienteScalarFieldEnum = {
  id: 'id',
  tipo: 'tipo',
  nome: 'nome',
  cpfCnpj: 'cpfCnpj',
  email: 'email',
  telefone: 'telefone',
  celular: 'celular',
  endereco: 'endereco',
  numero: 'numero',
  complemento: 'complemento',
  bairro: 'bairro',
  cidade: 'cidade',
  estado: 'estado',
  cep: 'cep',
  observacoes: 'observacoes',
  ativo: 'ativo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendaScalarFieldEnum = {
  id: 'id',
  numero: 'numero',
  clienteId: 'clienteId',
  usuarioId: 'usuarioId',
  dataVenda: 'dataVenda',
  subtotal: 'subtotal',
  desconto: 'desconto',
  total: 'total',
  formaPagamento: 'formaPagamento',
  status: 'status',
  observacoes: 'observacoes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ItemVendaScalarFieldEnum = {
  id: 'id',
  vendaId: 'vendaId',
  produtoId: 'produtoId',
  quantidade: 'quantidade',
  precoUnitario: 'precoUnitario',
  subtotal: 'subtotal',
  desconto: 'desconto',
  total: 'total'
};

exports.Prisma.UsuarioScalarFieldEnum = {
  id: 'id',
  nome: 'nome',
  email: 'email',
  senha: 'senha',
  perfil: 'perfil',
  ativo: 'ativo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.TipoMovimentacao = exports.$Enums.TipoMovimentacao = {
  ENTRADA: 'ENTRADA',
  SAIDA: 'SAIDA',
  AJUSTE: 'AJUSTE',
  VENDA: 'VENDA',
  DEVOLUCAO: 'DEVOLUCAO'
};

exports.TipoCliente = exports.$Enums.TipoCliente = {
  FISICA: 'FISICA',
  JURIDICA: 'JURIDICA'
};

exports.FormaPagamento = exports.$Enums.FormaPagamento = {
  DINHEIRO: 'DINHEIRO',
  CARTAO_CREDITO: 'CARTAO_CREDITO',
  CARTAO_DEBITO: 'CARTAO_DEBITO',
  PIX: 'PIX',
  BOLETO: 'BOLETO',
  TRANSFERENCIA: 'TRANSFERENCIA',
  CHEQUE: 'CHEQUE',
  OUTROS: 'OUTROS'
};

exports.StatusVenda = exports.$Enums.StatusVenda = {
  PENDENTE: 'PENDENTE',
  CONCLUIDA: 'CONCLUIDA',
  CANCELADA: 'CANCELADA'
};

exports.PerfilUsuario = exports.$Enums.PerfilUsuario = {
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE',
  VENDEDOR: 'VENDEDOR',
  ESTOQUISTA: 'ESTOQUISTA'
};

exports.Prisma.ModelName = {
  Categoria: 'Categoria',
  Produto: 'Produto',
  MovimentacaoEstoque: 'MovimentacaoEstoque',
  Cliente: 'Cliente',
  Venda: 'Venda',
  ItemVenda: 'ItemVenda',
  Usuario: 'Usuario'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\Flávio\\Desktop\\oliveira-equipamentos\\packages\\backend\\src\\@generated\\prisma-client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\Flávio\\Desktop\\oliveira-equipamentos\\packages\\backend\\src\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../prisma",
  "clientVersion": "6.1.0",
  "engineVersion": "11f085a2012c0f4778414c8db2651556ee0ef959",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": null,
        "value": "postgresql://oliveira:oliveira123@localhost:5432/oliveira_erp?schema=public"
      }
    }
  },
  "inlineSchema": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"../@generated/prisma-client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = \"postgresql://oliveira:oliveira123@localhost:5432/oliveira_erp?schema=public\"\n}\n\n//\n// ==================== CATEGORIAS ====================\n//\nmodel Categoria {\n  id       String    @id @default(uuid())\n  nome     String    @unique\n  produtos Produto[]\n\n  @@map(\"categorias\")\n}\n\n//\n// ==================== PRODUTOS ====================\n//\nmodel Produto {\n  id            String  @id @default(uuid())\n  codigoInterno String  @unique @map(\"codigo_interno\")\n  codigoBarras  String? @unique @map(\"codigo_barras\")\n  nome          String\n  descricao     String?\n\n  categoriaId String    @map(\"categoria_id\")\n  categoria   Categoria @relation(fields: [categoriaId], references: [id])\n\n  unidadeMedida String  @map(\"unidade_medida\") // UN, KG, CX, etc\n  precoCompra   Decimal @map(\"preco_compra\") @db.Decimal(10, 2)\n  precoVenda    Decimal @map(\"preco_venda\") @db.Decimal(10, 2)\n  margemLucro   Decimal @map(\"margem_lucro\") @db.Decimal(5, 2)\n\n  estoqueAtual  Decimal  @default(0) @map(\"estoque_atual\") @db.Decimal(10, 3)\n  estoqueMinimo Decimal  @default(0) @map(\"estoque_minimo\") @db.Decimal(10, 3)\n  estoqueMaximo Decimal? @map(\"estoque_maximo\") @db.Decimal(10, 3)\n\n  ativo       Boolean @default(true)\n  ncm         String?\n  cest        String?\n  observacoes String?\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  movimentacoes MovimentacaoEstoque[]\n  itensVenda    ItemVenda[]\n\n  @@map(\"produtos\")\n}\n\n//\n// ==================== ESTOQUE ====================\n//\nmodel MovimentacaoEstoque {\n  id         String           @id @default(uuid())\n  produtoId  String           @map(\"produto_id\")\n  tipo       TipoMovimentacao\n  quantidade Decimal          @db.Decimal(10, 3)\n  motivo     String?\n  usuarioId  String?          @map(\"usuario_id\")\n  createdAt  DateTime         @default(now()) @map(\"created_at\")\n\n  produto Produto @relation(fields: [produtoId], references: [id], onDelete: Cascade)\n\n  @@map(\"movimentacoes_estoque\")\n}\n\nenum TipoMovimentacao {\n  ENTRADA\n  SAIDA\n  AJUSTE\n  VENDA\n  DEVOLUCAO\n}\n\n//\n// ==================== CLIENTES ====================\n//\nmodel Cliente {\n  id          String      @id @default(uuid())\n  tipo        TipoCliente\n  nome        String\n  cpfCnpj     String      @unique @map(\"cpf_cnpj\")\n  email       String?\n  telefone    String?\n  celular     String?\n  endereco    String?\n  numero      String?\n  complemento String?\n  bairro      String?\n  cidade      String?\n  estado      String?     @db.Char(2)\n  cep         String?\n  observacoes String?\n  ativo       Boolean     @default(true)\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  vendas Venda[]\n\n  @@map(\"clientes\")\n}\n\nenum TipoCliente {\n  FISICA\n  JURIDICA\n}\n\n//\n// ==================== VENDAS ====================\n//\nmodel Venda {\n  id        String   @id @default(uuid())\n  numero    Int      @unique @default(autoincrement())\n  clienteId String?  @map(\"cliente_id\")\n  usuarioId String   @map(\"usuario_id\")\n  dataVenda DateTime @default(now()) @map(\"data_venda\")\n\n  subtotal Decimal @db.Decimal(10, 2)\n  desconto Decimal @default(0) @db.Decimal(10, 2)\n  total    Decimal @db.Decimal(10, 2)\n\n  formaPagamento FormaPagamento @map(\"forma_pagamento\")\n  status         StatusVenda    @default(CONCLUIDA)\n  observacoes    String?\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  cliente Cliente?    @relation(fields: [clienteId], references: [id], onDelete: SetNull)\n  itens   ItemVenda[]\n\n  @@map(\"vendas\")\n}\n\nmodel ItemVenda {\n  id        String @id @default(uuid())\n  vendaId   String @map(\"venda_id\")\n  produtoId String @map(\"produto_id\")\n\n  quantidade    Decimal @db.Decimal(10, 3)\n  precoUnitario Decimal @map(\"preco_unitario\") @db.Decimal(10, 2)\n  subtotal      Decimal @db.Decimal(10, 2)\n  desconto      Decimal @default(0) @db.Decimal(10, 2)\n  total         Decimal @db.Decimal(10, 2)\n\n  venda   Venda   @relation(fields: [vendaId], references: [id], onDelete: Cascade)\n  produto Produto @relation(fields: [produtoId], references: [id], onDelete: Restrict)\n\n  @@map(\"itens_venda\")\n}\n\nenum FormaPagamento {\n  DINHEIRO\n  CARTAO_CREDITO\n  CARTAO_DEBITO\n  PIX\n  BOLETO\n  TRANSFERENCIA\n  CHEQUE\n  OUTROS\n}\n\nenum StatusVenda {\n  PENDENTE\n  CONCLUIDA\n  CANCELADA\n}\n\n//\n// ==================== USUÁRIOS ====================\n//\nmodel Usuario {\n  id     String        @id @default(uuid())\n  nome   String\n  email  String        @unique\n  senha  String\n  perfil PerfilUsuario\n  ativo  Boolean       @default(true)\n\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  @@map(\"usuarios\")\n}\n\nenum PerfilUsuario {\n  ADMIN\n  GERENTE\n  VENDEDOR\n  ESTOQUISTA\n}\n",
  "inlineSchemaHash": "3b3aba69cc8c54f01144cbfe0a0a360acd225ada91f3541d757d560c2aaad0d6",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Categoria\":{\"dbName\":\"categorias\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Produto\",\"nativeType\":null,\"relationName\":\"CategoriaToProduto\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Produto\":{\"dbName\":\"produtos\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"codigoInterno\",\"dbName\":\"codigo_interno\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"codigoBarras\",\"dbName\":\"codigo_barras\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descricao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categoriaId\",\"dbName\":\"categoria_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categoria\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Categoria\",\"nativeType\":null,\"relationName\":\"CategoriaToProduto\",\"relationFromFields\":[\"categoriaId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unidadeMedida\",\"dbName\":\"unidade_medida\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"precoCompra\",\"dbName\":\"preco_compra\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"precoVenda\",\"dbName\":\"preco_venda\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"margemLucro\",\"dbName\":\"margem_lucro\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"5\",\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estoqueAtual\",\"dbName\":\"estoque_atual\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"3\"]],\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estoqueMinimo\",\"dbName\":\"estoque_minimo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"3\"]],\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estoqueMaximo\",\"dbName\":\"estoque_maximo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"3\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ncm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cest\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacoes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"movimentacoes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MovimentacaoEstoque\",\"nativeType\":null,\"relationName\":\"MovimentacaoEstoqueToProduto\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itensVenda\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ItemVenda\",\"nativeType\":null,\"relationName\":\"ItemVendaToProduto\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"MovimentacaoEstoque\":{\"dbName\":\"movimentacoes_estoque\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoMovimentacao\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"3\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"motivo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"dbName\":\"usuario_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produto\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Produto\",\"nativeType\":null,\"relationName\":\"MovimentacaoEstoqueToProduto\",\"relationFromFields\":[\"produtoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Cliente\":{\"dbName\":\"clientes\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoCliente\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cpfCnpj\",\"dbName\":\"cpf_cnpj\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"telefone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"celular\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endereco\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numero\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"complemento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bairro\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Char\",[\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cep\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacoes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"vendas\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Venda\",\"nativeType\":null,\"relationName\":\"ClienteToVenda\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Venda\":{\"dbName\":\"vendas\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numero\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"dbName\":\"cliente_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"dbName\":\"usuario_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataVenda\",\"dbName\":\"data_venda\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"desconto\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"formaPagamento\",\"dbName\":\"forma_pagamento\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FormaPagamento\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StatusVenda\",\"nativeType\":null,\"default\":\"CONCLUIDA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacoes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cliente\",\"nativeType\":null,\"relationName\":\"ClienteToVenda\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itens\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ItemVenda\",\"nativeType\":null,\"relationName\":\"ItemVendaToVenda\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ItemVenda\":{\"dbName\":\"itens_venda\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vendaId\",\"dbName\":\"venda_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"3\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"precoUnitario\",\"dbName\":\"preco_unitario\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"desconto\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"10\",\"2\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"venda\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Venda\",\"nativeType\":null,\"relationName\":\"ItemVendaToVenda\",\"relationFromFields\":[\"vendaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produto\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Produto\",\"nativeType\":null,\"relationName\":\"ItemVendaToProduto\",\"relationFromFields\":[\"produtoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Usuario\":{\"dbName\":\"usuarios\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"uuid\",\"args\":[4]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senha\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"perfil\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PerfilUsuario\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"TipoMovimentacao\":{\"values\":[{\"name\":\"ENTRADA\",\"dbName\":null},{\"name\":\"SAIDA\",\"dbName\":null},{\"name\":\"AJUSTE\",\"dbName\":null},{\"name\":\"VENDA\",\"dbName\":null},{\"name\":\"DEVOLUCAO\",\"dbName\":null}],\"dbName\":null},\"TipoCliente\":{\"values\":[{\"name\":\"FISICA\",\"dbName\":null},{\"name\":\"JURIDICA\",\"dbName\":null}],\"dbName\":null},\"FormaPagamento\":{\"values\":[{\"name\":\"DINHEIRO\",\"dbName\":null},{\"name\":\"CARTAO_CREDITO\",\"dbName\":null},{\"name\":\"CARTAO_DEBITO\",\"dbName\":null},{\"name\":\"PIX\",\"dbName\":null},{\"name\":\"BOLETO\",\"dbName\":null},{\"name\":\"TRANSFERENCIA\",\"dbName\":null},{\"name\":\"CHEQUE\",\"dbName\":null},{\"name\":\"OUTROS\",\"dbName\":null}],\"dbName\":null},\"StatusVenda\":{\"values\":[{\"name\":\"PENDENTE\",\"dbName\":null},{\"name\":\"CONCLUIDA\",\"dbName\":null},{\"name\":\"CANCELADA\",\"dbName\":null}],\"dbName\":null},\"PerfilUsuario\":{\"values\":[{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"GERENTE\",\"dbName\":null},{\"name\":\"VENDEDOR\",\"dbName\":null},{\"name\":\"ESTOQUISTA\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {}
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

