/**
 * Mark a string as raw HTML.
 */
export function raw(value: any): { __html: string } {
  return { __html: String(value) };
}

/**
 * Escape HTML special characters.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Trim common indent from multiline literal segments,
 * join them with single spaces, and collapse spaces between tags.
 */
function cleanLiteralSegment(s: string): string {
  if (!s.includes('\n')) return s;

  // split into lines, drop leading/trailing blank lines
  const lines = s.split(/\r?\n/);
  let start = 0, end = lines.length;
  while (start < end && lines[start].trim() === '') start++;
  while (end > start && lines[end - 1].trim() === '') end--;
  const relevant = lines.slice(start, end);
  if (relevant.length === 0) return '';

  // find min indent of non-blank lines
  const indents = relevant
    .filter(l => l.trim() !== '')
    .map(l => (l.match(/^(\s*)/)![1].length));
  const minIndent = Math.min(...indents);

  // remove that indent, join with spaces, then collapse > <  
  const joined = relevant
    .map(l => l.slice(minIndent))
    .join(' ')
    .replace(/>\s+</g, '><');

  return joined;
}

/**
 * HTML template tag that escapes values by default,
 * inlines raw HTML when wrapped in `raw(...)`, 
 * and handles arrays.
 */
export function html(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  let out = '';

  for (let i = 0; i < strings.length; i++) {
    out += cleanLiteralSegment(strings[i]);

    if (i >= values.length) continue;
    const val = values[i];
    if (val == null) continue;

    const render = (v: any): string => {
      if (
        v &&
        typeof v === 'object' &&
        typeof (v as any).__html === 'string'
      ) {
        return (v as any).__html;
      }
      return escapeHtml(String(v));
    };

    if (Array.isArray(val)) {
      out += val
        .filter(v => v != null)
        .map(render)
        .join('')
    } else {
      out += render(val);
    }
  }

  return out;
}
