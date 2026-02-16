# Assistente AI para Professores

Uma ferramenta web moderna para auxiliar professores da rede estadual de ensino com tarefas pedagógicas utilizando inteligência artificial.

## 🎯 Funcionalidades (V1)

### 1. Planejamento Semanal
O professor insere um escopo da semana com conteúdos e temas. O sistema retorna um planejamento estruturado com:
- **Objetivos** - Principais objetivos de aprendizagem
- **Conteúdos** - Tópicos a serem abordados
- **Metodologia** - Estratégias de ensino
- **Recursos** - Materiais e ferramentas necessárias
- **Avaliação** - Formas de acompanhamento

### 2. Ocorrência Formal
O professor insere um relato informal sobre um ocorrido em sala. O sistema reescreve em linguagem formal apropriada para registros escolares.

## 🏗️ Arquitetura

```
projeto_x/professores-ai/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Rota API principal
│   ├── components/
│   │   ├── FormSection.tsx        # Componente de entrada (type + content)
│   │   ├── ResultSection.tsx      # Componente de resultado
│   │   └── ActionButton.tsx       # Botão de geração
│   ├── globals.css                # Estilos globais
│   ├── layout.tsx                 # Layout raiz com metadados
│   └── page.tsx                   # Página principal
├── lib/
│   ├── types.ts                   # Tipos e interfaces (TypeScript)
│   ├── prompts.ts                 # Prompts estruturados
│   ├── openai.ts                  # Serviço de integração com OpenAI
│   └── validation.ts              # Validações e segurança
├── public/                        # Arquivos estáticos
├── .env.example                   # Exemplo de variáveis de ambiente
├── package.json                   # Dependências do projeto
├── next.config.ts                 # Configuração do Next.js
├── tsconfig.json                  # Configuração do TypeScript
└── README.md                       # Este arquivo
```

## 🚀 Instalação e Setup

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Chave de API da OpenAI

### Passos

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd professores-ai
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Abra `.env.local` e adicione sua chave de API:
```bash
OPENAI_API_KEY=sk-sua-chave-aqui
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📦 Tecnologias

- **Framework**: Next.js 16.1.6 (App Router)
- **Linguagem**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **IA**: OpenAI API (gpt-4o-mini)
- **Package Manager**: npm
- **Hosting**: Vercel (recomendado)

## 🔒 Segurança

- ✅ Chave de API armazenada apenas em variáveis de ambiente do servidor
- ✅ Nenhum dado de usuário é persisted em banco de dados (V1)
- ✅ Validação rigorosa de entrada (min 10, max 5000 caracteres)
- ✅ Tratamento de erros sem expor detalhes internos
- ✅ Comunicação criptografada via HTTPS (em produção)
- ✅ Sem logging de conteúdo sensível
- ✅ Placeholder de rate limiting para futura implementação

## 📋 Estrutura de Requisições

### Requisição
```json
POST /api/generate
Content-Type: application/json

{
  "type": "planejamento" | "ocorrencia",
  "content": "seu texto aqui (10-5000 caracteres)"
}
```

### Resposta de Sucesso (200)
```json
{
  "success": true,
  "result": "Resultado formatado em Markdown"
}
```

### Resposta de Erro (400/500/503)
```json
{
  "success": false,
  "error": "Mensagem de erro descritiva"
}
```

## 🧪 Health Check

```bash
GET /api/generate

# Retorna
{
  "status": "ok" | "unavailable"
}
```

## 🛣️ Roadmap de Escalabilidade

### V2 (Futuro)
- [ ] Autenticação com Google/Email
- [ ] Banco de dados (Supabase/PostgreSQL)
- [ ] Histórico de gerações por usuário
- [ ] Rate limiting implementado
- [ ] Dashboard com estatísticas
- [ ] Exportação em PDF/DOCX

### V3 (Futuro)
- [ ] Múltiplos prompts customizáveis por professor
- [ ] Suporte a múltiplos idiomas
- [ ] Integração com plataformas escolares
- [ ] API pública para desenvolvedores
- [ ] Webhooks para automações

## 📝 Documentação de Desenvolvimento

### Adicionando um novo tipo de geração

1. Adicione o tipo em `lib/types.ts`:
```typescript
export type GenerateType = "planejamento" | "ocorrencia" | "novo_tipo";
```

2. Crie o prompt em `lib/prompts.ts`:
```typescript
const NOVO_TIPO_PROMPT = `...`;

export function generatePrompt(type: GenerateType, content: string): string {
  switch (type) {
    case "novo_tipo":
      return `${NOVO_TIPO_PROMPT}\n\n${content}`;
    // ...
  }
}
```

3. Atualize a UI em `app/components/FormSection.tsx` para adicionar a opção.

### Adicionando autenticação (V2)

1. Instale o provedor de autenticação (ex: NextAuth)
2. Crie um middleware em `app/middleware.ts`
3. Proteja a rota `/api/generate`
4. Adicione `userId` nas requisições
5. Implemente banco de dados para histórico

## 🐛 Troubleshooting

**Erro: "OPENAI_API_KEY não está configurada"**
- Certifique-se que `.env.local` existe
- Verifique se a chave está corretamente configurada
- Reinicie o servidor

**Erro 429 (Rate limit)**
- Aguarde alguns momentos e tente novamente
- Implemente rate limiting real em V2

**Interface não responde corretamente no tablet**
- Verifique as classes Tailwind responsivas (sm:, md:, lg:)
- Use DevTools para debug de media queries

## 📞 Suporte

Para problemas ou sugestões, abra uma issue no repositório.

## 📄 Licença

MIT - Uso livre para fins educacionais.

---

**Versão**: 1.0.0  
**Última atualização**: Fevereiro 2026
