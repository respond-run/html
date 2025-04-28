/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { html, raw } from '../src';

describe('html(template, vars) function', () => {
  it('renders basic HTML with no interpolations', () => {
    const result = html('<div class="box">Hello</div>', {});
    expect(result).toBe('<div class="box">Hello</div>');
  });

  it('renders with string interpolation (escaped)', () => {
    const user = '<b>Winton</b>';
    const result = html('<p>Hello, $.user!</p>', { user });
    expect(result).toBe('<p>Hello, &lt;b&gt;Winton&lt;/b&gt;!</p>');
  });

  it('renders with raw HTML interpolation (unescaped)', () => {
    const content = raw('<b>Bold</b>');
    const result = html('<div>$.content</div>', { content });
    expect(result).toBe('<div><b>Bold</b></div>');
  });

  it('removes indentation from multiline input', () => {
    const tpl = `
      <div>
        <p>One</p>


        <p>Two</p>
      </div>
    `;
    const result = html(tpl, {});
    expect(result).toBe('<div><p>One</p><p>Two</p></div>');
  });

  it('trims leading and trailing whitespace in multiline literals', () => {
    const tpl = `
      <section>
        <h1>Title</h1>
      </section>
    `;
    const result = html(tpl, {});
    expect(result).toBe('<section><h1>Title</h1></section>');
  });

  it('preserves whitespace in single-line literals', () => {
    const result = html('<p>Hello, $.world!</p>', { world: 'World' });
    expect(result).toBe('<p>Hello, World!</p>');
  });

  it('renders an array of escaped values', () => {
    const list = ['<a>1</a>', '<a>2</a>'];
    const result = html('<nav>$.list</nav>', { list });
    expect(result).toBe('<nav>&lt;a&gt;1&lt;/a&gt;&lt;a&gt;2&lt;/a&gt;</nav>');
  });

  it('renders an array of raw HTML values', () => {
    const list = [ raw('<li>One</li>'), raw('<li>Two</li>') ];
    const result = html('<ul>$.list</ul>', { list });
    expect(result).toBe('<ul><li>One</li><li>Two</li></ul>');
  });

  it('ignores null or undefined values', () => {
    const result = html('<p>$.user</p>', { user: null });
    expect(result).toBe('<p></p>');
  });

  it('escapes quotes in interpolated strings', () => {
    const quote = `"hello" & 'world'`;
    const result = html('<span title="$.quote"></span>', { quote });
    expect(result).toBe('<span title="&quot;hello&quot; &amp; &#39;world&#39;"></span>');
  });

  it('renders numbers and booleans correctly', () => {
    const result = html('<p>$.zero$.false$.true</p>', {
      zero: 0,
      false: false,
      true: true
    });
    expect(result).toBe('<p>0falsetrue</p>');
  });

  it('ignores null and undefined inside arrays', () => {
    const list = [ null, 'A', undefined, 'B' ];
    const result = html('<span>$.list</span>', { list });
    expect(result).toBe('<span>AB</span>');
  });

  it('escapes plain objects', () => {
    const obj = { foo: '<bar>' };
    const result = html('<div>$.obj</div>', { obj });
    expect(result).toBe('<div>[object Object]</div>');
  });

  it('renders empty arrays as empty', () => {
    const result = html('<ul>$.arr</ul>', { arr: [] });
    expect(result).toBe('<ul></ul>');
  });

  it('handles mixed raw and escaped in one array', () => {
    const arr = [ raw('<i>ok</i>'), '<bad>' ];
    const result = html('<p>$.arr</p>', { arr });
    expect(result).toBe('<p><i>ok</i>&lt;bad&gt;</p>');
  });
});
