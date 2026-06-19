import os
import re
from pathlib import Path


def main() -> None:
    base = os.environ.get("BASE_PATH", "").rstrip("/")
    if not base:
        return

    asset_re = re.compile(
        r'(?P<attr>\b(?:src|href)=)(?P<quote>["\']?)/'
        r'(?P<path>(?:js|images|css|bootstrap-5|fontawesome-6)/[^"\' >]+|fav\.png|404\.png)'
    )

    for page in Path("public").rglob("*.html"):
        text = page.read_text(encoding="utf-8")
        text = asset_re.sub(
            lambda m: f'{m.group("attr")}{m.group("quote")}{base}/{m.group("path")}',
            text,
        )
        page.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
