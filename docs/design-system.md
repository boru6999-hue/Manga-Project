# Manga Project – Design System

## Зорилго
Энэхүү design system нь Manga / Anime веб сайтын
UI элементүүд, өнгө, бичвэр, component-ийн стандартыг тодорхойлно.
Frontend хөгжүүлэлтэд нэг ижил харагдац, дахин ашиглалт, scalability хангана.
Төслийн бүх developer болон designer‑д зориулсан стандарт баримт болно.

---

## 1. Color Palette

| Name           | Hex       | Usage                        |
|----------------|-----------|-----------------------------|
| Primary        | #000000   | Buttons, links, active state|
| Secondary      | #000000   | Highlights, hover effect    |
| Background     | #000000   | Page background             |
| Surface        | #000000   | Cards, modals               |
| Text Primary   | #000000   | Main text                   |
| Text Secondary | #000000   | Metadata, secondary text    |
| Success        | #000000   | Confirmations               |
| Error          | #000000   | Error messages              |

> 💡 Recommendation: Tailwind config-д color variables‑ийг тохируул

---

## 2. Typography

| Element | Font Family        | Size | Weight  | Usage                   |
|---------|-----------------|------|--------|------------------------|
| H1      | Poppins, sans-serif | 48px | Bold   | Page titles            |
| H2      | Inter, sans-serif   | 36px | SemiBold | Section headings      |
| H3      | Inter, sans-serif   | 24px | Medium | Card titles, subtitles |
| Body    | Inter, sans-serif   | 16px | Regular | Normal text           |
| Small   | Inter, sans-serif   | 14px | Regular | Metadata, timestamps  |
| Link    | Inter, sans-serif   | 16px | Medium | Buttons, navigation   |

---

## 3. Spacing & Layout

- Base spacing unit: 4px
- Small: 8px, Medium: 16px, Large: 32px
- Layout recommendation:
  - Grid layout for manga cards
  - Responsive breakpoints: sm, md, lg
  - Consistent padding and margin throughout pages

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
  <MangaCard title="One Piece" />
</div>
