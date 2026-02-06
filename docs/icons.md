# Icon configuration

## Finding an icon

This project is configured to automatically pull icons sets from [Iconify](https://icon-sets.iconify.design/).

### Searching on Iconify

Search for the icon you want to use. Prefer the [material symbols light](https://icon-sets.iconify.design/material-symbols-light/) icon set. If none match, search for any icon on [Iconify](https://icon-sets.iconify.design/). Once chosen, copy the name of the icon (e.g. `material-symbols-light:crown`).

> Note: You can change the dropdown to the option that shows (UnoCSS) to get the correct name with no change required.

### Google fonts

For a much better icon search, use [Google fonts](https://fonts.google.com/icons?icon.size=24&icon.color=%231f1f1f&icon.platform=web). Google fonts has much better icon tagging and so makes it much easier to find options.

The icon name is at the bottom of the sidebar on the right once you click on the icon (e.g. `crown`). The icons found in google search will always be `material-symbols-light` icons for the purposes of usage.

> Note: Some Google fonts icons will not exist in the iconify package.

## Showing the icon

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
