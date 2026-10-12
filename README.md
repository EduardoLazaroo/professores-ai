# Professores AI

## Proposito

Professores AI e um assistente web para docentes da rede estadual. A aplicacao ajuda a estruturar planejamentos semanais e textos de ocorrencias escolares, com exportacao em DOCX e PDF.

O produto foi pensado como apoio ao trabalho docente: a IA produz rascunhos que devem ser revisados pelo professor, e a primeira versao nao persiste dados de usuarios.

## Tecnologias

- Next.js com App Router;
- React e TypeScript;
- Tailwind CSS;
- OpenAI para geracao assistida;
- `docx`, jsPDF e html2canvas para exportacao.

| Area | Localizacao |
|---|---|
| Interface e paginas | `app/` |
| Endpoint de geracao | `app/api/generate/route.ts` |
| Prompts e integracao | `lib/prompts.ts` e `lib/openai.ts` |
| Exportacao | `lib/docx-generator.ts` e `lib/pdf-generator.ts` |
| Dados curriculares | `lib/data/` |

## Funcionalidades

- geracao de planejamento semanal;
- formalizacao de ocorrencias escolares;
- exportacao dos resultados para DOCX e PDF;
- integracao com OpenAI;
- fallback offline quando o fluxo principal nao estiver disponivel.

## Instalacao e execucao

### Pre-requisitos

- Node.js 18 ou superior;
- uma chave da OpenAI para o fluxo de geracao online.

Instale as dependencias:

```bash
npm install
```

Crie `.env.local` a partir das orientacoes de `DOCUMENTATION.md` e defina:

```text
OPENAI_API_KEY=sua_chave
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:3000`. Para validar a compilacao de producao:

```bash
npm run build
npm run start
```

## Privacidade e limites

A aplicacao deve ser usada com revisao humana. Nao inclua dados pessoais sensiveis de estudantes em prompts ou exportacoes. Embora exista fallback, a experiencia principal depende da configuracao correta da chave e da disponibilidade do provedor de IA.

Nao foi identificada suite automatizada de testes neste repositorio. A documentacao funcional detalhada e o roadmap estao em [DOCUMENTATION.md](DOCUMENTATION.md).

## Apresentacao profissional

O texto de publicacao, as capturas recomendadas e um prompt para diagrama estao em [APRESENTACAO.md](APRESENTACAO.md).
