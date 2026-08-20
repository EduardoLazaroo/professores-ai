import {
  GenerateType,
  OcorrenciaContext,
  AtividadeContext,
  TecnicoContext,
} from "./types";

const SYSTEM_PROMPT = `Você é um assistente especialista em pedagogia da Educação Profissional e Tecnológica (EPT) e Educação Básica, ajudando professores com suas tarefas administrativas e planejamentos pedagógicos formais. Responda sempre de forma clara, profissional, concisa e sem usar markdown ou formatação especial. Use apenas texto estruturado simples com os títulos solicitados entre parênteses.`;

/**
 * PLANEJAMENTO DO EIXO TÉCNICO (EDUCAÇÃO PROFISSIONAL TÉCNICO DE DESENVOLVIMENTO DE SISTEMAS - EE MONSENHOR BICUDO)
 */
const TECNICO_EPT_PROMPT = `Você é um Especialista em Pedagogia da Educação Profissional Técnico de Desenvolvimento de Sistemas, focado nos Cursos Técnicos de Tecnologia da Informação da Escola Estadual Monsenhor Bicudo.

Com base nos dados da turma e no escopo fornecido, elabore um planejamento semanal completo, altamente prático e voltado para o mercado de trabalho em TI.

REGRAS CRÍTICAS DE PREENCHIMENTO E HIGIENIZAÇÃO (OBRIGATÓRIO):
1. TODAS AS 10 SEÇÕES ABAIXO SÃO DE PREENCHIMENTO ESTRITAMENTE OBRIGATÓRIO. NENHUMA SEÇÃO PODE SER OMITIDA, FICAR VAZIA OU CONTER APENAS HÍFEN (-).
2. A seção (CONTEÚDOS/ DESCRITORES) DEVE obrigatoriamente conter a lista detalhada de todos os tópicos técnicos, conceitos, algoritmos, ferramentas e linguagens trabalhados na semana.
3. Higienize e una frases técnicas eventualmente cortadas ou coladas do escopo.

Dados do Curso & Turma:
- Professor: {nomeProf}
- Turma: {turma}
- Componente/Disciplina: {disciplina}
- Bimestre: {bimestre} | Semana: {semana}
- Período: {dataInicio} a {dataFim}
- Quantidade de Aulas: {qtdAulas} aulas
- Uso de Laboratório Técnico: {usoLaboratorio}

Estruture a resposta OBRIGATORIAMENTE com as seguintes 10 seções (respeitando exatamente os títulos entre parênteses):

(APRENDIZAGENS ESSENCIAIS (AE))
Resumo das aprendizagens fundamentais e práticas que os estudantes de TI devem dominar nesta semana.

(HABILIDADE PRIORIZADA/ HABILIDADES RELACIONADAS)
Competências técnicas e atitudinais (soft skills como resolução de problemas, cooperação e persistência) trabalhadas no período.

(CONTEÚDOS/ DESCRITORES)
Tópicos técnicos detalhados, conceitos específicos da disciplina, assuntos e descritores curriculares trabalhados na semana. Preenchimento obrigatório e minucioso.

(MATERIAL DIGITAL)
Documentações técnicas, repositórios (ex: GitHub), plataformas digitais de ensino e materiais da Secretaria da Educação.

(OBJETIVOS ESPECÍFICOS)
Objetivos práticos e mensuráveis do que o estudante será capaz de realizar ao longo da semana.

(ESTRATÉGIAS/ PROCEDIMENTOS PARA O DESENVOLVIMENTO DOS OBJETIVOS PROPOSTOS (PARA CADA AULA))
Descreva detalhadamente a sequência didática passo a passo dividida especificamente por cada aula ({qtdAulas} aulas). Exemplo:
Aula 1: Acolhimento, fundamentos teóricos e apresentação de desafio.
Aula 2: Desenvolvimento prático em ambiente de desenvolvimento (IDE) ou laboratório.
Aula 3: Exercícios práticos, teste em pares e avaliação formativa.

(RECURSOS/FERRAMENTAS)
Softwares, bibliotecas, IDEs, computadores do laboratório técnico ou ferramentas físicas necessárias.

(AVALIAÇÃO)
Critérios práticos, entrega de código/projetos, evidências e instrumentos de avaliação contínua.

(OBSERVAÇÕES)
Orientações pedagógicas para apoio individualizado, ritmos de aprendizagem e adaptações inclusivas.

(REFERÊNCIAS BIBLIOGRÁFICAS)
Livros técnicos, manuais oficiais e documentações recomendadas.

Responda de forma objetiva, sem usar markdown (sem ## ou **), sem símbolos especiais. Use apenas texto estruturado simples com as seções em parênteses.

Escopo enviado pelo professor:
{content}`;

