# Pathfinder 2e manager

A manager for Pathfinder 2e that allows searching, saving and printing items and spells.

Deployed at [https://emandm.github.io/pathfinder-2e-manager/](https://emandm.github.io/pathfinder-2e-manager/)

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run dev
```

### Compiles and minifies for production

```bash
npm run build
```

### Custom theme

See `src/styles/element/index.scss`.

## Project information

This project was bootstraped from [element-plus-vite-starter](https://github.com/element-plus/element-plus-vite-starter). and inspired by [Pathfinder-2e-Spell-DB](https://github.com/fyjham-ts/Pathfinder-2E-Spell-DB).

### Tooling

- Web framework - [Vue](https://vuejs.org/guide/quick-start.html)
- Component library - [Element Plus](https://element-plus.org/en-US/component/overview.html)
- Page routing - [Unplugin Vue Router](https://uvr.esm.is/guide/file-based-routing.html)
- Markdown - [Unplugin Vue markdown](https://github.com/unplugin/unplugin-vue-markdown)
- CSS Utility - [UnoCSS](https://unocss.dev/guide/): provides composable css features following the idea of [atomic css](https://antfu.me/posts/reimagine-atomic-css)
- CSS - [Sass]() and [UnoCSS](https://unocss.dev/guide/)
- Bundler - [Vite](https://vite.dev/guide/features.html)
- Linting - [EsLint](https://eslint.org/docs/latest/), configured by [antfu](https://github.com/antfu/eslint-config)
- Icons - [Unplugin Icons](https://github.com/unplugin/unplugin-icons) using mainly [Material Symbols Light](https://icon-sets.iconify.design/material-symbols-light/)

### Using Icons

Search for the icon you want to use. Prefer the [material symbols light](https://icon-sets.iconify.design/material-symbols-light/) icon set. If none match, search for any icon on [Iconify](https://icon-sets.iconify.design/).

Once chosen, copy the name of the icon (e.g. `material-symbols-light:crown`).

> Note: You can change the dropdown to the option that shows (UnoCSS) to get the correct name with no change required.

Use the icon in HTML using the [el-icon](https://element-plus.org/en-US/component/icon.html#combined-with-el-icon) component from Element Plus. Add `i` as the prefix for the name, and swap the `:` for a `-`

The final name convention is `i-{icon set name}-{icon name}` (e.g. `i-material-symbols-light-crown`)

```html
<el-icon size="18" color="hotpink">
  <i-material-symbols-light-crown />
</el-icon>
```

You can use `msl` as a shorthand for `material-symbols-light`

```html
<el-icon size="18" color="hotpink">
  <i-msl-crown />
</el-icon>
```

You can also use the `i` html attribute to apply the icon. Note, this does not allow the `msl` shorthand.

```html
<div inline-flex i="material-symbols-light-crown"></div>
```
