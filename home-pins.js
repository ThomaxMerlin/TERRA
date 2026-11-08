import {getLandmarkPhoto} from './landmark-photo.js';
import * as THREE from './assets/three.module.js';
import {placePhotos} from './place-photos.js';

import { records } from './atlas-data.js';
import { readAtlasRoute } from './main-atlas.js';
const landmarks = Object.entries(records).flatMap(([group, entries]) => entries.map(([name,lat,lon,,facts]) => [name,lat,lon,group,facts.Country]));
const svgNS = 'http://www.w3.org/2000/svg';
export function mountHomePins(host, globe, camera, focusCategory, flyTo) {
  const overlay = document.createElement('div');
  overlay.className = 'home-pins';
  const lines = document.createElementNS(svgNS, 'svg');
  lines.setAttribute('aria-hidden', 'true');
  overlay.append(lines);
  host.append(overlay);
  const pins = landmarks.map(([key, lat, lon, page, country]) => {
    const photo = placePhotos[key];
    const name = photo.caption?.split(',')[0] || key;
    const latitude = THREE.MathUtils.degToRad(photo.lat ?? lat);
    const longitude = THREE.MathUtils.degToRad(photo.lon ?? lon);
    const anchor = new THREE.Vector3(Math.cos(latitude)*Math.cos(longitude), Math.sin(latitude), -Math.cos(latitude)*Math.sin(longitude)).multiplyScalar(1.49);
    const button = document.createElement('button');
    button.className = 'home-photo-pin';
    button.title = `${key} · ${name}`;
    button.setAttribute('aria-label', `Explore ${name}`);
    const thumb = document.createElement('img');
    thumb.loading = 'lazy'; thumb.src = photo.src; thumb.alt = ''; thumb.draggable = false;
    const label = document.createElement('span'); label.textContent = name;
    button.append(thumb, label); overlay.append(button);
    button.addEventListener('pointerdown', event => event.stopPropagation());
    button.onclick = () => flyTo(page, key, anchor, button);
    const line = document.createElementNS(svgNS, 'line');
    const dot = document.createElementNS(svgNS, 'circle'); dot.setAttribute('r', '2.5');
    lines.append(line, dot);
    return {anchor, button, thumb, line, dot, key, page, country};
  });
  const filter = document.querySelector('#globePinFilter');
  const countryFilter = document.querySelector('#globeCountryFilter');
  function syncFilter(){
    const route = readAtlasRoute();
    filter.value = route?.category || 'all';
    countryFilter.value = route?.category === 'landmarks' ? route.entry?.[4].Country || '' : '';
  }
  syncFilter();
  window.addEventListener('hashchange', syncFilter);
  filter.addEventListener('change', () => {
    countryFilter.value = '';
    if(filter.value !== 'all') focusCategory({category: filter.value});
  });
  countryFilter.addEventListener('change', () => {
    const entry = records.landmarks.find(item => item[4].Country === countryFilter.value);
    if (entry) {
      filter.value = 'landmarks';
      focusCategory({category:'landmarks', entry});
      const cover = placePhotos[entry[0]];
      if (cover.locator) getLandmarkPhoto(cover.wikiTitle, cover.coordinateCheck).then(photo => {
        if (!photo) return;
        const pin = pins.find(candidate => candidate.key === entry[0]);
        const preload = new Image();
        preload.onload = () => {
          pin.thumb.src = photo.src;
          Object.assign(cover, photo, {locator:false});
        };
        preload.src = photo.src;
      });
    }
  });
  const point = new THREE.Vector3(), view = new THREE.Vector3(), projected = new THREE.Vector3();
  return function update(show) {
    overlay.hidden = !show;
    filter.parentElement.hidden = !show;
    countryFilter.parentElement.hidden = !show || (filter.value !== 'landmarks' && filter.value !== 'all');
    const compact = filter.value === 'all';
    overlay.classList.toggle('all-pin-mode', compact);
    if (!show) return;
    const width = host.clientWidth, height = host.clientHeight;
    const placed = [];
    for (const pin of pins) {
      point.copy(pin.anchor).applyMatrix4(globe.matrixWorld);
      projected.copy(point).project(camera);
      const x = (projected.x + 1)*width/2, y = (1 - projected.y)*height/2;
      const included = compact || (pin.page === filter.value && (!countryFilter.value || pin.country === countryFilter.value));
      let visible = included && point.dot(view.copy(camera.position).sub(point)) > 0 && x > 0 && x < width && y > 0 && y < height;
      // Leave crowded markers accessible through the country picker without stacking them on the globe.
      if (visible && !countryFilter.value && pin.page === 'landmarks' && placed.length > 12) {
        const spacing = compact ? 46 : 72;
        visible = !placed.some(box => Math.abs(box.x - x) < spacing && Math.abs(box.y - y) < spacing);
      }
      pin.button.hidden = !visible;
      pin.line.style.display = pin.dot.style.display = visible ? '' : 'none';
      if (!visible) continue;
      const bw = compact ? 42 : 76, bh = compact ? 42 : 66;
      const clampX = v => THREE.MathUtils.clamp(v, 3, width-bw-3);
      const clampY = v => THREE.MathUtils.clamp(v, 3, height-bh-3);
      let left=clampX(x-bw/2), top=clampY(y-bh-12);
      let bestScore=Infinity;
      for(const dy of [0,-bh-5,bh+5,-2*bh-10,2*bh+10]){
        for(const dx of [0,-bw-5,bw+5,-2*bw-10,2*bw+10]){
          const l=clampX(x-bw/2+dx), t=clampY(y-bh-12+dy);
          const overlap=placed.reduce((area,box)=>area+Math.max(0,bw+3-Math.abs(l-box.left))*Math.max(0,bh+3-Math.abs(t-box.top)),0);
          const score=overlap*1000+dx*dx+dy*dy;
          if(score<bestScore){bestScore=score;left=l;top=t;}
          if(score===0)break;
        }
        if(bestScore===0)break;
      }
      placed.push({left,top,x,y});
      pin.button.style.transform = `translate(${left}px,${top}px)`;
      pin.line.setAttribute('x1',x); pin.line.setAttribute('y1',y);
      pin.line.setAttribute('x2',left+bw/2); pin.line.setAttribute('y2',y>top+bh/2?top+bh:top);
      pin.dot.setAttribute('cx',x); pin.dot.setAttribute('cy',y);
    }
  };
}
