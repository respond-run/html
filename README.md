# @respond-run/html

A small utility for building safe HTML strings with support for interpolation, escaping, raw HTML, and whitespace cleanup.

## Features

- Escapes interpolated values by default  
- Inlines raw HTML via the `raw()` helper  
- Trims common indent and collapses excess whitespace in multi-line templates  
- Drops `null` and `undefined` values  

## Installation

```bash
npm install @respond-run/html
```

## Usage

```ts
import { html, raw } from '@respond-run/html'

const output = html(
  `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>$.title</title>
        $.styleLink
      </head>
      <body>
        $.body
      </body>
    </html>
  `,
  {
    title: '<My & Page>',
    styleLink: raw('<link rel="stylesheet" href="/main.css">'),
    body: [
      '<p>Safe text</p>',
      raw('<p>Unescaped <strong>HTML</strong></p>')
    ]
  }
)

console.log(output)
// → '<!doctype html><html lang="en"><head><meta charset="UTF-8"/><title>&lt;My &amp; Page&gt;</title><link rel="stylesheet" href="/main.css"></head><body><p>Safe text</p><p>Unescaped <strong>HTML</strong></p></body></html>'
```

### API

```ts
/**
 * Build an HTML string from a template and a vars map.
 */
function html(
  template: string,
  vars: Record<string, any>
): string

/**
 * Mark a value as raw HTML to be inlined without escaping.
 */
function raw(value: any): { __html: string }
```

## Tests

Run the unit suite with Vitest:

```bash
npm run test
```

## License

MIT