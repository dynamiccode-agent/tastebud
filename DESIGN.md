# TasteBud — Design System

## Colors
- Brand gold: #F9BA0B (oklch(0.82 0.18 90))
- Black: #111111 (oklch(0.12 0.005 90))
- Background: #F9FAFB (gray-50)
- Surface: #FFFFFF
- Text primary: #111827 (gray-900)
- Text secondary: #6B7280 (gray-500)
- Text muted: #9CA3AF (gray-400)
- Destructive: #EF4444 (red-500)
- Success: #22C55E (green-500)

## Typography
- Font: system-ui (no custom font loaded yet)
- Scale: xs(10px) sm(12px) base(14px) lg(16px) xl(18px) 2xl(24px)
- Weight: normal(400) medium(500) semibold(600) bold(700) black(900)

## Spacing & Layout
- Max container: 448px (max-w-md), always centred
- Base unit: 4px
- Card radius: rounded-2xl (16px), sheet: rounded-t-3xl (24px)
- Safe areas: pb-6 safe-bottom on fixed elements

## Elevation
- Cards: shadow-sm
- Modals/sheets: no shadow (full-screen overlay)
- Sticky CTA: shadow-2xl

## Key Components
- Menu card: 2-col grid, aspect-square image, p-3 content
- Item modal: bottom sheet, 92dvh, swipe-to-dismiss, image hero top 42%
- Cart bar: fixed bottom, gold or black pill CTA
- Category pills: scrollable horizontal, black=active, white=inactive
- Toast: dark pill, gold check icon, bottom-28 position

## Motion
- Sheet open: cubic-bezier(0.32,0.72,0,1) 350ms
- Active press: scale-95 / scale-[0.97] / scale-90
- Toast: opacity + translateY, 300ms
