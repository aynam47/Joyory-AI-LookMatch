# Frontend Architecture

The frontend is a **React 19** single-page application built with **Vite 8**, **TypeScript 5.7**, and **TailwindCSS 4**.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | 19 | UI rendering & component model |
| TypeScript | 5.7 | Static typing |
| Vite | 8 | Dev server, bundler, API proxy |
| TailwindCSS | 4 | Utility-first CSS |
| React Router | 7 | Client-side routing |

---

## Directory Structure

```
frontend/src/
├── App.tsx                    # Root component — router, global state
├── main.tsx                   # React entry point (ReactDOM.createRoot)
├── index.css                  # Global styles & Tailwind imports
├── data.ts                    # Static fallback data (seed products)
├── vite-env.d.ts              # Vite environment type declarations
│
├── types/                     # Shared TypeScript interfaces
│   └── index.ts               # Product, MatchResult, etc.
│
├── utils/                     # Pure utility functions
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         # Top navigation bar with cart count & AI CTA
│   │   └── Footer.tsx         # Site footer
│   │
│   ├── home/
│   │   ├── Hero.tsx           # Landing hero with primary CTA
│   │   ├── Categories.tsx     # Category chip navigation
│   │   ├── FeaturedProducts.tsx  # Product grid for featured items
│   │   ├── HowItWorks.tsx     # Feature explainer section
│   │   ├── PromoBanner.tsx    # Promotional banner strip
│   │   └── Testimonials.tsx   # User review cards
│   │
│   └── ui/
│       ├── ProductCard.tsx    # Reusable product card with match score
│       ├── Toast.tsx          # Add-to-cart notification toast
│       └── VoiceChat.tsx      # Floating voice assistant widget
│
└── pages/
    ├── AILookMatchPage.tsx    # AI chat interface (main feature page)
    └── CategoryPage.tsx       # Filtered product listing by category
```

---

## Routing

Routing is handled by **React Router v7** in `App.tsx` using `BrowserRouter`.

| Path | Component | Description |
|---|---|---|
| `/` | `Home` (inline) | Landing page with hero, categories, and products |
| `/ai-lookmatch` | `AILookMatchPage` | AI chat interface |
| `/:category` | `CategoryPage` | Products filtered by URL category slug |

### Route Nesting

The outer `<Route path="/*">` wraps all routes in a persistent layout shell (`Navbar` + `Footer`), ensuring navigation and footer are always present regardless of the current page.

```tsx
// App.tsx (simplified)
<Router>
  <Routes>
    <Route path="/*" element={
      <div className="flex flex-col min-h-screen">
        <NavbarWrapper cartCount={cartCount} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-lookmatch" element={<AILookMatchPage />} />
            <Route path="/:category" element={<CategoryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    } />
  </Routes>
  <VoiceChat />
  <Toast show={showToast} />
</Router>
```

---

## Global State (`App.tsx`)

All application-level state lives in `App.tsx` and is passed down as props. There is intentionally no external state manager (no Redux, Zustand, etc.) to keep the MVP simple.

| State | Type | Purpose |
|---|---|---|
| `products` | `Product[]` | Product catalog fetched from `/api/products` on mount |
| `cartCount` | `number` | Running count of items added to cart |
| `showToast` | `boolean` | Controls the add-to-cart toast notification |

### Data Fetching

Products are fetched once on app mount via `useEffect`:

```tsx
useEffect(() => {
  fetch('http://localhost:8000/api/products')
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.error("Failed to fetch products", err))
}, [])
```

> In production, the `fetch` URL would be replaced with an environment variable and the Vite proxy would handle routing.

---

## AILookMatchPage — Component Deep Dive

This is the core feature page (`/ai-lookmatch`). It implements a chat-style interface.

### Local State

| State | Type | Purpose |
|---|---|---|
| `messages` | `Message[]` | Chat message history (user & AI messages) |
| `input` | `string` | Current text input value |
| `isListening` | `boolean` | Whether voice recognition is active |
| `loading` | `boolean` | Whether an AI request is in flight |
| `error` | `string` | Current error message to display |

### Message Type

```typescript
type Message = {
  id: string
  sender: 'ai' | 'user'
  text?: string
  image?: string        // Object URL for uploaded images
  results?: any[]       // MatchResult array from API
  attributes?: any      // AIAttributes (shown for image uploads)
}
```

### Input Modes & Data Flow

**Text input:**
```
User types text → handleSendText() → processInput(text)
  → POST /api/ai/product-name → AIAttributes
  → POST /api/match → MatchResponse
  → Append AI message with results to chat
```

**Voice input:**
```
User clicks mic → handleVoice()
  → Web Speech API (SpeechRecognition)
  → Interim results update input field in real-time
  → Final transcript submitted on recognition end
```

**Image upload:**
```
User selects file → handleImageSelect()
  → Validate type & size
  → processInput(undefined, file)
  → POST /api/ai/image (multipart) → AIAttributes
  → POST /api/match → MatchResponse
  → Append AI message with attributes card + results
```

### Voice Input — Browser Compatibility

Voice input relies on the **Web Speech API** (`window.SpeechRecognition`). This is supported in Chrome and Edge. Firefox does not support it. The component gracefully degrades with an error message if the API is unavailable.

---

## Component Conventions

### Naming
- **Components**: PascalCase (`ProductCard.tsx`)
- **Props interfaces**: Defined inline or as adjacent `type Props = {...}`
- **Hooks**: `useState`, `useEffect`, `useRef` from React

### Styling
All styling uses **TailwindCSS 4** utility classes applied directly in JSX. The design system uses:

| Token | Value | Usage |
|---|---|---|
| Primary pink | `#c9707a` | CTAs, active states, accents |
| Deep rose hover | `#b85f6a` | Hover state for primary elements |
| Background cream | `#faf7f5` | Page background |
| Text dark | `#2c2225` | Body text |
| Text muted | `#9a8287` | Secondary/placeholder text |
| Border rose | `#e8dcd8` | Card borders, input borders |
| Gold accent | `#d4af37` | Star icons, premium badges |

### Fonts
- **Body**: `Inter` (Google Fonts)
- **Display**: `Playfair Display` (headings on AI page)

---

## Vite Configuration

`vite.config.ts` includes an API proxy so frontend calls to `/api/*` are forwarded to the backend without CORS issues in development:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

This means all `fetch('/api/...')` calls in frontend code automatically reach the FastAPI backend during development.

---

## Adding a New Page

1. Create `frontend/src/pages/MyNewPage.tsx`
2. Add a `<Route>` entry in `App.tsx`:
   ```tsx
   <Route path="/my-new-page" element={<MyNewPage />} />
   ```
3. Add a navigation link in `Navbar.tsx` if needed

---

## Adding a New Component

1. Create the file in the appropriate subdirectory under `components/`
2. Export it as a named export: `export function MyComponent() {...}`
3. Import it where needed: `import { MyComponent } from './components/ui/MyComponent'`
