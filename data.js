/* Sourced catalog snapshot + Vertex planning allowances; not a stock feed. */
window.Vertex = (() => {
 const imported=window.VertexImported;
 const catalog={cpu:imported.cpu,gpu:imported.gpu,memory:imported.memory,
 storage:[['1TB NVMe SSD',64,{drives:1}],['2TB NVMe SSD',115,{drives:1}],['4TB NVMe SSD',230,{drives:1}],['8TB NVMe SSD',650,{drives:1}],['16TB NVMe storage (2 × 8TB)',1200,{drives:2}]],
 case:[['Airflow mid-tower · black',70,{length:320,radiator:240,size:1,color:'black'}],['Panoramic mid-tower · black',130,{length:380,radiator:360,size:1,color:'black'}],['MAX showcase full-tower · black',250,{length:420,radiator:420,size:1.12,color:'black'}],['Premium showcase full-tower · white',420,{length:420,radiator:420,size:1.12,color:'white'}]],
 cooling:[['Tower air cooler',30,{level:0,radiator:0}],['Dual-tower air cooler',60,{level:1,radiator:0}],['240mm liquid cooler',120,{level:2,radiator:240}],['360mm liquid cooler with display',240,{level:3,radiator:360}],['Custom CPU liquid loop · 360mm',500,{level:3,radiator:360}]],
 psu:[['650W 80+ Gold',75,{watts:650}],['750W 80+ Gold',100,{watts:750}],['850W 80+ Gold',130,{watts:850}],['1000W ATX 3.1 80+ Platinum',220,{watts:1000}],['1600W ATX 3.1 80+ Titanium',350,{watts:1600}]],
 os:[['No OS installed',0,{}],['Windows 11 Home',120,{}],['Windows 11 Pro',180,{}]],
 rgb:[['No lighting',0,{}],['Vertex red lighting',20,{}],['Addressable RGB',40,{}],['Premium RGB fans + light strips',90,{}]],
 motherboard:[['Essential motherboard + assembly',150,{grade:0}],['Performance motherboard + assembly',250,{grade:1}],['Enthusiast motherboard + assembly',450,{grade:2}],['Flagship motherboard + assembly',600,{grade:3}]]};
 const labels={cpu:'Processor',gpu:'Graphics card',memory:'Memory kit',storage:'Storage',case:'Case',cooling:'Cooling',psu:'Power supply',os:'Operating system',rgb:'Lighting',motherboard:'Motherboard & assembly'};
 const tiers={
 core:{name:'Core',resolution:'1080p',goal:60,budget:1000,parts:{cpu:0,gpu:12,memory:0,storage:0,case:0,cooling:0,psu:0,os:0,rgb:0,motherboard:0}},
 pro:{name:'Pro',resolution:'1440p',goal:144,budget:2000,parts:{cpu:4,gpu:5,memory:1,storage:1,case:1,cooling:1,psu:1,os:1,rgb:1,motherboard:0}},
 ultra:{name:'Ultra',resolution:'4K',goal:144,budget:3000,parts:{cpu:5,gpu:7,memory:2,storage:2,case:2,cooling:3,psu:3,os:1,rgb:2,motherboard:1}},
 max:{name:'MAX',resolution:'4K',goal:240,budget:4500,parts:{cpu:8,gpu:8,memory:2,storage:2,case:2,cooling:3,psu:3,os:1,rgb:2,motherboard:2}}};
 const maxed={cpu:8,gpu:10,memory:9,storage:4,case:3,cooling:4,psu:4,os:2,rgb:3,motherboard:3};
 const games={'Call of Duty':[240,180,100],Fortnite:[300,240,140],'Cyberpunk 2077':[180,130,80],'Minecraft RTX':[200,160,100],Valorant:[450,360,240],'Apex Legends':[260,200,120]};
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
 const price=p=>Object.keys(catalog).reduce((n,k)=>n+catalog[k][p[k]][1],0);
 function motherboard(p){const socket=catalog.cpu[p.cpu][2].socket,grade=p.motherboard;const chipset=socket==='AM5'?(grade>1?'X870E':grade===1?'X870':'B650'):socket==='LGA1700'?(grade?'Z790':'B760'):'Z890';return `${chipset} · ${socket} · DDR5 (${['essential','performance','enthusiast','flagship'][grade]})`;}
 const fps=(p,res,game)=>{const r=['1080p','1440p','4K'].indexOf(res);let f=games[game][r]*catalog.gpu[p.gpu][2].score*catalog.cpu[p.cpu][2].score*(catalog.memory[p.memory][2].capacity<32?.94:1);if(game==='Minecraft RTX'&&!catalog.gpu[p.gpu][2].chipset.startsWith('GeForce'))return null;return [Math.round(f*.85),Math.round(f)];};
 function issues(p){const a=[],cpu=catalog.cpu[p.cpu][2],gpu=catalog.gpu[p.gpu][2],ram=catalog.memory[p.memory][2],box=catalog.case[p.case][2],cool=catalog.cooling[p.cooling][2];
 if(catalog.psu[p.psu][2].watts<gpu.minPsu)a.push(`Choose at least ${gpu.minPsu}W for this graphics card under Vertex’s configuration rules.`);
 if(cool.level<cpu.minCooling)a.push(`Choose ${cpu.minCooling===1?'a dual-tower air cooler or better':'a liquid cooler'} for this processor.`);
 if(gpu.length>box.length)a.push(`This ${gpu.length}mm graphics card exceeds the case’s ${box.length}mm planning clearance. Choose a larger case.`);
 if(cool.radiator>box.radiator)a.push(`This radiator needs a case supporting at least ${cool.radiator}mm radiators.`);
 if(ram.capacity>cpu.maxMemory)a.push(`This CPU profile supports up to ${cpu.maxMemory}GB in the configurator. Choose another processor or less memory.`);
 if(ram.capacity>128&&p.motherboard<2)a.push('A 192GB memory kit requires an enthusiast or flagship motherboard profile. Exact board/BIOS memory support needs final verification.');
 return a;}
 return {catalog,labels,tiers,maxed,games,money,price,fps,motherboard,issues,source:imported};
})();
