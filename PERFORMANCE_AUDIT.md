# ANON INDIA — Performance & Caching Audit

**Goal:** Ensure a hyper-fast, CDN-cached, and database-efficient real-estate website with minimal TTFB, optimized image delivery, and real-time cache revalidation.

**Verdict:** The codebase is built with solid architectural principles—utilizing Next.js Static Site Generation (SSG), Incremental Static Regeneration (ISR), client-side filtering via `<Suspense>` boundaries to preserve static builds, and native Intersection Observers for layout reveals. However, there are critical gaps in **cache revalidation flow**, **uncached home page queries**, **missing database indexes**, and **unoptimized stock and user images** that limit the site from achieving a perfect performance tier.

---

## Performance Scorecard (1–10)

| Dimension | Score | Assessment |
|---|---|---|
| **Rendering Strategy** | **9** | Excellent use of SSG, ISR, and client-side Suspense. Very low TTFB. |
| **Caching & Revalidation** | **5** | Tag-based cache is defined but never invalidated on-demand in Admin Actions. |
| **Database & Indexing** | **6** | Good column selection, but lacks critical indexes on filters and high-frequency checks. |
| **Asset Optimization** | **6** | Hero images are priority-tagged, but avatars and developer logos bypass Next.js Image optimization. |
| **Bundle & Execution** | **9** | Native IntersectionObserver reveals, shaked Lucide package, and clean code paths. |
| **Overall Score** | **7.0/10** | A solid setup that can easily reach **9.5/10** by solving 3-4 specific caching and asset issues. |

---

## 1. Caching & Revalidation Flow (Critical Risk)

### Current Setup
The application leverages Next.js `unstable_cache` to store data like menu projects, city lists, and global site settings. It defines tags like `['projects']`, `['site-settings']`, and `['blog']`.

### Issues Found
1. **Broken Tag Revalidation:** 
   Although cache tags are assigned to queries, **`revalidateTag` is never called** in any of the Server Actions when an admin modifies, deletes, or inserts records. 
2. **Stale Data Propagation:** 
   Because settings and city aggregations use a 1-hour cache TTL (`revalidate: 3600`), modifications made by the admin (such as changing the contact WhatsApp number, updating RERA numbers, or shifting a project to another city) take **up to 60 minutes** to display on public pages.
3. **Incomplete Path Revalidation:** 
   Admin actions only invoke `revalidatePath` for admin dashboards (e.g. `revalidatePath('/admin/projects')`). The public routes—like the `/projects` page, `/gallery`, `/blog`, or project/blog detail pages—are never revalidated on-demand when updates occur.

