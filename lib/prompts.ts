/**
 * Prompts estruturados para cada tipo de funcionalidade
 * Mantém a lógica de geração de prompts separada do código de API
 */

import {
  GenerateType,
  OcorrenciaContext,
  AtividadeContext,
  TecnicoContext,
} from "./types";
import { parseScopeText } from "./scopeParser";

const SYSTEM_PROMPT = `Você é um assistente especialista em pedagogia da Educação Profissional e Tecnológica (EPT) e Educação Básica, ajudando professores com suas tarefas administrativas e planejamentos pedagógicos formais. Responda sempre de forma clara, profissional, concisa e sem usar markdown ou formatação especial. Use apenas texto estruturado simples com os títulos solicitados entre parênteses.`;

/**
 * PLANEJAMENTO DO EIXO TÉCNICO (EDUCAÇÃO PROFISSIONAL TÉCNICO DE DESENVOLVIMENTO DE SISTEMAS - EE MONSENHOR BICUDO)
 */
const TECNICO_EPT_PROMPT = `Você é um Especialista em Pedagogia da Educação Profissional Técnico de Desenvolvimento de Sistemas, focado nos Cursos Técnicos de Tecnologia da Informação da Escola Estadual Monsenhor Bicudo.

Com base nos dados da turma e no escopo fornecido, elabore um planejamento semanal completo, altamente prático e voltado para o mercado de trabalho em TI.

REGRAS CRÍTICAS DE HIGIENIZAÇÃO DE TEXTO DO ESCOPO (OBRIGATÓRIO):
O escopo enviado pelo professor é fruto de colagens brutas de planilhas Excel/Google Sheets ou arquivos PDF e pode conter quebras acidentais de linha ou pontuações deslocadas. Você DEVE rigorosamente:
1. HIGIENIZAR e UNIR frases e termos técnicos cortados no meio da linha (ex: "ping \n para validação" DEVE ser corrigido para "ping para validação"; "AWS, GCP, Azure \n ." DEVE ser higienizado para "AWS, GCP e Azure.").
2. REMOVER pontuações soltas ou desalinhadas no início ou fim de linhas (ex: ". Devem" DEVE ser corrigido para "Devem..."; frases NUNCA podem começar com ponto final isolado).
3. ESTRUTURAR todos os conceitos, ferramentas e habilidades em frases completas, fluidas, didáticas e gramaticalmente perfeitas.

Dados do Curso & Turma:
- Professor: {nomeProf}
- Turma: {turma}
- Componente/Disciplina: {disciplina}
- Bimestre: {bimestre} | Semana: {semana}
- Período: {dataInicio} a {dataFim}
- Quantidade de Aulas: {qtdAulas} aulas
- Uso de Laboratório Técnico: {usoLaboratorio}

Estruture a resposta OBRIGATORIAMENTE com as seguintes 10 seções (cada uma iniciada pelo título entre parênteses em maiúsculo):

(APRENDIZAGENS ESSENCIAIS)
Resumo das aprendizagens fundamentais e práticas que os estudantes de TI devem dominar nesta semana.

(HABILIDADES PRIORIZADA & SOCIOEMOCIONAIS)
Competências técnicas e atitudinais (soft skills como resolução de problemas, cooperação e persistência) trabalhadas no período.

(CONTEÚDOS PROGRAMÁTICOS & DESCRITORES)
Tópicos técnicos detalhados e conceitos específicos da disciplina.

(OBJETIVOS ESPECÍFICOS)
Objetivos práticos e mensuráveis do que o estudante será capaz de realizar.

(ESTRATÉGIAS & PROCEDIMENTOS DIDÁTICOS)
Descreva detalhadamente a sequência didática passo a passo dividida especificamente por cada aula ({qtdAulas} aulas). Exemplo:
Aula 1: Acolhimento, fundamentos teóricos e apresentação de desafio.
Aula 2: Desenvolvimento prático em ambiente de desenvolvimento (IDE) ou laboratório.
Aula 3: Exercícios práticos, teste em pares e avaliação formativa.

(MATERIAL DIGITAL DE APOIO)
Documentações técnicas, repositórios (ex: GitHub), plataformas de ensino e slides.

(RECURSOS & FERRAMENTAS)
Softwares, bibliotecas, IDEs, computadores do laboratório técnico ou ferramentas físicas necessárias.

(AVALIAÇÃO DA APRENDIZAGEM)
Critérios práticos, entrega de código/projetos e instrumentos de avaliação contínua.

(OBSERVAÇÕES & ADAPTAÇÕES PEDAGÓGICAS)
Orientações para apoio individualizado, ritmos de aprendizagem e inclusão pedagógica.

(REFERÊNCIAS BIBLIOGRÁFICAS TÉCNICAS)
Livros técnicos, manuais oficiais e documentações recomendadas.

Responda de forma objetiva, sem usar markdown (sem ## ou **), sem símbolos especiais. Use apenas texto estruturado simples com as seções em parênteses.

Escopo enviado pelo professor:
{content}`;

