import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LayoutDashboard,Users,WalletCards,ArrowLeftRight,ReceiptText,Plus,Search,Calculator,Settings} from 'lucide-react';
import './style.css';

const money=n=>new Intl.NumberFormat('uz-UZ').format(Math.round(n))+' so‘m';
const seedCustomers=[
 {id:1,name:'Ali Karimov',phone:'+998 90 123 45 67',loan:10000000,months:3},
 {id:2,name:'Sardor Akmalov',phone:'+998 91 222 33 44',loan:5000000,months:2},
 {id:3,name:'Dilshod Ergashev',phone:'+998 93 555 66 77',loan:0,months:0}
];

function App(){
 const [page,setPage]=useState('Dashboard');
 const [customers,setCustomers]=useState(seedCustomers);
 const [rate,setRate]=useState(20);
 const [modal,setModal]=useState(null);
 const [search,setSearch]=useState('');
 const [amount,setAmount]=useState(10000000);
 const [months,setMonths]=useState(3);
 const totalLent=customers.reduce((s,c)=>s+c.loan,0);
 const result=useMemo(()=>amount*Math.pow(1+rate/100,months),[amount,rate,months]);

 const addCustomer=e=>{
   e.preventDefault(); const f=new FormData(e.currentTarget);
   setCustomers([...customers,{id:Date.now(),name:f.get('name'),phone:f.get('phone'),loan:0,months:0}]);
   setModal(null);
 };
 const giveLoan=e=>{
   e.preventDefault(); const f=new FormData(e.currentTarget), id=Number(f.get('id')), a=Number(f.get('amount')), m=Number(f.get('months'));
   setCustomers(customers.map(c=>c.id===id?{...c,loan:c.loan+a,months:m}:c)); setModal(null);
 };
 const filtered=customers.filter(c=>(c.name+' '+c.phone).toLowerCase().includes(search.toLowerCase()));

 return <div className="app">
  <aside>
   <div className="logo"><span>I</span> BANK</div>
   {['Dashboard','Mijozlar','Kreditlar','Valyuta','Tranzaksiyalar','Hisobotlar'].map(x=>
    <button className={page===x?'active':''} onClick={()=>setPage(x)} key={x}>{x==='Dashboard'?<LayoutDashboard/>:x==='Mijozlar'?<Users/>:x==='Kreditlar'?<WalletCards/>:x==='Valyuta'?<ArrowLeftRight/>:x==='Tranzaksiyalar'?<ReceiptText/>:<Calculator/>}{x}</button>)}
   <button onClick={()=>setPage('Sozlamalar')}><Settings/>Sozlamalar</button>
  </aside>
  <main>
   <header><div><h1>{page}</h1><p>I BANK moliyaviy boshqaruv tizimi</p></div><button className="primary" onClick={()=>setModal('customer')}><Plus/> Mijoz qo‘shish</button></header>

   {page==='Dashboard' && <><section className="cards">
    <Card title="Kassadagi pul" value={money(100000000-totalLent)} />
    <Card title="Berilgan kreditlar" value={money(totalLent)}/>
    <Card title="Kutilayotgan summa" value={money(customers.reduce((s,c)=>s+c.loan*Math.pow(1+rate/100,c.months),0))}/>
    <Card title="Oylik foiz" value={rate+'%'}/>
   </section><section className="panel"><h2>Tezkor amallar</h2><div className="actions"><button onClick={()=>setModal('loan')}><WalletCards/> Kredit berish</button><button onClick={()=>setPage('Mijozlar')}><Users/> Mijozlar</button><button onClick={()=>setPage('Valyuta')}><ArrowLeftRight/> Valyuta ayirboshlash</button></div></section></>}

   {page==='Mijozlar' && <section className="panel"><div className="toolbar"><div className="search"><Search/><input placeholder="Mijoz qidirish..." value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="primary" onClick={()=>setModal('customer')}><Plus/> Qo‘shish</button></div>
   <table><thead><tr><th>Ism</th><th>Telefon</th><th>Kredit</th><th>Muddat</th><th>Holat</th></tr></thead><tbody>{filtered.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.phone}</td><td>{money(c.loan)}</td><td>{c.months?c.months+' oy':'—'}</td><td><span className="badge">{c.loan?'Faol':'Kreditsiz'}</span></td></tr>)}</tbody></table></section>}

   {page==='Kreditlar' && <section className="panel"><div className="toolbar"><h2>Faol kreditlar</h2><button className="primary" onClick={()=>setModal('loan')}><Plus/> Kredit berish</button></div><table><thead><tr><th>Mijoz</th><th>Asosiy qarz</th><th>Muddat</th><th>{rate}% bilan</th></tr></thead><tbody>{customers.filter(c=>c.loan).map(c=><tr key={c.id}><td>{c.name}</td><td>{money(c.loan)}</td><td>{c.months} oy</td><td>{money(c.loan*Math.pow(1+rate/100,c.months))}</td></tr>)}</tbody></table></section>}

   {page==='Valyuta' && <section className="panel"><h2>Valyuta ayirboshlash</h2><div className="formgrid"><label>Valyuta<select><option>USD</option><option>EUR</option><option>RUB</option></select></label><label>Miqdor<input type="number" placeholder="100"/></label><label>Kurs<input type="number" placeholder="12500"/></label></div><button className="primary">Hisoblash</button></section>}
   {page==='Tranzaksiyalar' && <section className="panel"><h2>Tranzaksiyalar</h2><p className="muted">Hozircha demo ma’lumotlar mavjud.</p></section>}
   {page==='Hisobotlar' && <section className="panel"><h2>Hisobotlar</h2><div className="report"><b>Berilgan kreditlar</b><strong>{money(totalLent)}</strong></div><div className="report"><b>Foiz stavkasi</b><strong>{rate}% / oy</strong></div></section>}
   {page==='Sozlamalar' && <section className="panel"><h2>Kredit sozlamalari</h2><label>Oylik foiz (%)<input type="number" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label><p className="muted">Hisoblash: yakuniy summa = asosiy qarz × (1 + foiz)^oy.</p></section>}
   {page==='Dashboard' && <section className="panel"><h2>Kredit kalkulyatori</h2><div className="formgrid"><label>Summa<input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label><label>Oy<input type="number" value={months} onChange={e=>setMonths(Number(e.target.value))}/></label><label>Foiz<input type="number" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label></div><div className="calc">{money(result)}</div></section>}

   {modal==='customer' && <Modal title="Yangi mijoz" close={()=>setModal(null)}><form onSubmit={addCustomer}><label>Ism<input name="name" required/></label><label>Telefon<input name="phone" required/></label><button className="primary">Saqlash</button></form></Modal>}
   {modal==='loan' && <Modal title="Kredit berish" close={()=>setModal(null)}><form onSubmit={giveLoan}><label>Mijoz<select name="id">{customers.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label>Summa<input name="amount" type="number" defaultValue="1000000" required/></label><label>Muddat (oy)<input name="months" type="number" defaultValue="1" min="1" required/></label><p className="muted">Joriy oylik foiz: {rate}%</p><button className="primary">Kreditni rasmiylashtirish</button></form></Modal>}
  </main>
 </div>
}
function Card({title,value}){return <div className="card"><span>{title}</span><b>{value}</b></div>}
function Modal({title,close,children}){return <div className="overlay"><div className="modal"><div className="modalhead"><h2>{title}</h2><button onClick={close}>×</button></div>{children}</div></div>}
createRoot(document.getElementById('root')).render(<App/>);