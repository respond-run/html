export function raw(value: any) {
  return { __html: String(value) };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Collapse leading indentation from multiline strings,
 * but avoid injecting extra spaces between HTML tags.
 */
function cleanLiteralSegment(s: string): string {
  if (!s.includes('\n')) return s;
  return s
    .split('\n')
    .map(line => line.trim())
    .join('');
}

export function html(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  let result = '';

  for (let i = 0; i < strings.length; i++) {
    result += cleanLiteralSegment(strings[i]);

    const value = values[i];
    if (value == null) continue;

    if (Array.isArray(value)) {
      result += value
        .map(v =>
          typeof v === 'object' && v?.__html != null
            ? v.__html
            : escapeHtml(String(v))
        )
        .join('');
    } else if (typeof value === 'object' && value?.__html != null) {
      result += value.__html;
    } else {
      result += escapeHtml(String(value));
    }
  }

  return result;
}
