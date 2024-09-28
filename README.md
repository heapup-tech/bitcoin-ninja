## Docunicorn

Docunicorn is a docs template powered by [Contentlayer](https://contentlayer.dev) and [Next.js](https://nextjs.org/)

## Config Theme

Docunicorn use shadcn/ui be ui framework. you can copy theme from [10000+
Themes for shadcn/ui](https://ui.jln.dev/) to `styles/gobals.css`

## Code Theme

Configure the code theme using `rehype-pretty-code` in `contentlayer.config.ts`.

[rehype-pretty-code](https://rehype-pretty.pages.dev) is a rehype plugin powered by the [shiki](https://shiki.style) syntax highlighter that provides beautiful code blocks for Markdown or MDX

All built-in themes

```ts
type BundledTheme =
  | 'andromeeda'
  | 'aurora-x'
  | 'ayu-dark'
  | 'catppuccin-frappe'
  | 'catppuccin-latte'
  | 'catppuccin-macchiato'
  | 'catppuccin-mocha'
  | 'dark-plus'
  | 'dracula'
  | 'dracula-soft'
  | 'github-dark'
  | 'github-dark-default'
  | 'github-dark-dimmed'
  | 'github-light'
  | 'github-light-default'
  | 'houston'
  | 'laserwave'
  | 'light-plus'
  | 'material-theme'
  | 'material-theme-darker'
  | 'material-theme-lighter'
  | 'material-theme-ocean'
  | 'material-theme-palenight'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'night-owl'
  | 'nord'
  | 'one-dark-pro'
  | 'one-light'
  | 'poimandres'
  | 'red'
  | 'rose-pine'
  | 'rose-pine-dawn'
  | 'rose-pine-moon'
  | 'slack-dark'
  | 'slack-ochin'
  | 'snazzy-light'
  | 'solarized-dark'
  | 'solarized-light'
  | 'synthwave-84'
  | 'tokyo-night'
  | 'vesper'
  | 'vitesse-black'
  | 'vitesse-dark'
  | 'vitesse-light'
```

[Supported Languages](https://shiki.style/languages)

## Markdown style

Markdown components have been mapped to `src/components/mdx-components.tsx`. You can modify the component code in this file to change the styles of Markdown components.

Alternatively, you can update the file `src/styles/mdx.css` directly.
