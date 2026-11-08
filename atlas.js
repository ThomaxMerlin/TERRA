import * as THREE from './assets/three.module.js';
import { createCompass } from './compass.js';
import { placePhotos } from './place-photos.js';
const $=s=>document.querySelector(s),mode=document.body.dataset.atlas;
const records={land:[
['Asia',35,90,'From the Siberian tundra to tropical Southeast Asia, the largest continent spans an extraordinary variety of landscapes. Its southern edge rises into the Himalayas.',{'Surrounding oceans':'Arctic, Pacific, Indian','Mountain ranges':'Himalayas, Karakoram, Altai','Landscapes':'Steppes, deserts, rainforests, and high plateaus'}],
['Africa',2,20,'Africa stretches across the equator, linking Mediterranean shores, the vast Sahara, tropical forests, and southern grasslands. The East African Rift reveals a continent still being shaped.',{'Surrounding oceans':'Atlantic, Indian','Mountain ranges':'Atlas, Drakensberg, Rwenzori','Landscapes':'Deserts, savannas, rainforests, and rift valleys'}],
['North America',45,-100,'Arctic islands, broad interior plains, and mountainous western coasts define North America. Its landscapes extend south through Mexico and Central America.',{'Surrounding oceans':'Arctic, Atlantic, Pacific','Mountain ranges':'Rocky Mountains, Appalachians, Sierra Madre','Landscapes':'Tundra, forests, prairies, and deserts'}],
['South America',-18,-60,'The Andes trace the continent’s western edge, while the Amazon Basin spreads across its tropical interior. Farther south lie grasslands and the windswept landscapes of Patagonia.',{'Surrounding oceans':'Atlantic, Pacific','Mountain ranges':'Andes, Serra do Mar','Landscapes':'Rainforests, high plateaus, grasslands, and glaciers'}],
['Antarctica',-82,0,'A vast ice sheet covers most of Earth’s southernmost continent. Beneath and above the ice lie mountain ranges, while its coasts meet the cold waters of the Southern Ocean.',{'Surrounding oceans':'Southern','Mountain ranges':'Transantarctic Mountains, Ellsworth Mountains','Landscapes':'Ice sheets, exposed rock, and polar desert'}],
['Europe',52,20,'Europe’s peninsulas and varied coastlines surround a landscape of plains, forests, and mountain belts. The Alps form one of its most recognizable highland regions.',{'Surrounding oceans':'Atlantic, Arctic','Mountain ranges':'Alps, Pyrenees, Carpathians','Landscapes':'Temperate forests, plains, alpine terrain, and fjords'}],
['Australia',-25,134,'Australia combines an arid interior with tropical northern landscapes and forested eastern highlands. This atlas follows the seven-continent model; Oceania is the broader region that also includes Pacific islands.',{'Surrounding oceans':'Indian, Pacific','Mountain ranges':'Great Dividing Range, MacDonnell Ranges','Landscapes':'Deserts, eucalyptus woodlands, tropical savannas, and coasts'}]
],oceans:[
['Pacific Ocean',0,-155,'The largest ocean stretches between Asia and Australia in the west and the Americas in the east. Around much of its margin, active plate boundaries form the Ring of Fire.',{'Between':'Asia, Australia, and the Americas','Explore':'Island arcs, coral reefs, and deep ocean trenches','Connected waters':'Arctic, Southern, Indian, and Atlantic oceans'}],
['Atlantic Ocean',15,-35,'The Atlantic separates the Americas from Europe and Africa. A long underwater mountain system, the Mid-Atlantic Ridge, marks where tectonic plates move apart.',{'Between':'The Americas, Europe, and Africa','Explore':'Mid-Atlantic Ridge and continental shelves','Connected waters':'Arctic, Southern, Indian, and Pacific oceans'}],
['Indian Ocean',-20,75,'Warm tropical waters meet monsoon winds in the northern Indian Ocean. Its basin lies between eastern Africa, southern Asia, and western Australia.',{'Between':'Africa, Asia, and Australia','Explore':'Monsoon seas, coral islands, and submarine ridges','Connected waters':'Pacific, Atlantic, and Southern oceans'}],
['Southern Ocean',-65,30,'Encircling Antarctica, the Southern Ocean connects the Atlantic, Pacific, and Indian oceans. Its powerful circumpolar current flows around the continent.',{'Around':'Antarctica','Explore':'Sea ice, cold currents, and rich marine ecosystems','Connected waters':'Atlantic, Pacific, and Indian oceans'}],
['Arctic Ocean',85,0,'Earth’s smallest ocean surrounds the North Pole. Broad continental shelves and seasonal sea ice distinguish this northern basin.',{'Bordering lands':'North America, Europe, and Asia','Explore':'Polar seas, sea ice, and continental shelves','Connected waters':'Atlantic and Pacific oceans'}]
],mountains:[
['Himalayas',29,85,'Formed by the collision of the Indian and Eurasian plates, the Himalayas contain Earth’s highest peaks. Glaciers and snowfields feed major river systems across Asia.',{'Continent':'Asia','Notable summit':'Mount Everest','Shaped by':'Continental collision, rivers, and glaciers'}],
['Andes',-22,-69,'The Andes extend along western South America. Subduction of oceanic plates beneath the continent has helped create this great chain of mountains and volcanoes.',{'Continent':'South America','Notable summit':'Aconcagua','Shaped by':'Subduction, uplift, and volcanism'}],
['Rocky Mountains',43,-110,'The Rockies form a major mountain system in western North America, with high peaks, broad valleys, and forests shaped by uplift and erosion.',{'Continent':'North America','Notable summit':'Mount Elbert','Shaped by':'Tectonic uplift and glacial erosion'}],
['Alps',46,10,'The Alps arc across central Europe. Their steep peaks and glacial valleys record the effects of plate convergence and repeated periods of glaciation.',{'Continent':'Europe','Notable summit':'Mont Blanc','Shaped by':'Plate convergence and glaciers'}],
['Atlas Mountains',31,-7,'The Atlas Mountains cross northwestern Africa, separating coastal regions from the Sahara. Their landscapes range from forested slopes to dry, rocky highlands.',{'Continent':'Africa','Notable summit':'Toubkal','Shaped by':'Tectonic uplift and erosion'}],
['Great Dividing Range',-30,151,'A broad system of ranges and highlands follows eastern Australia. Its watersheds separate rivers flowing toward the coast from many that drain inland.',{'Continent':'Australia','Notable summit':'Mount Kosciuszko, in the Australian Alps','Shaped by':'Ancient tectonic activity, uplift, and erosion'}],
['Transantarctic Mountains',-82,160,'This immense mountain system divides East and West Antarctica. Rocky peaks rise above the ice, exposing a long geological record in a polar landscape.',{'Continent':'Antarctica','Notable summit':'Mount Kirkpatrick','Shaped by':'Tectonic uplift and glacial erosion'}]
]};
Object.assign(records,{"volcanoes": [["Kīlauea", 19.421, -155.287, "On the island of Hawaiʻi, Kīlauea’s broad slopes record the gradual growth of a shield volcano. Lava flows and summit collapse have reshaped this volcanic landscape.", {"Location": "Hawaiʻi, United States", "Volcano form": "Shield volcano", "Look closer": "Summit caldera, rift zones, and lava fields"}, "https://www.nps.gov/havo/learn/nature/kilauea.htm"], ["Mauna Loa", 19.475, -155.608, "Mauna Loa rises in a broad, gently sloping profile built from overlapping lava flows. Together with neighboring volcanoes, it helps form the island of Hawaiʻi.", {"Location": "Hawaiʻi, United States", "Volcano form": "Shield volcano", "Look closer": "Wide flanks shaped by repeated lava flows"}, "https://volcano.si.edu/volcano.cfm?vn=332020"], ["Mount Fuji", 35.361, 138.727, "Mount Fuji’s distinctive cone rises above central Japan. Forested lower slopes give way to a volcanic summit, a landscape that has inspired art and spiritual traditions for centuries.", {"Location": "Honshu, Japan", "Landmark": "Japan’s highest mountain", "Look closer": "Forested foothills and the summit crater"}, "https://faq.japan-travel.jnto.go.jp/national-parks/parks/fuji-hakone-izu/explore/"], ["Mount Etna", 37.756, 14.997, "On eastern Sicily, Mount Etna presents a varied volcanic landscape of craters, cinder cones, and lava flows. Its long documented history has made it an important place for studying volcanism.", {"Location": "Sicily, Italy", "Volcano form": "Stratovolcano", "Look closer": "Summit craters, lava caves, and Valle del Bove"}, "https://whc.unesco.org/en/list/1427/"]], "waterfalls": [["Iguazú Falls", -25.686, -54.444, "A vast arc of cascades crosses a basalt edge between Argentina and Brazil. The surrounding Atlantic Forest brings water, rock, and rich forest ecosystems together.", {"Location": "Argentina / Brazil", "Setting": "Atlantic Forest", "Look closer": "A sweeping system of cascades and basalt cliffs"}, "https://whc.unesco.org/en/list/303/"], ["Victoria Falls", -17.925, 25.857, "Also known as Mosi-oa-Tunya, this great curtain of water drops from the Zambezi River into a narrow gorge. Its spray supports a humid riverside ecosystem.", {"Location": "Zambia / Zimbabwe", "River": "Zambezi", "Look closer": "Basalt gorges, spray, and rainbows"}, "https://whc.unesco.org/en/list/509/"], ["Niagara Falls", 43.08, -79.071, "Three waterfalls make up Niagara: Horseshoe Falls, American Falls, and Bridal Veil Falls. Together they create a powerful meeting of rushing water and rocky escarpment.", {"Location": "Canada / United States", "Waterfall group": "Horseshoe, American, and Bridal Veil", "Look closer": "Three distinct falls in one river landscape"}, "https://www.niagarafallsusa.com/planning-tools/about-niagara-falls/fun-facts/"], ["Yosemite Falls", 37.757, -119.597, "High above Yosemite Valley, water descends through Upper Yosemite Fall, the middle cascades, and Lower Yosemite Fall. Flow changes dramatically with the seasons and snowmelt.", {"Location": "California, United States", "Setting": "Yosemite Valley", "Look closer": "Upper fall, middle cascades, and lower fall"}, "https://www.nps.gov/yose/planyourvisit/waterfalls.htm"]]});
const entries=records[mode];let chosen=0,focusGlobe=()=>{};
$('#count').textContent=String(entries.length).padStart(2,'0');
entries.forEach((entry,i)=>{const b=document.createElement('button');b.className='place-button';b.innerHTML=`<small>${String(i+1).padStart(2,'0')}</small><span>${entry[0]}</span><b>↗</b>`;b.onclick=()=>choose(i);$('#placeList').append(b);});
function choose(i){chosen=i;const r=entries[i];$('#regionNumber').textContent=`${({land:'CONTINENT',oceans:'OCEAN',mountains:'MOUNTAIN RANGE',volcanoes:'VOLCANO',waterfalls:'WATERFALL'})[mode]} ${String(i+1).padStart(2,'0')} / ${String(entries.length).padStart(2,'0')}`;$('#regionName').textContent=r[0];$('#regionDescription').textContent=r[3];$('#map-label').textContent=r[0].toUpperCase();$('#regionFacts').replaceChildren();for(const [key,value]of Object.entries(r[4])){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;$('#regionFacts').append(dt,dd);}document.querySelectorAll('.place-button').forEach((b,n)=>{b.classList.toggle('active',n===i);b.setAttribute('aria-pressed',String(n===i));});$('#backExplorer').href='./?view='+({land:'land',oceans:'ocean',mountains:'mountains',volcanoes:'mountains',waterfalls:'land'}[mode]);$('#backExplorer').textContent=mode==='volcanoes'?'Explore mountain terrain ↗':mode==='waterfalls'?'Explore river terrain ↗':'Open 3D landscape ↗';const source=$('#regionSource');if(source){source.href=r[5];source.textContent='Read the landmark source ↗';}showPhoto(r[0]);focusGlobe(placePhotos[r[0]]?.lat??r[1],placePhotos[r[0]]?.lon??r[2]);history.replaceState(null,'','#'+encodeURIComponent(r[0].toLowerCase().replaceAll(' ','-')));}
function showPhoto(name){
 const img=$('#placePhoto');if(!img)return;
 const p=placePhotos[name],status=$('#photoStatus');
 $('#photoName').textContent=p?.caption?name+' · '+p.caption:name;
 const photoLocation=$('#photoLocation');if(photoLocation)photoLocation.textContent=p?.caption?'Photo pin: '+p.caption:'';
 if(!p){status.hidden=false;status.textContent='Photo unavailable for this location.';img.hidden=true;return;}
 img.hidden=false;status.hidden=false;status.textContent='Loading photograph…';
 img.onload=()=>{status.hidden=true;};img.onerror=()=>{status.hidden=false;status.textContent='Photo could not load. Please refresh to try again.';};
 img.alt=p.alt;img.src=p.src;$('#placePhotoLink').href=p.src;
 $('#placePhotoLink').setAttribute('aria-label','Open full photograph of '+name);
 $('#photoCredit').textContent='Photo: '+p.credit;$('#photoCredit').href=p.source;
 $('#photoLicense').textContent=p.license;$('#photoLicense').href=p.licenseUrl||p.source;
}
const hash=decodeURIComponent(location.hash.slice(1));const initial=entries.findIndex(r=>r[0].toLowerCase().replaceAll(' ','-')===hash);choose(Math.max(0,initial));
const photoDialog=$('#photoDialog');
if(photoDialog){
 $('#closePhoto').onclick=()=>photoDialog.close();
 photoDialog.addEventListener('click',e=>{if(e.target===photoDialog){const r=photoDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)photoDialog.close();}});
}
if($('#atlasGlobe'))try{
 const host=$('#atlasGlobe'),renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));host.append(renderer.domElement);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,50);camera.position.z=4.3;
 scene.add(new THREE.AmbientLight(0xc6d9e6,2));
 const sun=new THREE.DirectionalLight(0xfff4df,2.4);sun.position.set(-3,4,5);scene.add(sun);
 const earth=new THREE.Group();scene.add(earth);
 const tex=new THREE.TextureLoader().load('assets/earth.jpg',()=>$('#globeStatus').hidden=true,undefined,()=>$('#globeStatus').textContent='Globe imagery unavailable. Region details remain available.');tex.colorSpace=THREE.SRGBColorSpace;
 earth.add(new THREE.Mesh(new THREE.SphereGeometry(1.22,96,64),new THREE.MeshPhongMaterial({map:tex,shininess:8})));
 earth.add(new THREE.Mesh(new THREE.SphereGeometry(1.235,64,48),new THREE.MeshBasicMaterial({color:0x609da8,transparent:true,opacity:.07,side:THREE.BackSide})));
 const marker=new THREE.Mesh(new THREE.SphereGeometry(.018,16,12),new THREE.MeshBasicMaterial({color:0xe4f5bc}));earth.add(marker);
 const target=new THREE.Quaternion(),normal=new THREE.Vector3();
 const geoVector=(lat,lon)=>{const a=lat*Math.PI/180,b=lon*Math.PI/180;return new THREE.Vector3(Math.cos(a)*Math.cos(b),Math.sin(a),-Math.cos(a)*Math.sin(b));};
 let zoom=4.3,drag=false,px=0,py=0;
 focusGlobe=(lat,lon)=>{normal.copy(geoVector(lat,lon));marker.position.copy(normal).multiplyScalar(1.24);target.setFromUnitVectors(normal,new THREE.Vector3(0,0,1));};
 focusGlobe(placePhotos[entries[chosen][0]]?.lat??entries[chosen][1],placePhotos[entries[chosen][0]]?.lon??entries[chosen][2]);earth.quaternion.copy(target);
 const compass=createCompass(host.parentElement,()=>earth.quaternion.clone(),q=>target.copy(q));
 const overlay=$('#globeBadges'),lines=$('#badgeLines'),badges=[];
 if(overlay)entries.forEach((entry,i)=>{
  const photo=placePhotos[entry[0]];if(!photo)return;
  const button=document.createElement('button');button.className='globe-photo-badge';button.type='button';button.title=entry[0]+(photo.caption?' · '+photo.caption:'');button.setAttribute('aria-label','View photo of '+entry[0]);
  const img=document.createElement('img');img.src=photo.src;img.alt='';img.draggable=false;
  const label=document.createElement('span');label.textContent=entry[0];button.append(img,label);overlay.append(button);
  button.onclick=()=>{choose(i);photoDialog.showModal();};
  const line=document.createElementNS('http://www.w3.org/2000/svg','line');lines.append(line);
  const dot=new THREE.Mesh(new THREE.SphereGeometry(.012,12,8),new THREE.MeshBasicMaterial({color:0xd5e9b9}));dot.position.copy(geoVector(photo.lat??entry[1],photo.lon??entry[2])).multiplyScalar(1.24);earth.add(dot);
  badges.push({i,button,line,normal:geoVector(photo.lat??entry[1],photo.lon??entry[2])});
 });
 const worldPoint=new THREE.Vector3(),projected=new THREE.Vector3(),toCamera=new THREE.Vector3();
 function updateBadges(){
  if(!overlay)return;
  const w=host.clientWidth,h=host.clientHeight,bw=76,bh=66;
  const visible=[];
  for(const b of badges){
   worldPoint.copy(b.normal).applyQuaternion(earth.quaternion).multiplyScalar(1.24);
   toCamera.copy(camera.position).sub(worldPoint);
   const front=worldPoint.dot(toCamera)>0;
   projected.copy(worldPoint).project(camera);
   const x=(projected.x*.5+.5)*w,y=(-projected.y*.5+.5)*h;
   b.button.hidden=b.line.hidden=!front||x<0||x>w||y<0||y>h;
   b.line.style.display=b.button.hidden?'none':'';
   b.button.classList.toggle('selected',b.i===chosen);b.button.setAttribute('aria-pressed',String(b.i===chosen));
   if(!b.button.hidden)visible.push({...b,x,y,l:Math.max(5,Math.min(w-bw-5,x-bw/2)),t:Math.max(5,Math.min(h-bh-5,y-bh-23))});
  }
  // Separate nearby photos while retaining a leader to each geographic point.
  visible.sort((a,b)=>a.x-b.x||a.i-b.i);
  for(let pass=0;pass<8;pass++)for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++){
   const a=visible[i],b=visible[j];if(Math.abs(a.l-b.l)<bw+8&&Math.abs(a.t-b.t)<bh+8){
    const mid=(a.l+b.l)/2;a.l=Math.max(5,mid-bw/2-5);b.l=Math.min(w-bw-5,mid+bw/2+5);
    if(Math.abs(a.l-b.l)<bw+4){a.t=Math.max(5,a.t-bh/2-5);b.t=Math.min(h-bh-5,b.t+bh/2+5);}
   }
  }
  for(const b of visible){if(b.l>w-92&&b.t<88)b.t=88;b.button.style.transform=`translate(${b.l}px,${b.t}px)`;b.line.setAttribute('x1',b.x);b.line.setAttribute('y1',b.y);b.line.setAttribute('x2',b.l+bw/2);b.line.setAttribute('y2',b.t+bh);}
 }
 $('#resetView').onclick=()=>{zoom=4.3;focusGlobe(placePhotos[entries[chosen][0]]?.lat??entries[chosen][1],placePhotos[entries[chosen][0]]?.lon??entries[chosen][2]);};
 $('#atlasZoomIn').onclick=()=>zoom=Math.max(3.3,zoom-.4);$('#atlasZoomOut').onclick=()=>zoom=Math.min(6,zoom+.4);
 host.onpointerdown=e=>{drag=true;px=e.clientX;py=e.clientY;host.setPointerCapture(e.pointerId);};
 host.onpointermove=e=>{if(!drag)return;const q=new THREE.Quaternion().setFromEuler(new THREE.Euler((e.clientY-py)*.005,(e.clientX-px)*.005,0));earth.quaternion.premultiply(q);target.copy(earth.quaternion);px=e.clientX;py=e.clientY;};
 host.onpointerup=host.onpointercancel=()=>drag=false;
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(lines)lines.setAttribute('viewBox',`0 0 ${w} ${h}`);}
 new ResizeObserver(resize).observe(host);resize();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function animate(){requestAnimationFrame(animate);if(!drag)earth.quaternion.slerp(target,reduced?1:.07);camera.position.z+=(zoom-camera.position.z)*(reduced?1:.1);camera.updateMatrixWorld();renderer.render(scene,camera);updateBadges();compass.update();}animate();
}catch(e){$('#globeStatus').textContent='3D globe unavailable in this browser. Explore regions using the list.';$('#resetView').disabled=$('#atlasZoomIn').disabled=$('#atlasZoomOut').disabled=true;}
