export const questions = [
  { id: 'momento', topic: 'Seu ponto de partida', title: 'Qual é o seu momento na aviação?', options: [
    'Já atuo como piloto profissional.',
    'Tenho licença e estou construindo experiência.',
    'Estou em formação.',
    'Ainda estou conhecendo esse caminho.'
  ]},
  { id: 'objetivo', topic: 'Seu objetivo', title: 'O ATP da FAA faz parte dos seus objetivos de carreira?', options: [
    'Sim. Sei por que essa certificação faz sentido para mim.',
    'É uma possibilidade, mas ainda estou comparando caminhos.',
    'Ainda preciso entender melhor essa certificação.'
  ]},
  { id: 'atp', topic: 'O papel do treinamento', title: 'Você sabe onde o ATP-CTP entra nesse caminho?', options: [
    'Sim. Entendo sua função antes da prova teórica do ATP multimotor.',
    'Já ouvi falar, mas ainda tenho dúvidas sobre o curso.',
    'Ainda não conheço o ATP-CTP.'
  ]},
  { id: 'plano', topic: 'A organização do plano', title: 'O que você já levantou sobre o treinamento?', options: [
    'Pré-requisitos, investimento e disponibilidade para realizá-lo.',
    'Tenho parte dessas informações, mas faltam detalhes.',
    'Ainda preciso levantar essas informações.'
  ]},
  { id: 'ingles', topic: 'O inglês no seu planejamento', title: 'Como você se sente ao acompanhar uma apresentação técnica em inglês?', options: [
    'Consigo acompanhar e entender o conteúdo.',
    'Consigo acompanhar parte, mas ainda tenho dificuldades.',
    'Preciso desenvolver meu inglês para acompanhar.'
  ]},
  { id: 'prazo', topic: 'Seu próximo passo', title: 'Quando você quer organizar os próximos passos desse plano?', options: [
    'Quero começar a definir os próximos passos agora.',
    'Pretendo me organizar nos próximos meses.',
    'Estou pesquisando, ainda sem um prazo definido.'
  ]}
];

export const profiles = {
  explorar: {
    label: 'Explorando o caminho',
    title: 'Seu próximo passo é entender o caminho.',
    description: 'Você ainda está reunindo informações para decidir como a certificação americana se encaixa na sua trajetória. Comece esclarecendo o objetivo e as etapas envolvidas.'
  },
  organizar: {
    label: 'Organizando o plano',
    title: 'É hora de conectar as informações ao seu objetivo.',
    description: 'Você já começou a pensar nesse caminho. Agora, vale transformar o que sabe em um plano com prioridades, dúvidas e próximos passos bem definidos.'
  },
  conversar: {
    label: 'Preparando a conversa',
    title: 'Você já tem uma boa base para aprofundar a conversa.',
    description: 'Seu objetivo e parte do planejamento já estão mais claros. O próximo passo é conferir os detalhes do seu caso com a EPA e entender a proposta de treinamento da Pan Am.'
  }
};

export function evaluateAnswers(answers) {
  if (!Array.isArray(answers) || answers.length !== questions.length || [...answers].some((value,index) => !Number.isInteger(value) || value < 0 || value >= questions[index].options.length)) {
    throw new Error('Responda às seis perguntas para ver o resultado.');
  }
  const [momento,objetivo,atp,plano,ingles,prazo] = answers;
  // Editorial self-assessment of planning only: no eligibility, licensing or hiring decision.
  const score = [objetivo,atp,plano,prazo].reduce((sum,value)=>sum+2-value,0);
  let profile = score <= 2 ? 'explorar' : 'organizar';
  if(score >= 6 && objetivo === 0 && atp <= 1 && plano <= 1 && prazo <= 1 && momento <= 1) profile='conversar';
  const priorities=[];
  if(momento >= 2) priorities.push({title:'Conecte esse objetivo à sua formação.',text:'Conte à EPA em que etapa você está e peça orientação sobre a sequência de formação e experiência a considerar.'});
  else if(objetivo > 0) priorities.push({title:'Esclareça o papel do ATP na sua carreira.',text:'Leve seus objetivos para a conversa e entenda se essa certificação é o caminho que você pretende construir.'});
  else priorities.push({title:'Organize as informações sobre o seu caso.',text:'Reúna suas licenças, habilitações e registros de experiência para uma avaliação individual dos pré-requisitos.'});
  if(atp > 0) priorities.push({title:'Entenda onde entra o ATP-CTP.',text:'O curso antecede a prova teórica do ATP multimotor. Esclareça a função dessa etapa e o que ainda será necessário para a certificação.'});
  else if(plano > 0) priorities.push({title:'Complete as informações do planejamento.',text:'Liste o que falta confirmar sobre pré-requisitos, investimento, agenda e organização do treinamento.'});
  else priorities.push({title:'Confira os detalhes antes de avançar.',text:'Valide com a EPA os pré-requisitos, a inscrição e o agendamento adequados ao seu planejamento.'});
  if(ingles > 0) priorities.push({title:'Inclua o inglês entre as suas prioridades.',text:'A apresentação do Roadshow será em inglês. Considere seu conforto com o idioma ao se preparar para acompanhar o encontro.'});
  else if(prazo === 2) priorities.push({title:'Defina o que precisa saber para escolher um prazo.',text:'Separe as dúvidas que impedem sua decisão e use a conversa para organizar um próximo passo possível.'});
  else priorities.push({title:'Prepare as perguntas que fazem diferença para você.',text:'Leve ao Roadshow suas dúvidas sobre o curso, pré-requisitos, organização do treinamento e próximos passos.'});
  return {profile,...profiles[profile],priorities,englishAttention:ingles>0};
}
