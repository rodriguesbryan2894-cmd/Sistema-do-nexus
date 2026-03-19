let player='', playersData={}, allItems=[
  {nome:"Cadeado Negro",desc:"Permite recusar missão de alerta vermelho uma vez",img:"https://i.imgur.com/3J6E43G.png"},
  {nome:"Chave Negra",desc:"Desbloqueia recusa de alertas especiais",img:"https://i.imgur.com/QlwnEDn.png"},
  {nome:"Coração do Amor",desc:"Mostra quanto uma pessoa gosta de você",img:"https://i.imgur.com/aZ0UtzM.png"},
  {nome:"Chave de Títulos",desc:"Permite mudar título do player, exceto Bobo da Corte e Apóstolo do Jester",img:"https://i.imgur.com/T7K0U9T.png"}
];

// LOGIN
document.getElementById('loginBtn').addEventListener('click',()=>{
    const nameInput=document.getElementById('playerName').value.trim();
    if(!nameInput){alert("Digite um nome!"); return;}
    player=nameInput;

    if(!playersData[player]){
        let permanentTitle=null;
        if(player.toLowerCase()==='nexus') permanentTitle="Apóstolo do Jester";
        if(player.toLowerCase()==='joão vitor') permanentTitle="Bobo da Corte";
        playersData[player]={
            level:1,xp:0,title:permanentTitle||"Iniciante",permanentTitle:permanentTitle||null,
            stats:{Força:10,Agilidade:10,Defesa:10,Resistência:10,Inteligência:10},
            missionActive:null,inventory:[],wishCount:0,divinePoints:0
        };
    }

    document.getElementById('loginPanel').style.display='none';
    document.querySelectorAll('.panel').forEach(p=>p.style.display='block');
    updateCharacter();
    addChat(`Bem-vindo, ${player}!`);
    startMissions();
});

// FUNÇÕES PRINCIPAIS
function updateCharacter(){
    const pdata=playersData[player];
    document.getElementById('charName').innerText=`Player: ${player}`;
    document.getElementById('level').innerText=pdata.level;
    document.getElementById('xp').innerText=pdata.xp;
    document.getElementById('xpNeeded').innerText=50+pdata.level*20;
    document.getElementById('title').innerText=pdata.permanentTitle?pdata.permanentTitle:pdata.title;
    document.getElementById('attributes').innerText=`Força: ${pdata.stats.Força} | Agilidade: ${pdata.stats.Agilidade} | Defesa: ${pdata.stats.Defesa} | Resistência: ${pdata.stats.Resistência} | Inteligência: ${pdata.stats.Inteligência}`;
    document.getElementById('activeMission').innerText=pdata.missionActive?`Missão Ativa: ${pdata.missionActive.name}`:'Missão Ativa: Nenhuma';
    renderInventory();
}

function addChat(msg){
    const p=document.createElement('p'); p.innerText=msg;
    document.getElementById('chatMessages').appendChild(p);
    document.getElementById('chatMessages').scrollTop=document.getElementById('chatMessages').scrollHeight;
}

// INVENTÁRIO
function renderInventory(){
    const container=document.getElementById('inventoryList'); container.innerHTML='';
    playersData[player].inventory.forEach(it=>{
        const li=document.createElement('li');
        li.innerHTML=`<img src='${it.img}'> ${it.nome}`;
        li.onclick=()=>showItem(it);
        container.appendChild(li);
    });
}

function showItem(item){
    document.getElementById('itemImg').src=item.img;
    document.getElementById('itemTitle').innerText=item.nome;
    document.getElementById('itemDesc').innerText=item.desc;
    document.getElementById('itemPopup').style.display='block';
}

function closeItemPopup(){document.getElementById('itemPopup').style.display='none';}

// DESEJOS
document.getElementById('requestWishBtn').addEventListener('click',()=>{
  const wishText=document.getElementById('wishText').value.trim();
  if(!wishText){alert('Digite um desejo'); return;}
  addChat(`💫 Desejo solicitado: ${wishText}. As Constelações avaliarão em até 2 minutos.`);
});

