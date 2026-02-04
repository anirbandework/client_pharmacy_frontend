# Font Setup Instructions

## Required Fonts

1. **BauhausStd-Medium** - Custom font
2. **Inter** - Google Font (auto-loaded)

## Setup BauhausStd-Medium

Place the following font files in `public/fonts/`:
- `BauhausStd-Medium.woff2`
- `BauhausStd-Medium.woff`

## Usage in Components

```jsx
// Default (Bauhaus)
<div className="font-sans">Text in Bauhaus</div>

// Inter font
<div className="font-inter">Text in Inter</div>

// Explicit Bauhaus
<div className="font-bauhaus">Text in Bauhaus</div>
```

## Font Classes Available

- `font-sans` - BauhausStd-Medium (default)
- `font-inter` - Inter font family
- `font-bauhaus` - BauhausStd-Medium (explicit)

## Note

If BauhausStd-Medium font files are not available, the system will fallback to system fonts.