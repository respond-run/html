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
 * If the literal segment contains a newline, we assume it comes from
 * formatted (multiline) template input and collapse excessive whitespace.
 * Otherwise, we return it untouched.
 */
function cleanLiteralSegment(s: string): string {
  if (!s.includes('\n')) {
    return s;
  }
  return s
    .replace(/\s*\n\s*/g, ' ')  // Collapse newlines (and surrounding spaces) to a single space
    .replace(/\s{2,}/g, ' ')     // Collapse multiple spaces to one
    .trim();                    // Trim start and end
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
