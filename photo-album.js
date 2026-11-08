import {getLandmarkPhoto} from './landmark-photo.js';
import {placeAlbums} from './place-albums.js';

export function createPhotoAlbum(dialog) {
  const image = dialog.querySelector('.album-image');
  const strip = dialog.querySelector('.album-thumbnails');
  const count = dialog.querySelector('.album-count');
  const previous = dialog.querySelector('.album-previous');
  const next = dialog.querySelector('.album-next');
  const caption = dialog.querySelector('.album-caption');
  const status = dialog.querySelector('.album-status');
  const figure = dialog.querySelector('.place-album');
  const albumLabel = figure.querySelector('.album-label');
  const attribution = figure.querySelector('figcaption');
  const galleryLink = document.createElement('a');
  galleryLink.className = 'place-source';
  galleryLink.textContent = 'Browse photographs on Wikimedia Commons ↗';
  galleryLink.target = '_blank';
  galleryLink.rel = 'noopener noreferrer';
  figure.append(galleryLink);
  let photos = [], active = 0, currentPlace = '';

  function select(index) {
    active = (index + photos.length) % photos.length;
    const photo = photos[active];
    status.textContent = 'Loading photo…';
    image.onload = () => { status.textContent = ''; };
    image.onerror = () => { status.textContent = 'This photo could not load. Try another image.'; };
    image.src = photo.src;
    image.alt = photo.alt;
    count.textContent = `${active + 1} / ${photos.length}`;
    caption.textContent = photo.caption || photo.alt;
    const credit = dialog.querySelector('.place-credit'), license = dialog.querySelector('.place-license');
    albumLabel.textContent = photo.locator ? 'LOCATION MAP' : photos.length === 1 ? 'PLACE PHOTOGRAPH' : 'PHOTO ALBUM';
    attribution.hidden = Boolean(photo.locator);
    credit.textContent = photo.credit || ''; credit.href = photo.source || '';
    license.textContent = photo.license || ''; license.href = photo.licenseUrl || photo.source || '';
    for (const [i, button] of [...strip.children].entries()) {
      button.setAttribute('aria-pressed', String(i === active));
      button.classList.toggle('selected', i === active);
    }
  }
  image.draggable = false;
  let swipeStart = null;
  image.addEventListener('pointerdown', event => { swipeStart = {x:event.clientX,y:event.clientY}; image.setPointerCapture?.(event.pointerId); });
  image.addEventListener('pointerup', event => {
    if (!swipeStart) return;
    const dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;
    swipeStart=null;
    if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.5) select(active+(dx<0?1:-1));
  });
  image.addEventListener('pointercancel', () => { swipeStart=null; });
  previous.onclick = () => select(active - 1);
  next.onclick = () => select(active + 1);
  dialog.querySelector('.place-album').addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    select(active + (event.key === 'ArrowRight' ? 1 : -1));
  });
  return function showAlbum(name, cover) {
    currentPlace = name;
    galleryLink.hidden = !cover.wikiTitle;
    if (cover.wikiTitle) {
      galleryLink.href = 'https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=' + encodeURIComponent(cover.wikiTitle);
    }
    photos = [cover, ...(placeAlbums[name] || [])];
    strip.replaceChildren();
    for (const [i, photo] of photos.entries()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `View photo ${i + 1}: ${photo.alt}`);
      const thumbnail = document.createElement('img');
      thumbnail.src = photo.src; thumbnail.alt = ''; thumbnail.loading = 'lazy';
      button.append(thumbnail); button.onclick = () => select(i); strip.append(button);
    }
    previous.disabled = next.disabled = photos.length < 2;
    figure.classList.toggle('single-photo', photos.length === 1);
    select(0);
    if (cover.locator) getLandmarkPhoto(cover.wikiTitle, cover.coordinateCheck).then(photo => {
      if (!photo || currentPlace !== name) return;
      const preload = new Image();
      preload.onload = () => {
        if (currentPlace !== name) return;
        photos[0] = photo;
        select(0);
      };
      preload.src = photo.src;
    });
  };
}
