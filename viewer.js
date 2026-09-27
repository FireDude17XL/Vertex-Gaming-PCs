import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Original, procedural schematic geometry. No manufacturer CAD or remote assets.
const host=document.getElementById('buildViewport');
if(host) init();
function init(){
 const status=document.getElementById('previewStatus');
 let renderer;
 const fail=message=>{status.hidden=false;status.textContent=message;document.getElementById('previewFallback').hidden=false;host.querySelector('canvas')?.setAttribute('hidden','');document.querySelectorAll('.camera-controls button').forEach(b=>b.disabled=true);};
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{fail('3D is unavailable in this browser. The configurator still works; this illustration is a fallback.');return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.35;
 host.prepend(renderer.domElement);
 const canvas=renderer.domElement;
 canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Interactive schematic PC build. Arrow keys orbit, plus and minus zoom, R resets.');
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('3D graphics paused. Reload to restore the preview; you can still configure your system.');});
 document.getElementById('previewFallback').hidden=true;status.hidden=true;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(38,1,.1,100);
 const controls=new OrbitControls(camera,canvas);
 controls.enableDamping=false;controls.minDistance=6;controls.maxDistance=20;controls.maxPolarAngle=Math.PI*.92;controls.zoomSpeed=.8;
 const defaultPosition=new THREE.Vector3(8,4.8,9);
 const target=new THREE.Vector3(0,0,0);
 camera.position.copy(defaultPosition);controls.target.copy(target);controls.update();
 scene.add(new THREE.HemisphereLight(0xdde9ff,0x44404a,3));
 const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(3,6,7);scene.add(key);
 const fill=new THREE.DirectionalLight(0xff3c35,2);fill.position.set(-5,1,-3);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xb4d5ff,3);rim.position.set(5,4,-4);scene.add(rim);
 const grid=new THREE.GridHelper(16,32,0x5b3030,0x25252b);grid.position.y=-2.67;scene.add(grid);
 const platform=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.35,.12,64),new THREE.MeshStandardMaterial({color:0x101116,roughness:.7,metalness:.45}));platform.position.y=-2.61;scene.add(platform);
 let buildGroup=new THREE.Group();scene.add(buildGroup);
 let parts=window.vertexBuild,exploded=false,glass=true,queued=false,revision=0;
 function render(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;if(!canvas.hidden){renderer.render(scene,camera);host.dataset.camera=camera.position.toArray().map(n=>n.toFixed(2)).join(',');}});}
 controls.addEventListener('change',render);
 function resize(){const width=host.clientWidth,height=host.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();}
 const observer=new ResizeObserver(resize);observer.observe(host);
 function material(color,metalness=.45,roughness=.5){return new THREE.MeshStandardMaterial({color,metalness,roughness});}
 function box(parent,w,h,d,x,y,z,color,emission){const m=material(color);if(emission){m.emissive=new THREE.Color(emission);m.emissiveIntensity=.9;}const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 function label(parent,text,x,y,z,width=.95,height=.18){const c=document.createElement('canvas');c.width=512;c.height=80;const ctx=c.getContext('2d');ctx.fillStyle='#14171c';ctx.fillRect(0,0,512,80);ctx.font='600 32px sans-serif';ctx.fillStyle='#e9edef';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,40,490);const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),m);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 function tube(parent,points,color,radius=.055){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,24,radius,8,false),material(color,.15,.7));parent.add(m);return m;}
 function fan(parent,x,y,z,color,rotation=[0,0,0],scale=1){const group=new THREE.Group();group.position.set(x,y,z);group.rotation.set(...rotation);group.scale.setScalar(scale);parent.add(group);box(group,.82,.82,.1,0,0,0,0x20242a);const ringMat=material(color,.3,.4);ringMat.emissive=new THREE.Color(color);ringMat.emissiveIntensity=parts.rgb===0?0:1.5;const ring=new THREE.Mesh(new THREE.TorusGeometry(.32,.035,8,40),ringMat);ring.position.z=.07;group.add(ring);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.08,20),material(0x41474c));hub.rotation.x=Math.PI/2;hub.position.z=.08;group.add(hub);for(let i=0;i<7;i++){const blade=box(group,.15,.25,.025,Math.cos(i*Math.PI*2/7)*.18,Math.sin(i*Math.PI*2/7)*.18,.07,0x343a40);blade.rotation.z=i*Math.PI*2/7+.65;}return group;}
 function disposeGroup(){buildGroup.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});scene.remove(buildGroup);buildGroup=new THREE.Group();scene.add(buildGroup);}
 function update(next){if(!next)return;parts={...next};disposeGroup();const cat=window.Vertex.catalog;const body=cat.case[parts.case][2],gpu=cat.gpu[parts.gpu][2],ram=cat.memory[parts.memory][2],cool=cat.cooling[parts.cooling][2];
 const white=body.color==='white',shell=white?0xdce1e4:0x24282f,trim=white?0x939aa2:0x101318;
 const lights=parts.rgb===0?[0x555960,0x555960,0x555960]:parts.rgb===1?[0xef1b1b,0xef1b1b,0xef1b1b]:[0x5b7aff,0xeb39bd,0x2ad8d0];
 const W=body.size>1?1.95:1.75,glassZ=1.16+(exploded?1.3:0),explode=exploded?1:0;
 // Frame: front is +X; glass side is +Z; board mounts to -Z.
 for(const x of [-W,W])for(const z of [-1.15,1.15])box(buildGroup,.12,4.7,.12,x,0,z,shell);
 for(const y of [-2.35,2.35]){box(buildGroup,W*2+.12,.12,2.4,0,y,0,shell);for(const z of [-1.15,1.15])box(buildGroup,W*2,.12,.1,0,y,z,shell);}
 box(buildGroup,W*2,4.5,.07,0,0,-1.18-explode*.3,trim);
 box(buildGroup,.08,4.4,2.22,-W,0,0,shell);
 box(buildGroup,W*2-.1,.72,2.2,0,-1.94,0,shell);
 for(const x of [-W+.3,W-.3])for(const z of [-.8,.8])box(buildGroup,.4,.15,.35,x,-2.49,z,0x090a0c);
 // Front intake bank.
 for(let i=0;i<3;i++)fan(buildGroup,W-.12+explode*.65,-.85+i*1.12,0,lights[i],[0,Math.PI/2,0],1.15);
 if(parts.case===0){for(let z=-1;z<=1;z+=.14)box(buildGroup,.025,4.2,.025,W+.03,0,z,0x636970);}else if(glass){const m=new THREE.MeshPhysicalMaterial({color:0x9cb3c2,transparent:true,opacity:.12,roughness:.15,metalness:.05,side:THREE.DoubleSide,depthWrite:false});const front=new THREE.Mesh(new THREE.PlaneGeometry(2.2,4.4),m);front.rotation.y=Math.PI/2;front.position.set(W+.04+explode*.65,0,0);buildGroup.add(front);}
 // Motherboard and components.
 const mb=new THREE.Group();mb.position.z=-explode*.4;buildGroup.add(mb);
 box(mb,2.6,2.9,.11,-.25,.34,-.97,0x1e2628);
 for(let i=0;i<8;i++)box(mb,.035,1.9,.015,-1.25+i*.28,.25,-.904,0x506159);
 box(mb,.55,.9,.22,-1.27,1.2,-.78,0x333943);box(mb,.85,.28,.2,-.66,1.75,-.78,0x424850);
 box(mb,.53,.53,.06,-.62,.92,-.84,0xb1b8bc);
 label(mb,cat.cpu[parts.cpu][2].brand,-.62,.92,-.797,.44,.12);
 const ramG=new THREE.Group();ramG.position.set(0,0,explode*.9);buildGroup.add(ramG);
 for(let i=0;i<ram.sticks;i++){const x=.05+i*.19;box(ramG,.115,1.04,.26,x,.98,-.73,ram.color==='white'?0xd4d6dd:0x252a31);box(ramG,.12,1.05,.06,x,.98,-.57,ram.rgb?lights[i%3]:0x767c82,ram.rgb&&parts.rgb!==0?lights[i%3]:null);}
 // Graphics card scaled from source length, with visible cooler and backplate.
 const graphics=new THREE.Group();graphics.position.set(-.13,-.72,explode*1.4);buildGroup.add(graphics);
 const length=Math.min(gpu.length/100,3.7),gpuColor=gpu.color==='white'?0xd7dce0:0x353b44;
 box(graphics,length,.36,.94,0,0,.14,gpuColor);box(graphics,length,.055,.97,0,.21,.14,0x60666e);
 for(let i=0;i<gpu.fans;i++)fan(graphics,-length/2+.55+i*(length-1.1)/Math.max(1,gpu.fans-1),-.22,.16,0x5e6670,[Math.PI/2,0,0],.85);
 box(graphics,length*.84,.025,.025,0,.05,.63,lights[0],parts.rgb===0?null:lights[0]);
 label(graphics,gpu.chipset,0,-.06,.635,Math.min(length*.8,2),.16);
 // PSU, NVMe drives, cables.
 label(buildGroup,cat.psu[parts.psu][2].watts+'W',-.85,-1.9,1.112,.72,.2);
 for(let i=0;i<cat.storage[parts.storage][2].drives;i++){box(mb,.78,.16,.05,-.62,-.1-i*.3,-.83,0x4a515c);label(mb,'NVMe',-.62,-.1-i*.3,-.799,.47,.11);}
 tube(buildGroup,[[.9,-1.56,-.45],[1,-1.05,.05],[.8,-.5,.2],[.55,-.55,.58]],0x171a20,.09);
 // Air or liquid cooling tracks the selected option.
 const cooler=new THREE.Group();cooler.position.z=explode*.6;buildGroup.add(cooler);
 if(!cool.radiator){const towers=parts.cooling===1?2:1;for(let i=0;i<towers;i++){box(cooler,.6,.75,.54,-.83+i*.4,.94,-.35,0x7b818b);for(let j=0;j<11;j++)box(cooler,.62,.023,.57,-.83+i*.4,.61+j*.065,-.35,0xa5aab0);}fan(cooler,-.62,.94,.04,lights[0],[0,0,0],.85);}
 else{box(cooler,.55,.55,.24,-.62,.92,-.64,0x242a33);label(cooler,parts.cooling>=3?'VERTEX':'AIO',-.62,.92,-.51,.42,.15);const count=cool.radiator===240?2:3;box(cooler,count*.89,.19,.9,0,2.12+explode*.7,-.12,0x252a32);for(let i=0;i<count;i++)fan(cooler,-(count-1)*.45+i*.9,1.94+explode*.7,-.12,lights[i%3],[Math.PI/2,0,0],.95);tube(cooler,[[-.45,1.02,-.45],[.28,1.23,.23],[.6,1.65+explode*.7,.1],[.65,2.05+explode*.7,-.12]],parts.cooling===4?lights[0]:0x20232a);tube(cooler,[[-.7,1.12,-.45],[-.25,1.55,.28],[.33,1.9+explode*.7,.05],[.38,2.05+explode*.7,-.12]],parts.cooling===4?lights[2]:0x20232a);if(parts.cooling===4){const res=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.8,20),material(0x353b43));res.position.set(.95,.28,.15);cooler.add(res);}}
 if(parts.rgb===3)for(const x of [-W+.15,W-.15])box(buildGroup,.025,4.25,.025,x,0,1.09,lights[1],lights[1]);
 if(glass){const panel=new THREE.Mesh(new THREE.PlaneGeometry(W*2-.15,4.45),new THREE.MeshPhysicalMaterial({color:0xa2b6cd,transparent:true,opacity:.075,roughness:.08,metalness:.1,side:THREE.DoubleSide,depthWrite:false}));panel.position.set(0,0,glassZ);buildGroup.add(panel);for(const x of [-W+.15,W-.15])for(const y of [-2.13,2.13])box(buildGroup,.08,.08,.025,x,y,glassZ+.025,0x8b9298);}
 label(buildGroup,'V E R T E X',.1,-1.96,1.113,1.12,.19);
 host.dataset.modelRevision=String(++revision);host.dataset.configuration=JSON.stringify(parts);host.dataset.exploded=String(exploded);host.dataset.glass=String(glass);
 document.getElementById('previewParts').textContent=`${cat.case[parts.case][0]} · ${gpu.fans}-fan GPU · ${ram.sticks} RAM sticks · ${cat.cooling[parts.cooling][0]}`;
 render();
 }
 function view(name){const distance=camera.position.distanceTo(controls.target);const offset=camera.position.clone().sub(controls.target);if(name==='reset'){camera.position.copy(defaultPosition);controls.target.copy(target);}else if(name==='in'||name==='out'){offset.multiplyScalar(name==='in'?.83:1.2);offset.setLength(THREE.MathUtils.clamp(offset.length(),controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);}else if(name==='left'||name==='right'){offset.applyAxisAngle(new THREE.Vector3(0,1,0),name==='left'?-.3:.3);camera.position.copy(controls.target).add(offset);}else {const positions={front:[1,.08,0],side:[0,.1,1],rear:[-1,.08,0],top:[.01,1,.01]};controls.target.copy(target);camera.position.fromArray(positions[name]).normalize().multiplyScalar(distance);}controls.update();render();}
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
 canvas.addEventListener('keydown',e=>{const map={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out',r:'reset',R:'reset'};if(map[e.key]){e.preventDefault();view(map[e.key]);}else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));s.phi=THREE.MathUtils.clamp(s.phi+(e.key==='ArrowUp'?-.15:.15),.1,Math.PI*.9);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();render();}});
 document.getElementById('explodeView').addEventListener('click',e=>{exploded=!exploded;e.currentTarget.setAttribute('aria-pressed',exploded);e.currentTarget.textContent=exploded?'Assemble parts':'Explode parts';if(exploded&&camera.position.distanceTo(controls.target)<10){camera.position.sub(controls.target).setLength(12).add(controls.target);controls.update();}update(parts);});
 document.getElementById('glassView').addEventListener('click',e=>{glass=!glass;e.currentTarget.setAttribute('aria-pressed',glass);e.currentTarget.textContent=glass?'Glass on':'Glass off';update(parts);});
 document.addEventListener('vertex:build-change',e=>update(e.detail));
 update(parts);resize();
 window.addEventListener('pagehide',event=>{if(event.persisted)return;observer.disconnect();controls.dispose();disposeGroup();renderer.dispose();});
}
