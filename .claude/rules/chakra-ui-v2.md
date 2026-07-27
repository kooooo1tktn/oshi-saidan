---
paths:
  - "src/**/*.tsx"
  - "src/theme.ts"
---

# Chakra UI v2 の規約

**このプロジェクトの Chakra UI は v2（`^2.10.9`）。v3 ではない。**
v3 は API が全く別物なので、新しい知識で書くと動かない。

| やること（v2）                                      | やってはいけないこと（v3 の書き方）            |
| --------------------------------------------------- | ---------------------------------------------- |
| `import { extendTheme } from "@chakra-ui/react"`    | `createSystem` / `defaultConfig`               |
| `<ChakraProvider theme={theme}>`                    | `<ChakraProvider value={system}>`              |
| `import { Box, Flex, ... } from "@chakra-ui/react"` | `@chakra-ui/react/box` のようなサブパス import |

`framer-motion` は Chakra v2 のピア依存。使っていないように見えても削除しないこと。

## テーマの現状

`src/theme.ts` は**フォントしかテーマ化していない**。

```ts
export const theme = extendTheme({
  fonts: {
    heading: '"Fredoka", "Noto Sans JP", sans-serif',
    body: '"Noto Sans JP", sans-serif',
  },
});
```

フォント本体は `src/styles/index.css` の Google Fonts `@import` で読み込んでいる。

## 色はハードコード

配色はテーマに載っておらず、各コンポーネントに直書きされている。
**色を変える依頼は複数ファイルにまたがる**ので、必ず全ファイルを検索してから作業すること。

| 用途                 | 値                       |
| -------------------- | ------------------------ |
| アクセント（ピンク） | `#FF6EB4`                |
| ホバー               | `#DD3888`                |
| くすんだ紫           | `#6650A0`                |
| 文字色               | `#1A0840`                |
| 淡い紫               | `#C8AAFF` / `#B0A0C8`    |
| 背景                 | `#F8F6FF`                |
| ボーダー             | `rgba(200,170,255,0.45)` |

## スタイルの書き方

CSS ファイルや `styled` ではなく、**Chakra の props で書く**。

グラスモーフィズムは以下の3点セット。カード類はこれに揃える。

```tsx
bg="rgba(255,255,255,0.72)"
style={{ backdropFilter: "blur(12px)" }}
borderRadius="2xl"
```

## コンポーネントの書き方

- `export const Name = () => {...}`（named arrow function）。`src/App.tsx` だけ例外。
- Props はコンポーネントの直上に `type Props = { ... }` を定義する。
- UI の文言はすべて日本語。