/**
 * PLANEJAMENTO SEMANAL
 */
const PLANEJAMENTO_SEMANAL_PROMPT = `Com base na seguinte proposta de planejamento semanal, estruture uma resposta com as seguintes seções obrigatoriamente, cada uma iniciada pelo título entre parênteses:

(APRENDIZAGENS ESSENCIAIS (AE))
Resumo das aprendizagens fundamentais que os alunos devem alcançar nesta semana.

(HABILIDADE PRIORIZADA/ HABILIDADES RELACIONADAS)
Habilidade principal a ser priorizada e outras habilidades relacionadas.

(CONTEÚDOS/ DESCRITORES)
Tópicos e descritores curriculares que serão trabalhados. Preenchimento obrigatório e detalhado.

(MATERIAL DIGITAL)
Recursos digitais e plataformas que podem ser utilizados.

(OBJETIVOS ESPECÍFICOS)
Objetivos de aprendizagem específicos e mensuráveis para a semana.

(ESTRATÉGIAS/ PROCEDIMENTOS PARA O DESENVOLVIMENTO DOS OBJETIVOS PROPOSTOS (PARA CADA AULA))
Métodos, sequências de atividades e procedimentos didáticos para alcançar os objetivos.

(RECURSOS/FERRAMENTAS)
Lista de materiais, equipamentos e ferramentas (físicas e digitais) necessárias.

(AVALIAÇÃO)
Instrumentos e critérios de avaliação, evidências esperadas e como registrar os resultados.

(OBSERVAÇÕES)
Observações pedagógicas, adaptações e orientações complementares.

(REFERÊNCIAS BIBLIOGRÁFICAS)
Obras de referência, livros didáticos, documentos curriculares e links de apoio.

Responda de forma direta e estruturada, utilizando exatamente os títulos entre parênteses acima para cada seção. Não use caracteres especiais markdown.

Proposta de planejamento:
{content}`;

/**
 * RELATÓRIO DE OCORRÊNCIA ESCOLAR
 */
const OCORRENCIA_PROMPT = `Você é um assistente escolar especializado em elaboração de relatos formais de ocorrência para mediação escolar e registro disciplinar.

Com base nos dados fornecidos abaixo, redija um RELATO FORMAL DE OCORRÊNCIA ESCOLAR completo, imparcial, respeitoso e pedagogicamente adequado para constar em prontuário ou livro de registro da escola.

Dados da Ocorrência:
- Professor(a) Relator(a): {nomeProf}
- Data do Fato: {data}
- Turno: {turno}
- Tipo de Ocorrência: {tipo}
- Nível de Gravidade: {gravidade}
- Necessita Encaminhamento (Gestão/Conselho/Responsáveis): {encaminhamento}

Instruções para a Redação:
1. Adote um tom estritamente profissional, técnico e objetivo, focando no relato dos fatos narrados.
2. Evite julgamentos de valor ou termos pejorativos.
3. Organize o relato em parágrafos claros: contextualização inicial, descrição detalhada dos fatos e medidas imediatas adotadas pelo professor.
4. Caso haja necessidade de encaminhamento, finalize recomendando a intervenção da Coordenação Pedagógica / Direção ou contato com os responsáveis.
5. Não utilize formatação markdown (sem negritos com asteriscos, sem títulos com hashtags). Entregue apenas o texto fluido e bem pontuado.

Descrição dos fatos relatados pelo professor:
{content}`;

/**
 * GERADOR DE ATIVIDADES E AVALIAÇÕES
 */
