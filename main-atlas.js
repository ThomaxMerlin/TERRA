import {records} from './atlas-data.js';

export function readAtlasRoute(hash = location.hash) {
  const [category, encoded] = hash.slice(1).split('/');
  if (!Object.hasOwn(records, category)) return null;
  let slug;
  try { slug = decodeURIComponent(encoded || ''); } catch { slug = ''; }
  const entry = records[category].find(([name]) => name.toLowerCase().replaceAll(' ', '-') === slug);
  return {category, entry, slug};
}
function displayAtlas() {
  const route = readAtlasRoute();
  const category = route?.category || 'land';
  for (const section of document.querySelectorAll('.category-section')) section.hidden = section.id !== category;
  for (const filter of document.querySelectorAll('[data-filter]')) {
    if (filter.dataset.filter === category) filter.setAttribute('aria-current', 'true');
    else filter.removeAttribute('aria-current');
  }
  if (!route) return;
  const section = document.getElementById(category);
  const detail = Array.from(section.querySelectorAll('.atlas-entry')).find(el => el.dataset.entry === route.slug);
  if (detail) detail.open = true;
  (detail || document.querySelector('.home-atlas')).scrollIntoView({block: 'start'});
}
window.addEventListener('hashchange', displayAtlas);
window.addEventListener('DOMContentLoaded', displayAtlas);
if(document.readyState !== 'loading') displayAtlas();

const countrySearch = document.querySelector('#countrySearch');
const groups = [...document.querySelectorAll('.landmark-country')];
function normalizeSearch(text) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase().trim();
}
function filterCountries() {
  const query = normalizeSearch(countrySearch.value);
  let matches = 0;
  for (const group of groups) {
    const terms = [group.getAttribute('aria-label'), ...Array.from(group.querySelectorAll('summary strong'), node => node.textContent)];
    group.hidden = !terms.some(term => normalizeSearch(term).includes(query));
    if (!group.hidden) matches++;
  }
  document.querySelector('#countryMatches').textContent = query ? (matches ? matches + (matches === 1 ? ' country' : ' countries') : 'No matching countries or landmarks.') : '';
}
countrySearch.addEventListener('input', filterCountries);
window.addEventListener('hashchange', () => {
  if (readAtlasRoute()?.entry) {
    countrySearch.value = '';
    filterCountries();
  }
});
