# CSS

**CSS (Cascading Style Sheets)** is a stylesheet language used to describe the presentation of a document written in HTML. It controls layout, colors, fonts, and responsive design.

## Syntax

```css
selector {
  property: value;
}
```

## How to Apply CSS

### Inline
```html
<p style="color: red;">Red text</p>
```

### Internal (in `<head>`)
```html
<style>
  p { color: red; }
</style>
```

### External (best practice)
```html
<link rel="stylesheet" href="styles.css">
```

## The Box Model

Every element is a box with:

```
┌────────────────────────────┐
│        Margin              │
│  ┌──────────────────────┐  │
│  │      Border          │  │
│  │  ┌────────────────┐  │  │
│  │  │   Padding      │  │  │
│  │  │  ┌──────────┐  │  │  │
│  │  │  │ Content  │  │  │  │
│  │  │  └──────────┘  │  │  │
│  │  └────────────────┘  │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

## Flexbox Example

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
```

## CSS Grid

Modern two-dimensional layout system:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

See also: [HTML](/wiki/HTML), [Django](/wiki/Django)