### Proposed Fixes
* **Implement Tag-based Revalidation:** Call `revalidateTag` inside Server Actions so edits take effect globally and instantly:
  * In [projects/actions.ts](file:///Users/sukumarsaurav/Personal/anon-india/website/src/app/admin/projects/actions.ts): Add `revalidateTag('projects')` on create, update, delete, and sort actions.
  * In [settings/actions.ts](file:///Users/sukumarsaurav/Personal/anon-india/website/src/app/admin/settings/actions.ts): Add `revalidateTag('site-settings')` on save.
  * In [blog/actions.ts](file:///Users/sukumarsaurav/Personal/anon-india/website/src/app/admin/blog/actions.ts): Add `revalidateTag('blog')` on publish/unpublish/delete.
* **Add Broad Path Revalidation:** Ensure `revalidatePath('/')`, `revalidatePath('/projects')`, and `revalidatePath('/gallery')` are called during project changes to immediately clear static HTML caches.

---

## 2. Uncached Core Queries

### Issues Found
The home page [page.tsx](file:///Users/sukumarsaurav/Personal/anon-india/website/src/app/(marketing)/page.tsx) issues a parallel `Promise.all` fetch for core marketing components:
```ts
const [featured, developers, team, cities, testimonials, posts, settings] = await Promise.all([
  getFeaturedProjects(),
  getDevelopers(),
  getTeamMembers(),
  getCitiesWithCounts(),
  getActiveTestimonials(),
  getPublishedBlogPosts(3),
  getSiteSettings(),
])
```
* **Uncached Functions:** `getFeaturedProjects()`, `getDevelopers()`, `getTeamMembers()`, and `getActiveTestimonials()` hit the database directly on every invocation.
* **Impact:** While the home page uses `revalidate = 300` (caching the page for 5 minutes), any background page compilation or direct visits to other pages invoking these functions will place unnecessary connections and CPU pressure on the Supabase database.

### Proposed Fixes
Wrap these static, read-only queries in [queries.ts](file:///Users/sukumarsaurav/Personal/anon-india/website/src/lib/queries.ts) with `unstable_cache` and cache tags:
```ts
export const getFeaturedProjects = unstable_cache(
  async (): Promise<Project[]> => { ... },
  ['featured-projects'],
  { revalidate: 300, tags: ['projects'] }
)

export const getDevelopers = unstable_cache(
  async (): Promise<Developer[]> => { ... },
  ['developers-list'],
  { revalidate: 3600, tags: ['projects'] }
)
```

---

## 3. Database Indexes

### Issues Found
1. **Sequential Scans on Lead Duplicate Check:**
   In [api/lead/route.ts](file:///Users/sukumarsaurav/Personal/anon-india/website/src/app/api/lead/route.ts), every lead submission runs a query to prevent spam:
   ```ts
   const { count } = await service
     .from('leads')
     .select('id', { count: 'exact', head: true })
     .eq('phone', cleaned)
     .gte('created_at', cutoff)
   ```
   There is **no database index** on `leads(phone, created_at)`. As submissions scale into thousands of entries, PostgreSQL must scan the entire `leads` table sequentially to count matches, increasing endpoint response latency.
2. **Missing Project Filter/Sorting Indexes:**
   The `projects` table is frequently searched and sorted via:
   ```ts
   where is_active = true and is_featured = true order by created_at desc
   ```
   No compound indexes are defined for `(is_active, is_featured, created_at)`.

### Proposed Fixes
Create the following compound indexes in a new migration:
```sql
-- Speed up duplicate check on lead form submission
create index if not exists idx_leads_phone_created_at on public.leads(phone, created_at);

-- Optimize queries fetching featured properties on landing views
create index if not exists idx_projects_active_featured_created_at 
on public.projects(is_active, is_featured, created_at desc);

-- Optimize projects browser filter queries
create index if not exists idx_projects_filters 
on public.projects(is_active, city, type, status);
```

---

## 4. Asset & Image Optimization

### Current Setup
* High-LCP background images (e.g., in `HeroSearch.tsx` and `PageHero.tsx`) use `next/image` with `priority` and `sizes="100vw"`. This is highly optimized.
* The image configuration in `next.config.ts` compiles sources into modern WebP/AVIF formats.

### Issues Found
* **Bypassing Next.js Optimizer:**
  Standard HTML `<img>` elements are used (with `eslint-disable-next-line @next/next/no-img-element`) for dynamically uploaded content:
  1. **Avatars:** [Avatar.tsx](file:///Users/sukumarsaurav/Personal/anon-india/website/src/components/Avatar.tsx) uses a raw `<img src={src} />`.
  2. **Developer Logos:** [developers/page.tsx](file:///Users/sukumarsaurav/Personal/anon-india/website/src/app/(marketing)/developers/page.tsx) and the home page render logo grids using raw HTML `<img>` elements.
* **Impact:** If an admin uploads a high-resolution 5MB portrait or a wide transparent banner, the raw, full-size image is loaded directly by user browsers. This introduces massive visual lag, poor layout stability (CLS), and high mobile data costs.

### Proposed Fixes
* **Refactor Avatar to use `next/image`:**
  Pass explicit dimensions (e.g., `width={64} height={64}`) to ensure the Next.js optimization pipeline resizes profile photos.
* **Refactor Developer Logo containers:**
  Use a relative wrapper and load logos with `fill` and `className="object-contain"`, letting Next.js downscale the images to matching sizes.

---

## 5. Dead Configuration / Missing Integrations

### Issues Found
* **Silent Analytics Configuration:**
  The schema and admin form include input fields for `ga_measurement_id` (Google Analytics 4) and `meta_pixel_id` (Meta Pixel). However, these script blocks are **completely missing** from the public layout structure ([layout.tsx](file:///Users/sukumarsaurav/Personal/anon-india/website/src/app/(marketing)/layout.tsx)). The admin configures tracking IDs in the admin settings, but no script loads on the website.

### Proposed Fixes
Incorporate the `next/script` library inside the marketing layout to load tracking scripts conditionally if configured in the database:
```tsx
import Script from 'next/script'

// Inside layout.tsx body
{settings?.ga_measurement_id && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga_measurement_id}`}
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.ga_measurement_id}');
      `}
    </Script>
  </>
)}
```

---

## Prioritised Action Plan

### **P0 — Critical Cache & Live Update Polish (Low Complexity, High Impact)**
1. Inject `revalidateTag` calls inside project, settings, and blog mutations to ensure edits propagate live instantly.
2. Extend `revalidatePath` inside project mutations to clear `/projects`, `/gallery`, and `/` public paths on change.

### **P1 — Database Efficiency & Lead Response (Medium Complexity, High Impact)**
3. Write a migration setting up compound indexes on `leads(phone, created_at)` to eliminate sequential table scans.
4. Add compound indexes on `projects(is_active, is_featured, created_at desc)` for faster project index fetching.
5. Cache the homepage queries (`getFeaturedProjects`, `getDevelopers`, `getTeamMembers`, `getActiveTestimonials`) in `queries.ts` using `unstable_cache`.

### **P2 — Frontend Assets & Analytics (Low Complexity, Medium Impact)**
6. Refactor [Avatar.tsx](file:///Users/sukumarsaurav/Personal/anon-india/website/src/components/Avatar.tsx) and the developer logo grid to use `next/image` to prevent large unoptimized media downloads.
7. Inject Google Analytics and Meta Pixel script handlers into the marketing layout.
