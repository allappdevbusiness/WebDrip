#!/usr/bin/env python3
"""Post one AI typography image to TikTok (via Buffer), then delete it from Buffer.

Flow: render 1080x1920 JPEG -> upload to R2 (webdripmedia) -> Buffer createPost
(shareNow, TikTok) -> poll until sent -> deletePost in Buffer.
Auth is injected by the agent proxy for api.buffer.com / api.cloudflare.com.
State lives in state.json next to this file (next unposted item + results log).
Run:  python3 post_ai.py [--dry]   (--dry renders only, to ./out/)
"""
import json, os, subprocess, sys, time, urllib.request
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.environ.get("AI_FONT_DIR", os.path.join(HERE, "fonts"))
ACCT = "bc36f4ca6663d8b1d8e99157d0d62d1a"
BUCKET = "webdripmedia"
R2_PUBLIC = "https://pub-027038837b0f4c1bb96993e264c3509a.r2.dev"
TIKTOK_CHANNEL = "6ac073edea19ca0bde5e4a87"
W, H = 1080, 1920
STATE = os.path.join(HERE, "state.json")

# bg gradient top/bottom, headline colour, accent (highlighted word / bar)
THEMES = {
    "acid":   ((8, 8, 8), (30, 30, 30), (255, 255, 255), (198, 255, 0)),
    "red":    ((20, 0, 0), (90, 0, 10), (255, 255, 255), (255, 214, 0)),
    "violet": ((20, 0, 60), (70, 0, 140), (255, 255, 255), (0, 255, 200)),
    "yellow": ((255, 221, 0), (255, 190, 0), (10, 10, 10), (230, 20, 20)),
    "cyan":   ((0, 20, 40), (0, 80, 110), (255, 255, 255), (255, 70, 150)),
}


def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name + ".ttf"), size)


def grad(top, bot):
    img = Image.new("RGB", (W, H), top)
    px = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        px.line([(0, y), (W, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    return img


def fit(draw, text, fname, max_w, start, min_size=70):
    size = start
    while size > min_size:
        f = font(fname, size)
        if draw.textlength(text, font=f) <= max_w:
            return f
        size -= 4
    return font(fname, min_size)


def render(post, path):
    top, bot, fg, accent = THEMES[post["theme"]]
    img = grad(top, bot)
    d = ImageDraw.Draw(img)
    # TikTok safe zone: keep text inside x 70..1010, y 260..1500
    d.rectangle([70, 300, 250, 322], fill=accent)
    kicker = font("bebas-neue", 64)
    d.text((70, 345), post["kicker"].upper(), font=kicker, fill=accent)

    lines = post["lines"]  # list of (text, is_accent)
    y = 520
    for text, hot in lines:
        f = fit(d, text, "anton", W - 140, 230)
        bbox = d.textbbox((0, 0), text, font=f)
        h = bbox[3] - bbox[1]
        if hot:
            d.rectangle([60, y - 6, 60 + (bbox[2] - bbox[0]) + 40, y + h + 30], fill=accent)
            d.text((80, y - bbox[1]), text, font=f, fill=top if post["theme"] != "yellow" else (255, 255, 255))
        else:
            d.text((72, y - bbox[1] + 4), text, font=f, fill=(0, 0, 0, 90) if False else fg)
        y += h + 56

    sub = font("bebas-neue", 78)
    d.text((70, min(y + 20, 1420)), post["sub"].upper(), font=sub, fill=fg)
    foot = font("bebas-neue", 54)
    d.text((70, 1620), "FOLLOW @GETWEBDRIP  •  SAVE THIS", font=foot, fill=accent)
    img.save(path, "JPEG", quality=92)


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def r2_upload(local, key):
    r = run(["curl", "-sS", "-X", "PUT",
             f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/r2/buckets/{BUCKET}/objects/{key}",
             "-H", "Content-Type: image/jpeg", "--data-binary", f"@{local}"])
    if '"success":true' not in r.stdout:
        raise RuntimeError("R2 upload failed: " + r.stdout[:300] + r.stderr[:200])
    return f"{R2_PUBLIC}/{key}"


def gql(query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request("https://api.buffer.com", body, {"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))


CREATE = """mutation($i: CreatePostInput!){ createPost(input:$i){ __typename
 ... on PostActionSuccess { post { id status } }
 ... on MutationError { message } } }"""
POLL = "query($id: PostId!){ post(input:{id:$id}){ id status externalLink error{message} } }"
DELETE = "mutation($id: PostId!){ deletePost(input:{id:$id}){ __typename } }"


def main():
    dry = "--dry" in sys.argv
    posts = json.load(open(os.path.join(HERE, "posts.json")))
    state = json.load(open(STATE)) if os.path.exists(STATE) else {"next": 0, "log": []}
    n = state["next"] % len(posts)
    post = posts[n]
    out = os.path.join(HERE, "out")
    os.makedirs(out, exist_ok=True)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    local = os.path.join(out, f"ai-{n:02d}-{stamp}.jpg")
    render(post, local)
    print("rendered", local)
    if dry:
        return
    url = r2_upload(local, f"ai-posts/ai-{n:02d}-{stamp}.jpg")
    text = post["caption"] + "\n\n" + " ".join(post["tags"])
    res = gql(CREATE, {"i": {
        "channelId": TIKTOK_CHANNEL, "text": text, "schedulingType": "automatic",
        "mode": "shareNow", "needsApproval": False,
        "assets": [{"image": {"url": url}}],
        "metadata": {"tiktok": {"title": post["caption"][:90], "isAiGenerated": False}},
    }})
    print(json.dumps(res)[:500])
    node = (res.get("data") or {}).get("createPost") or {}
    pid = (node.get("post") or {}).get("id")
    entry = {"n": n, "at": stamp, "url": url, "post_id": pid, "result": node.get("__typename")}
    if pid:
        status = None
        for _ in range(40):
            time.sleep(6)
            p = gql(POLL, {"id": pid})["data"]["post"]
            status = p["status"]
            if status in ("sent", "error", "failed"):
                entry.update(status=status, link=p.get("externalLink"), error=p.get("error"))
                break
        print("status", status, entry.get("link"), entry.get("error"))
        if status == "sent":
            dres = gql(DELETE, {"id": pid})
            entry["buffer_deleted"] = dres.get("data", {}).get("deletePost", {}).get("__typename")
            print("buffer delete:", entry["buffer_deleted"])
            state["next"] = n + 1
    else:
        entry["error"] = node.get("message") or json.dumps(res)[:300]
    state["log"].append(entry)
    json.dump(state, open(STATE, "w"), indent=1)


if __name__ == "__main__":
    main()
