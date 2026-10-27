import {questions,evaluateAnswers} from './quiz-model.mjs';

const root=document.querySelector('#quiz-root');
const answers=Array(questions.length).fill(null);
let current=-1;
const arrow='<svg class="icon" aria-hidden="true"><use href="#arrow"/></svg>';
const letter=index=>String.fromCharCode(65+index);

function focusPanel(){
  const heading=root.querySelector('h2');
  heading?.focus({preventScroll:true});
  if(matchMedia('(max-width: 900px)').matches){
    document.querySelector('#experience').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
  }
}
function showQuestion(index){
  current=index;
  const question=questions[index];
  root.innerHTML=`<section class="question-screen" aria-labelledby="question-title">
    <div class="progress-caption"><span>${question.topic}</span><span>Pergunta ${index+1} de ${questions.length}</span></div>
    <div class="progress-track" role="progressbar" aria-label="Progresso do quiz" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${index}" aria-valuetext="Pergunta ${index+1} de 6"><span style="width:${index/questions.length*100}%"></span></div>
    <h2 id="question-title" tabindex="-1">${question.title}</h2>
    <form id="question-form">
      <fieldset aria-labelledby="question-title"><legend class="sr-only">${question.title}</legend>
      ${question.options.map((option,optionIndex)=>`<label class="option"><input type="radio" name="answer" value="${optionIndex}" required ${answers[index]===optionIndex?'checked':''}><span class="option-letter" aria-hidden="true">${letter(optionIndex)}</span><span class="option-text">${option}</span><span class="option-check" aria-hidden="true"><svg class="icon"><use href="#check"/></svg></span></label>`).join('')}
      </fieldset>
      <div class="question-nav"><button class="back-button" type="button" id="previous">${arrow} Voltar</button><button class="primary-button next-button" type="submit" ${answers[index]===null?'disabled':''}>${index===questions.length-1?'Ver meu resultado':'Continuar'} ${arrow}</button></div>
    </form>
    <p class="small-note">Escolha a opção que mais se aproxima do seu momento.</p>
  </section>`;
  const form=root.querySelector('#question-form');
  form.addEventListener('change',()=>{
    const checked=form.querySelector('input:checked');
    if(checked){answers[index]=Number(checked.value);form.querySelector('[type=submit]').disabled=false;}
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(answers[index]===null)return;
    if(index<questions.length-1)showQuestion(index+1);else showResult();
  });
  root.querySelector('#previous').addEventListener('click',()=>index===0?showWelcome():showQuestion(index-1));
  focusPanel();
}
const welcome=root.innerHTML;
function showWelcome(){
  current=-1;root.innerHTML=welcome;bindStart();focusPanel();
}
function bindStart(){root.querySelector('#start-quiz').addEventListener('click',()=>showQuestion(0));}
function showResult(){
  current=questions.length;
  const result=evaluateAnswers(answers);
  const roadshowUrl=new URL('roadshow.html',window.location.href);
  roadshowUrl.searchParams.set('utm_source','quiz');
  roadshowUrl.searchParams.set('utm_medium','resultado');
  roadshowUrl.searchParams.set('utm_campaign','roadshow_pan_am');
  roadshowUrl.searchParams.set('utm_content',result.profile);
  roadshowUrl.hash='inscricao';
  root.innerHTML=`<section class="result-screen" aria-labelledby="result-title">
    <div class="result-eyebrow"><span class="result-check" aria-hidden="true"><svg class="icon"><use href="#check"/></svg></span><span>Seu momento: ${result.label}</span></div>
    <h2 id="result-title" tabindex="-1">${result.title}</h2>
    <p class="result-description">${result.description}</p>
    <h3 class="priorities-title">Três pontos para organizar agora</h3>
    <ol class="priorities">${result.priorities.map((item,index)=>`<li><span class="priority-number" aria-hidden="true">0${index+1}</span><div><h4>${item.title}</h4><p>${item.text}</p></div></li>`).join('')}</ol>
    <div class="roadshow-invitation"><div class="invitation-label">Roadshow Pan Am</div><p>Conheça a proposta da Pan Am, entenda o papel do ATP-CTP e leve suas dúvidas para o encontro.</p><span class="invitation-date">12 de novembro · 19h30 às 21h · Horário de Brasília</span><span class="invitation-language">Apresentação em inglês · 45 minutos para perguntas e respostas</span><a class="primary-button" id="result-cta" href="${roadshowUrl.href}">Quero participar do Roadshow ${arrow}</a></div>
    <p class="result-scope">Este quiz orienta o planejamento e não confirma elegibilidade para o ATP ou para o treinamento. Os requisitos precisam de análise individual. <a href="https://www.faa.gov/pilots/training/atp" target="_blank" rel="noopener noreferrer">Sobre o ATP-CTP na FAA ${arrow}</a></p>
    <div class="result-actions"><button type="button" class="text-button" id="review">Revisar minhas respostas</button><button type="button" class="text-button" id="restart">Refazer o quiz</button></div>
  </section>`;
  root.querySelector('#review').addEventListener('click',()=>showQuestion(0));
  root.querySelector('#restart').addEventListener('click',()=>{answers.fill(null);showQuestion(0);});
  focusPanel();
}
bindStart();