// MISSÕES
function startMissions(){
    generateMission();
    setInterval(()=>{if(!playersData[player].missionActive) generateMission();},Math.floor(Math.random()*50000)+1000);
}

function generateMission(){
    const pdata=playersData[player];
    if(pdata.missionActive) return;
    const missions=[
        {name:"Estudar Matemática 30min",reward:10,attr:{Inteligência:5},time:30,rank:"B",item:allItems[1],type:'normal'},
        {name:"Treino de Força",reward:12,attr:{Força:5},time:25,rank:"A",item:allItems[2],type:'normal'},
        {name:"Resumo de Biologia",reward:12,attr:{Inteligência:6},time:25,rank:"A",item:allItems[3],type:'normal'},
        {name:"Missão Sapecagem: Flertar na sala",reward:5,attr:{Agilidade:2},time:15,rank:"C",item:allItems[0],type:'sapecagem'}
    ];
    const mission=missions[Math.floor(Math.random()*missions.length)];
    pdata.missionActive=mission;
    showMissionPopup(mission);
    addChat(`🌟 Nova missão: "${mission.name}" Rank: ${mission.rank}`);
    updateCharacter();
}

// POPUP MISSÕES
function showMissionPopup(mission){
    const popup=document.getElementById('missionPopup');
    document.getElementById('missionPopupName').innerText=mission.name;
    document.getElementById('missionPopupDetails').innerText=`Recompensa XP: ${mission.reward} | Tempo: ${mission.time} seg | Tipo: ${mission.type} | Item: ${mission.item.nome} - ${mission.item.desc}`;
    popup.style.display='block';
    popup.style.transform='translate(-50%, -50%) scale(1)';
    document.getElementById('acceptMissionBtn').style.display='inline-block';
    document.getElementById('recuseMissionBtn').style.display=mission.type==='alert'?'none':'inline-block';
    document.getElementById('finalizeMissionBtn').style.display='none';
}

function aceitarMission(){
    const popup=document.getElementById('missionPopup');
    popup.style.transform='translate(-50%, -50%) scale(0.8)';
    document.getElementById('acceptMissionBtn').style.display='none';
    document.getElementById('recuseMissionBtn').style.display='none';
    document.getElementById('finalizeMissionBtn').style.display='inline-block';
    addChat(`✅ Missão aceita: ${playersData[player].missionActive.name}`);
}

function recusarMission(){
    playersData[player].missionActive=null;
    document.getElementById('missionPopup').style.display='none';
    addChat(`❌ Missão recusada.`);
    updateCharacter();
}

function finalizarMission(){
    const pdata=playersData[player];
    if(!pdata.missionActive) return;
    pdata.xp+=pdata.missionActive.reward;
    for(const attr in pdata.missionActive.attr){ pdata.stats[attr]+=pdata.missionActive.attr[attr];}
    addChat(`🏆 Missão finalizada: ${pdata.missionActive.name}. Ganhou ${pdata.missionActive.reward} XP e atributos.`);
    pdata.inventory.push(pdata.missionActive.item);
    pdata.missionActive=null;
    document.getElementById('missionPopup').style.display='none';
    updateCharacter();
}

// ENVIO DE MISSÕES
document.getElementById('sendMissionBtn').addEventListener('click',()=>{
  const target=document.getElementById('sendPlayer').value.trim();
  const name=document.getElementById('sendMissionName').value.trim();
  const diff=document.getElementById('sendDifficulty').value;
  const reward=parseInt(document.getElementById('sendReward').value);
  const penalty=document.getElementById('sendPenalty').value;
  const time=parseInt(document.getElementById('sendTime').value);

  if(!target || !name || !diff || isNaN(reward) || !penalty || isNaN(time)){ alert("Preencha todos os campos corretamente!"); return; }
  if(!playersData[target]){ alert("Jogador não encontrado."); return; }

  const mission={name:name,rank:diff,reward:reward,penalty:penalty,time:time,item:allItems[Math.floor(Math.random()*allItems.length)],type:'normal'};
  playersData[target].missionActive=mission;
  addChat(`🌟 Missão enviada para ${target}: "${name}" Rank: ${diff}`);
});
