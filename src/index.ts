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
 * HTML interpolation from a template string + vars map.
 */
export function html(
  template: string,
  vars: Record<string, any>
): string {
  // 1. clean up indent, trim blank lines, collapse > <
  const cleaned = cleanLiteralSegment(template)

  // 2. rendering logic: raw HTML vs escaped
  const render = (v: any): string => {
    if (
      v &&
      typeof v === 'object' &&
      typeof (v as any).__html === 'string'
    ) {
      return (v as any).__html
    }
    return escapeHtml(String(v))
  }

  // 3. replace all $.varName occurrences
  return cleaned.replace(/\$\.(\w+)/g, (_match, name) => {
    const val = vars[name]
    if (val == null) return ''
    if (Array.isArray(val)) {
      return val
        .filter(v => v != null)
        .map(render)
        .join('')
    }
    return render(val)
  })
}