/**
 * PLANEJAMENTO SEMANAL
 */
const PLANEJAMENTO_SEMANAL_PROMPT = `Com base na seguinte proposta de planejamento semanal, estruture uma resposta com as seguintes seções obrigatoriamente, cada uma iniciada pelo título entre parênteses:

(APRENDIZAGENS ESSENCIAIS)
Resumo das aprendizagens fundamentais que os alunos devem alcançar nesta semana.

(HABILIDADE PRIORIZADA / HABILIDADES RELACIONADAS)
Habilidade principal a ser priorizada e outras habilidades relacionadas.

(CONTEÚDOS / DESCRITORES)
Tópicos e descritores curriculares que serão trabalhados.

(MATERIAL DIGITAL)
Recursos digitais e plataformas que podem ser utilizados.

(OBJETIVOS ESPECÍFICOS)
Objetivos de aprendizagem específicos e mensuráveis para a semana.

(ESTRATÉGIAS / PROCEDIMENTOS PARA O DESENVOLVIMENTO DOS OBJETIVOS PROPOSTOS)
Métodos, sequências de atividades e procedimentos didáticos para alcançar os objetivos.

(RECURSOS / FERRAMENTAS)
Lista de materiais, equipamentos e ferramentas (físicas e digitais) necessárias.

(AVALIAÇÃO)
Instrumentos e critérios de avaliação, evidências esperadas e como registrar os resultados.

(OBSERVAÇÕES)
Observações pedagógicas, adaptações e orientações complementares.

(REFERÊNCIAS BIBLIOGRÁFICAS)
Fontes e referências usadas ou recomendadas.

Responda de forma objetiva, sem markdown, sem ##, sem símbolos especiais. Use apenas parágrafos claros e bem estruturados.

Proposta do professor:`;

/**
 * OCORRÊNCIA FORMAL
 */
const OCORRENCIA_FORMAL_PROMPT = `Reescreva o seguinte relato informal em linguagem formal, adequada para registro escolar oficial. Mantenha todos os fatos importantes, mas use uma linguagem profissional e apropriada para documentação pedagógica. Não use markdown ou símbolos especiais. Retorne como um parágrafo único, coeso e bem estruturado.

Contexto da ocorrência:
- Tipo: {tipo}
- Data: {data}
- Turno: {turno}
- Gravidade: {gravidade}
- Necessita encaminhamento: {encaminhamento}

Relato a reescrever:`;

/**
 * CRIADOR DE ATIVIDADES
 */
const ATIVIDADE_CRIADOR_PROMPT = `Você é um especialista em design pedagógico. Com base nas informações fornecidas, crie TRÊS atividades completas e estruturadas, diferentes entre si, para oferecer opções ao professor.

Informações:
- Turma: {turma}
- Disciplina: {disciplina}
- Tópico: {topico}
- Recursos disponíveis: {recursos}

Gere EXATAMENTE 3 atividades diferentes. Para cada uma, estruture a resposta com as seguintes seções (cada uma iniciada pelo título entre parênteses):

(ATIVIDADE 1)

(Objetivo da Atividade)
Qual é o objetivo específico que os alunos devem alcançar.

(Descrição Passo a Passo)
Descreva os passos de forma clara para que o professor possa executar em sala.

(Recursos Utilizados)
Liste especificamente os recursos que serão utilizados.

(Tempo Estimado)
Informe o tempo necessário para realizar a atividade.

(Forma de Avaliação)
Como o professor avaliará se os alunos atingiram o objetivo.

---

(ATIVIDADE 2)

(Objetivo da Atividade)
Qual é o objetivo específico que os alunos devem alcançar.

(Descrição Passo a Passo)
Descreva os passos de forma clara para que o professor possa executar em sala.

(Recursos Utilizados)
Liste especificamente os recursos que serão utilizados.

(Tempo Estimado)
Informe o tempo necessário para realizar a atividade.

(Forma de Avaliação)
Como o professor avaliará se os alunos atingiram o objetivo.

---

(ATIVIDADE 3)

(Objetivo da Atividade)
Qual é o objetivo específico que os alunos devem alcançar.

(Descrição Passo a Passo)
Descreva os passos de forma clara para que o professor possa executar em sala.

(Recursos Utilizados)
Liste especificamente os recursos que serão utilizados.

(Tempo Estimado)
Informe o tempo necessário para realizar a atividade.

(Forma de Avaliação)
Como o professor avaliará se os alunos atingiram o objetivo.

Responda de forma objetiva, sem markdown, sem símbolos especiais. Use apenas texto estruturado simples. Var sépare as atividades com --- para melhor legibilidade.`;

