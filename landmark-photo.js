// Only request an external photograph when a visitor opens its landmark.
const pending = new Map();

async function wikiQuery(domain, params) {
  const url = new URL('/w/api.php', domain);
  url.search = new URLSearchParams({action:'query', format:'json', formatversion:'2', origin:'*', ...params});
  const response = await fetch(url, {signal: AbortSignal.timeout(12000)});
  if (!response.ok) throw new Error('Photo source unavailable');
  return (await response.json()).query.pages[0];
}

async function fetchPhoto(title, coordinates) {
  const page = await wikiQuery('https://en.wikipedia.org', {
    titles:title, redirects:'1', prop:'pageimages|coordinates', piprop:'name', pilicense:'free'
  });
  if (coordinates) {
    const location = page.coordinates?.[0];
    const longitudeDistance = location ? Math.abs(((location.lon - coordinates[1] + 540) % 360) - 180) : Infinity;
    if (!location || Math.abs(location.lat - coordinates[0]) > 0.6 || longitudeDistance > 0.6) return null;
  }
  if (!page.pageimage || !/\.jpe?g$/i.test(page.pageimage)) return null;
  const file = await wikiQuery('https://commons.wikimedia.org', {
    titles:'File:' + page.pageimage, prop:'imageinfo', iiprop:'url|extmetadata', iiurlwidth:'960'
  });
  const info = file.imageinfo?.[0];
  if (!info?.thumburl) return null;
  const plain = value => new DOMParser().parseFromString(value || '', 'text/html').body.textContent.trim();
  const credit = plain(info.extmetadata?.Artist?.value);
  const license = plain(info.extmetadata?.LicenseShortName?.value);
  if (!credit || !license) return null;
  return {src:info.thumburl, alt:title, credit, license, source:info.descriptionurl, licenseUrl:info.extmetadata?.LicenseUrl?.value};
}

export function getLandmarkPhoto(title, coordinates) {
  const key = JSON.stringify([title, coordinates]);
  if (!pending.has(key)) {
    pending.set(key, fetchPhoto(title, coordinates).catch(() => {
      pending.delete(key);
      return null;
    }));
  }
  return pending.get(key);
}
