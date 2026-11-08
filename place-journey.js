import {createPhotoAlbum} from './photo-album.js';
import * as THREE from './assets/three.module.js';
import {records} from './atlas-data.js';
import {placePhotos} from './place-photos.js';

export function placeRoute(category, name) {
  return `#place/${category}/${encodeURIComponent(name.toLowerCase().replaceAll(' ', '-'))}`;
}

export function resolvePlace(hash) {
  const [, category, slug] = hash.startsWith('#place/') ? hash.split('/') : [];
  if (!Object.hasOwn(records, category)) return null;
  const entry = records[category].find(([name]) => placeRoute(category, name).split('/')[2] === slug);
  return entry ? {category, entry, photo: placePhotos[entry[0]]} : null;
}

export function createPlaceJourney({world, globe, camera, getZoom, setZoom, getAuto, setAuto}) {
  const dialog = document.querySelector('#placePage');
  const title = dialog.querySelector('h1');
  const showAlbum = createPhotoAlbum(dialog);
  const back = dialog.querySelector('.place-back');
  let frame = 0, origin = null, opener = null;

  function restore() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (origin) {
      world.quaternion.copy(origin.rotation);
      setZoom(origin.zoom);
      camera.position.z = origin.cameraZ;
      setAuto(origin.auto);
      document.querySelector('#globePinFilter').value = origin.category;
      document.querySelector('#globeCountryFilter').value = origin.country;
      origin = null;
    }
  }

  function render(place) {
    const [name,,,description,facts,source] = place.entry;
    const photo = place.photo;
    title.textContent = photo.caption?.split(',')[0] || name;
    dialog.querySelector('.place-kicker').textContent = `${place.category} / ${name}`;
    dialog.querySelector('.place-context').textContent = photo.caption || facts.Location || name;
    showAlbum(name, photo);
    dialog.querySelector('.place-description').textContent = description;
    const dl = dialog.querySelector('dl');
    dl.replaceChildren();
    for (const [label,value] of Object.entries(facts)) {
      const term = document.createElement('dt'), detail = document.createElement('dd');
      term.textContent = label; detail.textContent = value; dl.append(term, detail);
    }
    const guide = dialog.querySelector('.place-source');
    guide.hidden = !source;
    if (source) guide.href = source;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    back.focus({preventScroll:true});
  }

  function sync() {
    const place = resolvePlace(location.hash);
    if (place) { render(place); return; }
    if (dialog.open && origin) queueMicrotask(restore);
    else restore();
    if (dialog.open) dialog.close();
    if (opener?.isConnected) opener.focus({preventScroll:true});
    opener = null;
  }

  function goBack() {
    if (history.state?.terraPlace) history.back();
    else { history.replaceState(null, '', '#explore'); sync(); }
  }
  back.onclick = goBack;
  dialog.addEventListener('cancel', event => { event.preventDefault(); goBack(); });
  window.addEventListener('hashchange', sync);
  sync();

  return function flyTo(category, name, anchor, button) {
    if (origin || dialog.open) return;
    opener = button;
    origin = {rotation:world.quaternion.clone(), zoom:getZoom(), cameraZ:camera.position.z, auto:getAuto(), category:document.querySelector('#globePinFilter').value, country:document.querySelector('#globeCountryFilter').value};
    setAuto(false);
    const from = origin.rotation.clone();
    const point = anchor.clone().normalize().applyQuaternion(globe.quaternion).applyQuaternion(from);
    const turn = new THREE.Quaternion().setFromUnitVectors(point, new THREE.Vector3(0,0,1));
    const to = turn.multiply(from);
    const startZ = camera.position.z, endZ = Math.min(startZ, 3.05);
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 820;
    const start = performance.now();
    function step(now) {
      const t = duration ? Math.min(1, (now-start)/duration) : 1;
      const eased = t*t*(3-2*t);
      world.quaternion.slerpQuaternions(from,to,eased);
      setZoom(startZ+(endZ-startZ)*eased);
      if (t<1) { frame=requestAnimationFrame(step); return; }
      frame=0;
      history.pushState({terraPlace:true}, '', placeRoute(category,name));
      render(resolvePlace(location.hash));
    }
    step(start);
  };
}
