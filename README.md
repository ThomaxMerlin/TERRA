# Terra — A living planet

Interactive Three.js Earth atlas with 195 countries, 617 country destinations, natural features, and place photo albums.

## Deploy with Cloudflare Pages

Connect this repository in Cloudflare **Workers & Pages → Create application → Pages → Import an existing Git repository**.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | `exit 0` |
| Build output directory | `.` |
| Root directory | Leave blank |

Select **Save and Deploy**. Cloudflare will provide the live `pages.dev` address. Subsequent pushes to `main` trigger automatic deployments after the integration is configured.

The repository contains the ready-to-serve site. `index.html` is at the repository root, alongside the JavaScript, CSS, and `assets/` directory.

## Explore

Rotate and zoom the globe, choose a country, and select a place marker to open its detail view. Browse the directory to find destinations by name. Photo albums include source and license links. Some places use a location map and request a credited photograph from Wikimedia when opened. External photo availability depends on Wikimedia.

## Local preview

From the repository root, run `python3 -m http.server 8000`, then visit `http://localhost:8000`.

## Credits

Photograph attributions and licenses are included with the images in the site. City location data is from [GeoNames](https://www.geonames.org/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Preserve asset credits when redistributing the site.
