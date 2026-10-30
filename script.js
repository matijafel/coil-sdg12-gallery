const titles=["Ponovna uporaba", "Ločevanje odpadkov", "Manj plastike", "Varčevanje z vodo", "Premišljeni nakupi", "Popravilo izdelkov", "Lokalna hrana", "Manj zavržene hrane", "Trajnostna embalaža", "Izmenjava oblačil", "Varčevanje z energijo", "Krožno gospodarstvo"];
const images=Array.from({length:12},(_,i)=>({src:`slike/slika${i+1}.jpg`,title:titles[i]}));
const gallery=document.querySelector('#gallery');
const viewer=document.querySelector('#viewer');
const large=document.querySelector('#large');
const caption=document.querySelector('#caption');
images.forEach(({src,title},i)=>{
 const card=document.createElement('article');card.className='photo-card';
 const open=document.createElement('button');open.className='photo-open';open.setAttribute('aria-label',`Povečaj ${title}`);
 const img=document.createElement('img');img.src=src;img.alt=title;img.loading=i<4?'eager':'lazy';
 const label=document.createElement('span');label.className='photo-title';label.textContent=title;
 open.append(img,label);open.addEventListener('click',()=>{large.src=src;large.alt=title;caption.textContent=title;viewer.showModal()});
 card.append(open);gallery.append(card);
});
document.querySelector('#close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});
document.querySelector('#year').textContent=new Date().getFullYear();
const questions = [
  {q:'Kaj je najboljša izbira, če je tvoja steklenica še uporabna?', options:['Kupi novo vsak teden','Uporabljaj jo še naprej','Vrzi jo med mešane odpadke'], correct:1, why:'Ponovna uporaba zmanjša količino odpadkov.'},
  {q:'Kako lahko zmanjšaš količino zavržene hrane?', options:['Načrtuješ obroke in porabiš ostanke','Vedno kupiš več, kot potrebuješ','Hrano zavržeš takoj po nakupu'], correct:0, why:'Načrtovanje nakupov pomaga preprečevati odpadno hrano.'},
  {q:'Kaj pomeni odgovorna poraba?', options:['Kupujemo čim več','Izberemo le najcenejše izdelke','Kupujemo premišljeno in zmanjšujemo odpadke'], correct:2, why:'Pomembno je, da izdelke uporabljamo smiselno in čim dlje.'},
  {q:'Kaj lahko narediš z oblačilom, ki ti ni več prav?', options:['Vržeš ga v naravo','Podariš ali zamenjaš','Takoj kupiš tri nova'], correct:1, why:'Izmenjava in podarjanje podaljšata življenjsko dobo oblačil.'},
  {q:'Kaj je primer krožnega gospodarstva?', options:['Popravilo pokvarjenega izdelka','Odmetavanje delujočih stvari','Uporaba izdelka samo enkrat'], correct:0, why:'Popravljanje omogoča daljšo uporabo izdelkov in varčevanje z viri.'}
];
let current=0,score=0,answered=false;
const qEl=document.querySelector('#quiz-question'),optionsEl=document.querySelector('#quiz-options'),feedbackEl=document.querySelector('#quiz-feedback'),nextEl=document.querySelector('#quiz-next'),progressEl=document.querySelector('#quiz-progress');
function showQuestion(){answered=false;nextEl.hidden=true;feedbackEl.textContent='';const q=questions[current];progressEl.textContent=`Vprašanje ${current+1} od ${questions.length}`;qEl.textContent=q.q;optionsEl.replaceChildren();q.options.forEach((answer,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='quiz-option';btn.textContent=answer;btn.addEventListener('click',()=>choose(i));optionsEl.append(btn)})}
function choose(i){if(answered)return;answered=true;const q=questions[current];if(i===q.correct)score++;[...optionsEl.children].forEach((btn,j)=>{btn.disabled=true;if(j===q.correct)btn.classList.add('correct');else if(j===i)btn.classList.add('incorrect')});feedbackEl.textContent=(i===q.correct?'Pravilno! ':'Ni čisto pravilno. ')+q.why;nextEl.hidden=false;nextEl.textContent=current===questions.length-1?'Poglej rezultat →':'Naslednje vprašanje →'}
nextEl.addEventListener('click',()=>{if(current<questions.length-1){current++;showQuestion()}else{progressEl.textContent='Konec kviza';qEl.textContent=`Dosegel/-la si ${score} od ${questions.length} točk!`;optionsEl.replaceChildren();feedbackEl.textContent='Vsaka premišljena odločitev šteje. ♻️';nextEl.textContent='↻ Poskusi znova';nextEl.onclick=()=>{nextEl.onclick=null;current=0;score=0;showQuestion()}}});
showQuestion();
