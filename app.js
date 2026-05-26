const key='basket_clash_v1';
const state=JSON.parse(localStorage.getItem(key)||'{"players":[],"matches":[],"bets":[],"chat":[]}');
const save=()=>localStorage.setItem(key,JSON.stringify(state));
const qs=(s)=>document.querySelector(s);
const byId=(id)=>document.getElementById(id);

function render(){
  byId('statsPlayer').innerHTML=state.players.map((p,i)=>`<option value="${i}">${p.name} (${p.team})</option>`).join('');
  const rows=state.players.map((p,i)=>({i,pts:p.shots*2+p.assists*2+p.rebounds+p.blocks*3,...p})).sort((a,b)=>b.pts-a.pts);
  byId('rankingTable').innerHTML=`<table><tr><th>Rank</th><th>Παίκτης</th><th>Ομάδα</th><th>Shots</th><th>Assists</th><th>Rebounds</th><th>Blocks</th><th>Σύνολο</th></tr>${rows.map((r,idx)=>`<tr><td>${idx+1}</td><td>${r.name}</td><td>${r.team}</td><td>${r.shots||0}</td><td>${r.assists||0}</td><td>${r.rebounds||0}</td><td>${r.blocks||0}</td><td>${r.pts}</td></tr>`).join('')}</table>`;
  byId('scoreMatch').innerHTML=state.matches.map((m,i)=>`<option value="${i}">${m.date} ${m.time} - ${m.court}</option>`).join('');
  byId('betMatch').innerHTML='<option value="">--</option>'+state.matches.map((m,i)=>`<option value="${i}">${m.date} ${m.time}</option>`).join('');
  byId('matchesTable').innerHTML=`<table><tr><th>Ημερομηνία</th><th>Ώρα</th><th>Γήπεδο</th><th>Σκορ</th><th>Κατάσταση</th></tr>${state.matches.map(m=>`<tr><td>${m.date}</td><td>${m.time}</td><td>${m.court}</td><td>${m.home??'-'} - ${m.away??'-'}</td><td>${m.home==null?'Scheduled':'Final'}</td></tr>`).join('')}</table>`;
  byId('betsTable').innerHTML=`<table><tr><th>Αγορά</th><th>Πρόβλεψη</th><th>Stake</th><th>Payout</th></tr>${state.bets.map(b=>`<tr><td>${b.market}</td><td>${b.prediction}</td><td>€${b.stake}</td><td>€${(b.stake*1.8).toFixed(2)}</td></tr>`).join('')}</table>`;
  byId('chatList').innerHTML=state.chat.map(c=>`<p><b>${c.user}:</b> ${c.msg}</p>`).join('');
  const finals=state.matches.filter(m=>m.home!=null&&m.away!=null);byId('insTotal').textContent=finals.length;
  byId('insHome').textContent=finals.filter(m=>m.home>m.away).length;byId('insAway').textContent=finals.filter(m=>m.away>m.home).length;
  byId('insAvg').textContent=finals.length?(finals.reduce((a,m)=>a+m.home+m.away,0)/finals.length).toFixed(1):'0'; save();
}
qs('#memberForm').onsubmit=e=>{e.preventDefault();const name=byId('memberName').value.trim();if(!name)return;state.players.push({team:byId('memberTeam').value,name,shots:0,assists:0,rebounds:0,blocks:0});byId('memberName').value='';render();};
qs('#statsForm').onsubmit=e=>{e.preventDefault();if(byId('statsPass').value!=='4081')return alert('Λάθος κωδικός');const p=state.players[+byId('statsPlayer').value];if(!p)return;['shots','assists','rebounds','blocks'].forEach(k=>p[k]=+byId(k).value||0);render();};
qs('#matchForm').onsubmit=e=>{e.preventDefault();state.matches.push({date:byId('matchDate').value,time:byId('matchTime').value,court:byId('matchCourt').value,home:null,away:null});render();};
qs('#scoreForm').onsubmit=e=>{e.preventDefault();const m=state.matches[+byId('scoreMatch').value];if(!m)return;m.home=+byId('scoreHome').value;m.away=+byId('scoreAway').value;render();};
qs('#betForm').onsubmit=e=>{e.preventDefault();const stake=+byId('betStake').value;if(stake<1||stake>100)return alert('Stake 1-100');state.bets.push({market:byId('betMarket').value,prediction:byId('betPrediction').value,stake});render();};
qs('#chatForm').onsubmit=e=>{e.preventDefault();const user=byId('chatUser').value.trim(),msg=byId('chatMsg').value.trim();if(!user||!msg)return;state.chat.push({user,msg});byId('chatMsg').value='';render();};
render();
