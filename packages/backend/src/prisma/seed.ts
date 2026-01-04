import { PrismaClient, PerfilUsuario } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  // 1. Criar Categorias Iniciais
  const categorias = [
    { nome: 'Máquinas' },
    { nome: 'Ferramentas' },
    { nome: 'Equipamentos de Proteção (EPI)' },
    { nome: 'Peças de Reposição' },
    { nome: 'Acessórios' },
  ];

  console.log('Categorias...');
  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { nome: cat.nome },
      update: {},
      create: cat,
    });
  }

  // 2. Criar Usuário Admin Inicial (Aplicação)
  console.log('Usuário Admin...');
  await prisma.usuario.upsert({
    where: { email: 'admin@oliveira.com' },
    update: {},
    create: {
      nome: 'Administrador Oliveira',
      email: 'admin@oliveira.com',
      senha: 'admin123', // Em produção isso deve ser hasheado
      perfil: PerfilUsuario.ADMIN,
      ativo: true,
    },
  });

  // 3. Criar alguns produtos iniciais para teste
  console.log('Produtos iniciais...');
  const catFerramentas = await prisma.categoria.findUnique({
    where: { nome: 'Ferramentas' },
  });

  if (catFerramentas) {
    const produtos = [
      {
        codigoInterno: 'FER-001',
        nome: 'Furadeira de Impacto 500W',
        descricao: 'Furadeira profissional para concreto e madeira',
        unidadeMedida: 'UN',
        precoCompra: 150.0,
        precoVenda: 250.0,
        margemLucro: 66.67,
        estoqueAtual: 10,
        estoqueMinimo: 2,
        categoriaId: catFerramentas.id,
      },
      {
        codigoInterno: 'FER-002',
        nome: 'Jogo de Chaves de Fenda',
        descricao: 'Kit com 6 peças aço cromo vanádio',
        unidadeMedida: 'JG',
        precoCompra: 45.0,
        precoVenda: 89.9,
        margemLucro: 99.78,
        estoqueAtual: 25,
        estoqueMinimo: 5,
        categoriaId: catFerramentas.id,
      },
    ];

    for (const prod of produtos) {
      await prisma.produto.upsert({
        where: { codigoInterno: prod.codigoInterno },
        update: {},
        create: prod,
      });
    }
  }

  console.log('✅ Seeding finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
