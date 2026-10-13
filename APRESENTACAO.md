# Apresentação Profissional — Professores AI

## Identidade e Proposta de Valor

O **Professores AI** é uma solução de inteligência aplicada à educação (EdTech) voltada a mitigar a sobrecarga burocrática docente e elevar o padrão formal dos instrumentos pedagógicos nas escolas técnicas e públicas. Construído com **Next.js 16.1 (App Router)**, **React 19.2**, **Tailwind CSS v4** e um motor híbrido de IA (OpenAI GPT-4o + fallback curricular local), o sistema transforma comandos simples em planos de aula completos e ocorrências escolares formatadas.

Diferenciais fundamentais:
- **Aderência Regulatória Fiel**: Formatação 100% alinhada ao modelo oficial de Plano de Aula Semanal (**PAS_MODELO_2026** da EE Monsenhor Bicudo), cobrindo as 10 seções pedagógicas obrigatórias.
- **Exportação Nativa de Documentos**: Utilização da biblioteca `docx v9.7` para gerar arquivos Word (.docx) pré-formatados com margens, tabelas zebradas na cor institucional (#D9E2F3) e cabeçalhos oficiais com brasões do Governo do Estado de São Paulo.
- **Resiliência e Fallback Offline**: Capacidade de operar de forma contínua mesmo na ausência de conexão externa com LLMs, apoiando-se nas matrizes curriculares estruturadas em JSON.
- **Privacidade por Design (Privacy-by-Design)**: Arquitetura sem persistência em banco de dados, protegendo a identidade e histórico de estudantes sob os princípios da LGPD.

---

## Texto Estruturado para Publicação / Portfólio

> O **Professores AI** foi concebido para resolver um dos principais desafios da rotina docente: o tempo excessivo dedicado ao preenchimento de documentos burocráticos e regulamentares. Desenvolvida em **Next.js 16.1**, **React 19** e **Tailwind CSS**, a plataforma combina IA generativa com matrizes curriculares do Ensino Técnico paulista para estruturar Planos de Aula Semanais (PAS) rigorosos e ocorrências formais. Um dos maiores diferenciais da engenharia do projeto é o motor de exportação direta para **DOCX**, que entrega documentos Word perfeitamente diagramados no padrão institucional, e a garantia de um motor offline para assegurar disponibilidade pedagógica ininterrupta. O projeto evidencia capacidade em engenharia de prompt educacional, arquitetura web de alto desempenho e design centrado no usuário.

---

## Resultados da Validação Real

- **Compilação Turbopack de Produção**: 100% bem-sucedida em 11.0 segundos com otimização estática e rotas dinâmicas.
- **Testes de Rota e Fallback**: Endpoint `/api/generate` validado via testes automatizados, gerando plano técnico completo com 1.602 caracteres e todas as 10 seções regulamentares validadas.
- **Exportação Documental Verificada**: Código do gerador de DOCX e PDF inspecionado e pronto para empacotamento vetorial.

---

## Evidências Visuais e Técnicas

1. **Diagrama Arquitetural da Plataforma**: [`evidencias/arquitetura_professores_ai.png`](evidencias/arquitetura_professores_ai.png)
2. **Estrutura Oficial do Plano de Aula (PAS 2026)**: [`evidencias/estrutura_plano_aula_pas2026.png`](evidencias/estrutura_plano_aula_pas2026.png)
3. **Registro de Execução Real e Testes de API**: [`evidencias/log_execucao_real.txt`](evidencias/log_execucao_real.txt)