const ATIVIDADE_PROMPT = `Você é um especialista em elaboração de atividades pedagógicas, avaliações e listas de exercícios para a Educação Básica e Técnica.

Com base nas especificações fornecidas pelo professor, crie um instrumento pedagógico completo, pronto para ser impresso ou aplicado em sala.

Especificações:
- Disciplina/Componente: {disciplina}
- Turma/Ano: {turma}
- Tópico: {topico}

Instruções para a Elaboração:
1. Cabeçalho inicial formal contendo: Nome da Escola (Espaço para preencher), Nome do Aluno, Data, Turma e Professor.
2. Instruções claras de preenchimento para os estudantes.
3. Questões diversificadas (contextualizadas, conceituais e práticas).
4. Utilize texto limpo, legível e didático, sem marcações markdown especiais.

Conteúdo ou Tema Base da Atividade:
{content}`;

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function generatePrompt(
  type: GenerateType,
  content: string,
  context?: OcorrenciaContext | AtividadeContext | TecnicoContext
): string {
  switch (type) {
    case "tecnico": {
      const ctx = (context as TecnicoContext) || {};
      return TECNICO_EPT_PROMPT.replace("{nomeProf}", ctx.nomeProf || "Não informado")
        .replace("{turma}", ctx.turma || "Não informada")
        .replace("{disciplina}", ctx.disciplina || "Não informada")
        .replace("{bimestre}", ctx.bimestre || "1º")
        .replace("{semana}", ctx.semana || "Semana 01")
        .replace("{dataInicio}", ctx.dataInicio || "")
        .replace("{dataFim}", ctx.dataFim || "")
        .replace("{qtdAulas}", String(ctx.qtdAulas || 4))
        .replace("{usoLaboratorio}", ctx.usoLaboratorio ? "Sim (Laboratório Técnico)" : "Não (Sala Comum)")
        .replace("{content}", content || "");
    }
    case "planejamento":
      return PLANEJAMENTO_SEMANAL_PROMPT.replace("{content}", content || "");
    case "ocorrencia": {
      const ctx = (context as OcorrenciaContext) || {};
      return OCORRENCIA_PROMPT.replace("{nomeProf}", ctx.nomeProf || "Não informado")
        .replace("{data}", ctx.data || "Não informada")
        .replace("{turno}", ctx.turno || "Não informado")
        .replace("{tipo}", ctx.tipo || "Geral")
        .replace("{gravidade}", ctx.gravidade || "Leve")
        .replace("{encaminhamento}", ctx.encaminhamento ? "Sim" : "Não")
        .replace("{content}", content || "");
    }
    case "atividade": {
      const ctx = (context as AtividadeContext) || {};
      return ATIVIDADE_PROMPT.replace("{disciplina}", ctx.disciplina || "Geral")
        .replace("{turma}", ctx.turma || "Geral")
        .replace("{topico}", ctx.topico || "Tópico pedagógico")
        .replace("{content}", content || "");
    }
    default:
      return content || "";
  }
}

export function validateContent(content?: string, type?: GenerateType): string | null {
  if (type === "tecnico") return null;
  if (!content || content.trim().length < 10) {
    return "O conteúdo precisa ter no mínimo 10 caracteres.";
  }
  return null;
}

export function validateOcorrenciaContext(context: OcorrenciaContext): string | null {
  if (!context || !context.nomeProf || !context.data) {
    return "Nome do professor e data da ocorrência são obrigatórios.";
  }
  return null;
}

export function validateAtividadeContext(context: AtividadeContext): string | null {
  if (!context || !context.disciplina || !context.turma) {
    return "Disciplina e turma são obrigatórias.";
  }
  return null;
}

export function validateTecnicoContext(context: TecnicoContext): string | null {
  if (!context || !context.nomeProf || !context.disciplina || !context.turma) {
    return "Nome do professor, disciplina e turma são obrigatórios.";
  }
  return null;
}

export function generateTecnicoOfflineFallback(context: TecnicoContext, content: string): string {
  const labText = context.usoLaboratorio ? "Sim (Laboratório Técnico)" : "Não (Sala Comum)";
  return `(APRENDIZAGENS ESSENCIAIS (AE))
Dominar as habilidades técnicas e conceituais do componente ${context.disciplina} para a turma ${context.turma}, focando na aplicação prática dos conceitos.

(HABILIDADE PRIORIZADA/ HABILIDADES RELACIONADAS)
Desenvolver soluções de software e resolver problemas com autonomia, colaboração e persistência profissional.

(CONTEÚDOS/ DESCRITORES)
Tópicos técnicos e descritores curriculares:
${content || `Tópicos essenciais de ${context.disciplina}`}

(MATERIAL DIGITAL)
Slides institucionais EPT, documentações técnicas oficiais, repositórios de código e vídeos didáticos.

(OBJETIVOS ESPECÍFICOS)
- Compreender os fundamentos conceituais e teóricos da semana.
- Aplicar práticas de codificação ou projetos práticos.
- Avaliar os resultados e consolidar o aprendizado em equipe.

(ESTRATÉGIAS/ PROCEDIMENTOS PARA O DESENVOLVIMENTO DOS OBJETIVOS PROPOSTOS (PARA CADA AULA))
Aula 1: Acolhimento e apresentação teórica.
Aula 2: Desenvolvimento prático em ambiente EPT (Ambiente: ${labText}).
Aula 3: Resolução de exercícios e mentoria em grupo.
Aula 4: Avaliação formativa e consolidação técnica.

(RECURSOS/FERRAMENTAS)
Computadores, IDEs de desenvolvimento, bibliotecas de software e conexão com a internet.

(AVALIAÇÃO)
Avaliação contínua formativa baseada no progresso prático e entrega das atividades propostas.

(OBSERVAÇÕES)
Atendimento individualizado para alunos que necessitarem de suporte pedagógico adicional.

(REFERÊNCIAS BIBLIOGRÁFICAS)
Manuais oficiais da disciplina e documentação técnica de referência.`;
}
