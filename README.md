# @respond-run/html

A tiny HTML tagged template utility for building safe HTML strings with support for interpolation, escaping, and raw HTML.

## Features

- Escapes interpolated values by default
- Supports raw HTML via `raw()` helper
- Collapses excessive whitespace in multi-line templates
- Ignores `null` and `undefined` values

## Installation

```bash
npm install @respond-run/html
```

## Usage

```ts
import { html, raw } from '@respond-run/html';

const name = '<b>Winton</b>';
const safe = html`<p>Hello, ${name}!</p>`;
// => <p>Hello, &lt;b&gt;Winton&lt;/b&gt;!</p>

const unsafe = html`<div>${raw('<b>Bold</b>')}</div>`;
// => <div><b>Bold</b></div>
```

## Tests

```bash
npm run test
```

Runs unit tests using [Vitest](https://vitest.dev).

## License

MIT