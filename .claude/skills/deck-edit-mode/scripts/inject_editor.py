#!/usr/bin/env python3
"""
inject_editor.py — Inject (or upgrade) the deck-edit-mode editor into an HTML file.

Usage:
  python inject_editor.py <target.html>
  python inject_editor.py <target.html> --remove

Options:
  --remove   Strip the editor from the file instead of injecting it.
"""

import sys
import re
from pathlib import Path

MARKER_START = '<!-- deck-edit-mode:start -->'
MARKER_END   = '<!-- deck-edit-mode:end -->'

SCRIPT_DIR = Path(__file__).parent


def read_asset(filename: str) -> str:
    path = SCRIPT_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Asset not found: {path}")
    return path.read_text(encoding='utf-8')


def build_injection() -> str:
    css = read_asset('editor.css')
    js  = read_asset('editor.js')
    return (
        f'{MARKER_START}\n'
        f'<style id="deck-editor-css">\n{css}\n</style>\n'
        f'<script id="deck-editor-js">\n{js}\n</script>\n'
        f'{MARKER_END}'
    )


def inject(html: str) -> str:
    # Remove previous injection if present
    html = strip(html)
    # Insert just before </body>
    if '</body>' in html:
        return html.replace('</body>', build_injection() + '\n</body>', 1)
    return html + '\n' + build_injection()


def strip(html: str) -> str:
    pattern = re.compile(
        re.escape(MARKER_START) + r'.*?' + re.escape(MARKER_END),
        re.DOTALL
    )
    return pattern.sub('', html)


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)

    target = Path(args[0])
    remove = '--remove' in args

    if not target.exists():
        print(f"Error: file not found — {target}", file=sys.stderr)
        sys.exit(1)

    html = target.read_text(encoding='utf-8')
    result = strip(html) if remove else inject(html)
    target.write_text(result, encoding='utf-8')

    action = 'removed from' if remove else 'injected into'
    print(f"✓ Editor {action}: {target}")


if __name__ == '__main__':
    main()