/**
 * Gera prompt completo baseado no tipo
 */
export function generatePrompt(
  type: GenerateType,
  content: string,
  context?: OcorrenciaContext | AtividadeContext | TecnicoContext
): string {
  switch (type) {
    case "planejamento":
      return `${PLANEJAMENTO_SEMANAL_PROMPT}\n\n${content}`;

    case "ocorrencia":
      const ocorrenciaCtx = context as OcorrenciaContext;
      const ocorrenciaPrompt = OCORRENCIA_FORMAL_PROMPT
        .replace("{tipo}", ocorrenciaCtx.tipo || "")
        .replace("{data}", ocorrenciaCtx.data || "")
        .replace("{turno}", ocorrenciaCtx.turno || "Não especificado")
        .replace("{gravidade}", ocorrenciaCtx.gravidade || "Não especificada")
        .replace(
          "{encaminhamento}",
          ocorrenciaCtx.encaminhamento ? "Sim" : "Não"
        );
      return `${ocorrenciaPrompt}\n\n${content}`;

    case "atividade":
      const atividadeCtx = context as AtividadeContext;
      const recursosStr = atividadeCtx.recursos.join(", ");
      const atividadePrompt = ATIVIDADE_CRIADOR_PROMPT
        .replace("{turma}", atividadeCtx.turma || "")
        .replace("{disciplina}", atividadeCtx.disciplina || "")
        .replace("{topico}", atividadeCtx.topico || "")
        .replace("{recursos}", recursosStr || "Não especificados");
      return atividadePrompt;

    case "tecnico":
      const tecnicoCtx = context as TecnicoContext;
      const tecnicoPrompt = TECNICO_EPT_PROMPT
        .replace("{nomeProf}", tecnicoCtx.nomeProf || "Professor(a)")
        .replace("{turma}", tecnicoCtx.turma || "Técnico")
        .replace("{disciplina}", tecnicoCtx.disciplina || "TI")
        .replace("{bimestre}", tecnicoCtx.bimestre || "1º")
        .replace("{semana}", tecnicoCtx.semana || "Semana 01")
        .replace("{dataInicio}", tecnicoCtx.dataInicio || "")
        .replace("{dataFim}", tecnicoCtx.dataFim || "")
        .replace("{qtdAulas}", String(tecnicoCtx.qtdAulas || 3))
        .replace(
          "{usoLaboratorio}",
          tecnicoCtx.usoLaboratorio
            ? "Sim (Laboratório: Sala de Leitura)"
            : "Não (Sala de aula comum)"
        )
        .replace("{content}", content || "");
      return tecnicoPrompt;

    default:
      throw new Error(`Tipo desconhecido: ${type}`);
  }
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

/**
 * Validações básicas do conteúdo antes de enviar à API
 */
export function validateContent(content: string): string | null {
  const trimmed = content.trim();

  if (!trimmed) {
    return "Por favor, insira um conteúdo válido.";
  }

  if (trimmed.length < 10) {
    return "O conteúdo é muito curto. Insira pelo menos 10 caracteres.";
  }

  if (trimmed.length > 5000) {
    return "O conteúdo excede o limite de 5000 caracteres.";
  }

  return null;
}

/**
 * Validações de contexto específico
 */
export function validateOcorrenciaContext(
  context: OcorrenciaContext
): string | null {
  if (!context.nomeProf || !context.nomeProf.trim()) {
    return "Nome do professor é obrigatório.";
  }
  if (!context.tipo) {
    return "Tipo de ocorrência é obrigatório (Coletiva/Individual).";
  }
  if (!context.data) {
    return "Data da ocorrência é obrigatória.";
  }
  return null;
}

export function validateAtividadeContext(
  context: AtividadeContext
): string | null {
  if (!context.turma) {
    return "Turma é obrigatória.";
  }
  if (!context.disciplina) {
    return "Disciplina é obrigatória.";
  }
  if (!context.topico) {
    return "Tópico é obrigatório.";
  }
  return null;
}

export function validateTecnicoContext(context: TecnicoContext): string | null {
  if (!context.nomeProf || !context.nomeProf.trim()) {
    return "Nome do professor(a) é obrigatório.";
  }
  if (!context.turma) {
    return "Turma é obrigatória.";
  }
  if (!context.disciplina || !context.disciplina.trim()) {
    return "Disciplina é obrigatória.";
  }
  if (!context.semana) {
    return "Semana é obrigatória.";
  }
  return null;
}

/**
 * Gerador de resposta offline/fallback para o Eixo Técnico
 */
export function generateTecnicoOfflineFallback(
  context: TecnicoContext,
  rawContent: string
): string {
  const parsed = parseScopeText(rawContent);
  const qtdAulas = context.qtdAulas || 3;
  const disciplina = context.disciplina || parsed.disciplina || "Componente Técnico TI";

  let estrategiasPorAula = "";
  for (let i = 1; i <= qtdAulas; i++) {
    const aulaInfo = parsed.aulas.find((a) => a.numero === i) || {
      numero: i,
      titulo: `Aula ${i}`,
      descricao: `Prática e consolidação de conceitos técnicos da aula ${i}.`,
    };

    if (i === 1) {
      estrategiasPorAula += `Aula 1: Acolhimento, contextualização profissional e introdução a ${aulaInfo.descricao}. Apresentação do desafio prático.\n`;
    } else if (i === 2 && context.usoLaboratorio) {
      estrategiasPorAula += `Aula 2: Atividade prática orientada no Laboratório Técnico de Informática. Desenvolvimento hands-on focado em ${aulaInfo.descricao}.\n`;
    } else if (i === 3) {
      estrategiasPorAula += `Aula 3: Resolução de problemas em duplas, revisão de código/conceitos e avaliação formativa com feedback contínuo.\n`;
    } else {
      estrategiasPorAula += `Aula ${i}: Consolidação das práticas, testes práticos e documentação pedagógica sobre ${aulaInfo.descricao}.\n`;
    }
  }

  const labRecursos = context.usoLaboratorio
    ? "Laboratório Técnico de TI com computadores conectados à internet, ambiente de desenvolvimento (IDE VS Code / Git), projetor interativo."
    : "Sala de aula convencional, quadro branco, projetor multimídia e notebooks didáticos.";

  return `(APRENDIZAGENS ESSENCIAIS)
Compreender e aplicar de forma prática os fundamentos de ${disciplina}, desenvolvendo raciocínio lógico, capacidade analítica e autonomia técnica em cenários reais do mercado de tecnologia.

(HABILIDADES PRIORIZADA & SOCIOEMOCIONAIS)
${parsed.competencia || "Desenvolver e implementar soluções de software e infraestrutura de TI."}
Competências socioemocionais: ${parsed.competenciasSocioemocionais || "Resolução de problemas, cooperação em equipe, proatividade e persistência investigativa."}

(CONTEÚDOS PROGRAMÁTICOS & DESCRITORES)
${parsed.conteudo || `Módulos essenciais de ${disciplina}, boas práticas de desenvolvimento e documentação técnica.`}

(OBJETIVOS ESPECÍFICOS)
${parsed.objetivos || `- Capacitar o estudante a estruturar soluções técnicas eficientes.\n- Desenvolver habilidades práticas de teste e depuração.\n- Estimular a argumentação técnica e o trabalho em equipe.`}

(ESTRATÉGIAS & PROCEDIMENTOS DIDÁTICOS)
${estrategiasPorAula.trim()}

(MATERIAL DIGITAL DE APOIO)
Repositórios didáticos no GitHub, apresentações interativas, documentações oficiais de tecnologia e tutoriais online.

(RECURSOS & FERRAMENTAS)
${labRecursos}

(AVALIAÇÃO DA APRENDIZAGEM)
Avaliação contínua e formativa através de entregas práticas, resolução de desafios pedagógicos e participação ativa durante as atividades.

(OBSERVAÇÕES & ADAPTAÇÕES PEDAGÓGICAS)
Acompanhamento individualizado aos estudantes que necessitarem de apoio no ritmo de desenvolvimento prático, garantindo a acessibilidade pedagógica.

(REFERÊNCIAS BIBLIOGRÁFICAS TÉCNICAS)
Manuais oficiais de tecnologia, documentação técnica de referência e acervo didático do Ensino Técnico da EE Monsenhor Bicudo.`;
}

