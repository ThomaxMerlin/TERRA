from pathlib import Path, PurePosixPath
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.request import Request, urlopen
from urllib.parse import quote
import hashlib
import json
import time

BASE_URL = "https://terra-earth-atlas-f6d42.xl-tech666.chatgpt.site/"
manifest = json.loads(Path(".terra-import/manifest.json").read_text())
staging = Path(".terra-import/staging")
staging.mkdir(parents=True, exist_ok=True)

def transfer(entry):
    relative = PurePosixPath(entry["path"])
    if relative.is_absolute() or ".." in relative.parts:
        raise ValueError("Unsafe path")
    destination = staging / relative
    existing = Path(relative)
    if existing.is_file():
        data = existing.read_bytes()
        digest = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        if digest == entry["sha"]:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
            return entry["path"]
    url = BASE_URL + ("" if entry["path"] == "index.html" else quote(entry["path"]))
    for attempt in range(3):
        try:
            request = Request(url, headers={"User-Agent": "Terra-GitHub-Import/1.0"})
            with urlopen(request, timeout=60) as response:
                data = response.read()
            digest = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
            if len(data) != entry["size"] or digest != entry["sha"]:
                raise ValueError("Content checksum mismatch for " + entry["path"])
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
            return entry["path"]
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)

with ThreadPoolExecutor(max_workers=8) as pool:
    futures = [pool.submit(transfer, entry) for entry in manifest]
    for index, result in enumerate(as_completed(futures), start=1):
        result.result()
        if index % 100 == 0:
            print(f"Verified {index}/{len(manifest)} files", flush=True)

# Publish staged files only after every checksum passed.
for entry in manifest:
    destination = Path(entry["path"])
    if destination.exists():
        data = destination.read_bytes()
        digest = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        if digest != entry["sha"]:
            raise ValueError("Refusing to overwrite a different file: " + entry["path"])
for entry in manifest:
    destination = Path(entry["path"])
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes((staging / entry["path"]).read_bytes())
print(f"Verified and imported {len(manifest)} site files.")
