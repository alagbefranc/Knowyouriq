"""Regenerate brand images from prompts.json.

Usage: OPENAI_API_KEY=... python3 generate.py prompts.json
Writes PNGs to ./raw. Jobs with "ref" need that image in ./raw first (run quo-wave before the poses).
Existing files are skipped; add "force": true to a job to redo it.
"""
import base64, json, os, sys, time, urllib.request, urllib.error, uuid
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
KEY = os.environ["OPENAI_API_KEY"]
OUT = os.path.join(HERE, "raw")
os.makedirs(OUT, exist_ok=True)
DEFAULT_MODEL = os.environ.get("IMG_MODEL", "gpt-image-2.6-sunburst")


def post(url, body, headers):
    req = urllib.request.Request(url, data=body, headers={"Authorization": f"Bearer {KEY}", **headers})
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return {"error": e.read().decode()[:600], "status": e.code}
    except Exception as e:  # network
        return {"error": repr(e), "status": 0}


def multipart(fields, files):
    b = uuid.uuid4().hex
    out = b""
    for k, v in fields.items():
        out += f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    for k, path in files:
        out += f'--{b}\r\nContent-Disposition: form-data; name="{k}"; filename="{os.path.basename(path)}"\r\nContent-Type: image/png\r\n\r\n'.encode()
        out += open(path, "rb").read() + b"\r\n"
    out += f"--{b}--\r\n".encode()
    return out, f"multipart/form-data; boundary={b}"


def run(job):
    name = job["name"]
    dest = os.path.join(OUT, name + ".png")
    if os.path.exists(dest) and not job.get("force"):
        return name, "skip", None
    model = job.get("model", DEFAULT_MODEL)
    fields = {"model": model, "prompt": job["prompt"], "size": job.get("size", "1024x1024"),
              "background": job.get("background", "transparent"), "output_format": "png", "n": 1}
    if job.get("quality"):
        fields["quality"] = job["quality"]
    t = time.time()
    for attempt in range(3):
        if job.get("ref"):
            refs = job["ref"] if isinstance(job["ref"], list) else [job["ref"]]
            body, ct = multipart(fields, [("image[]", os.path.join(OUT, r + ".png")) for r in refs])
            d = post("https://api.openai.com/v1/images/edits", body, {"Content-Type": ct})
        else:
            d = post("https://api.openai.com/v1/images/generations", json.dumps(fields).encode(),
                     {"Content-Type": "application/json"})
        if "data" in d:
            open(dest, "wb").write(base64.b64decode(d["data"][0]["b64_json"]))
            return name, f"ok {time.time()-t:.0f}s", d.get("usage")
        if d.get("status") not in (0, 429, 500, 502, 503):
            break
        time.sleep(5 * (attempt + 1))
    return name, "FAIL", d


jobs = json.load(open(sys.argv[1]))
with ThreadPoolExecutor(int(os.environ.get("PAR", "4"))) as ex:
    for name, status, info in ex.map(run, jobs):
        print(name, status, info, flush=True)
