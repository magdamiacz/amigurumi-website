from pathlib import Path
from pillow_heif import register_heif_opener
from PIL import Image

register_heif_opener()

root = Path(__file__).resolve().parents[1] / "assets" / "images" / "oferta"
heif_markers = (b"ftypheic", b"ftypheif", b"ftypmif1", b"ftypmsf1", b"ftypheix")

converted = 0
failed = []

for path in root.rglob("*"):
    if not path.is_file() or path.suffix.lower() not in {".jpg", ".jpeg", ".heic", ".heif"}:
        continue
    data = path.read_bytes()[:32]
    if not any(m in data for m in heif_markers):
        continue
    try:
        img = Image.open(path)
        rgb = img.convert("RGB")
        tmp = path.with_suffix(".tmp.jpg")
        rgb.save(tmp, "JPEG", quality=90, optimize=True)
        tmp.replace(path if path.suffix.lower() in {".jpg", ".jpeg"} else path.with_suffix(".jpg"))
        if path.suffix.lower() not in {".jpg", ".jpeg"} and path.exists():
            path.unlink()
        converted += 1
        print("converted", path.relative_to(root))
    except Exception as exc:
        failed.append((str(path), str(exc)))
        print("FAIL", path, exc)

print("converted", converted, "failed", len(failed))
