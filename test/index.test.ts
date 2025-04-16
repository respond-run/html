/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { html, raw } from '../src';

describe('html tagged template', () => {
  it('renders basic HTML with no interpolations', () => {
    const result = html/*html*/`<div class="box">Hello</div>`;
    expect(result).toBe('<div class="box">Hello</div>');
  });

  it('renders with string interpolation (escaped)', () => {
    const user = '<b>Winton</b>';
    const result = html/*html*/`<p>Hello, ${user}!</p>`;
    expect(result).toBe('<p>Hello, &lt;b&gt;Winton&lt;/b&gt;!</p>');
  });

  it('renders with raw HTML interpolation (unescaped)', () => {
    const content = raw('<b>Bold</b>');
    const result = html/*html*/`<div>${content}</div>`;
    expect(result).toBe('<div><b>Bold</b></div>');
  });

  it('removes indentation from multiline input', () => {
    const result = html/*html*/`
      <div>
        <p>One</p>


        <p>Two</p>
      </div>
    `;
    expect(result).toBe('<div><p>One</p><p>Two</p></div>');
  });

  it('trims leading and trailing whitespace in multiline literals', () => {
    const result = html/*html*/`
      <section>
        <h1>Title</h1>
      </section>
    `;
    expect(result).toBe('<section><h1>Title</h1></section>');
  });

  it('preserves whitespace in single-line literals', () => {
    const result = html/*html*/`<p>Hello, ${'World'}!</p>`;
    expect(result).toBe('<p>Hello, World!</p>');
  });

  it('renders an array of escaped values', () => {
    const list = ['<a>1</a>', '<a>2</a>'];
    const result = html/*html*/`<nav>${list}</nav>`;
    expect(result).toBe('<nav>&lt;a&gt;1&lt;/a&gt;&lt;a&gt;2&lt;/a&gt;</nav>');
  });

  it('renders an array of raw HTML values', () => {
    const list = [raw('<li>One</li>'), raw('<li>Two</li>')];
    const result = html/*html*/`<ul>${list}</ul>`;
    expect(result).toBe('<ul><li>One</li><li>Two</li></ul>');
  });

  it('ignores null or undefined values', () => {
    const user = null;
    const result = html/*html*/`<p>${user}</p>`;
    expect(result).toBe('<p></p>');
  });

  it('escapes quotes in interpolated strings', () => {
    const quote = `"hello" & 'world'`;
    const result = html/*html*/`<span title="${quote}"></span>`;
    expect(result).toBe('<span title="&quot;hello&quot; &amp; &#39;world&#39;"></span>');
  });
});
