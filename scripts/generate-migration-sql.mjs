#!/usr/bin/env node
// Reads the 10 website-content tables from the OLD Supabase project and
// generates a single SQL file of INSERT statements to run against the NEW
// project (via Supabase MCP execute_sql, which runs as table owner and
// bypasses RLS — no service-role key needed for this one-time copy).
//
// Deliberately excludes CRM-only columns (branch/staff assignment, plot-hold
// internals, HR/interview fields, quarterly compliance cadence) — see
// supabase/migrations/20260704041045_initial_schema.sql and
// 20260704050000_align_schema_with_source_reality.sql for the target shape.
//
// Original UUIDs are preserved (critical: plots.project_id, leads.project_id,
// lead_activities.lead_id, career_applications.listing_id are id-based FKs).

import pg from 'pg'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '..', '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8').split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const client = new pg.Client({ connectionString: env.OLD_SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } })
await client.connect()

// Postgres literal escaping. null -> NULL, strings -> quoted, jsonb columns
// passed as JS objects/arrays -> quoted JSON text cast to jsonb.
function lit(value, kind) {
  if (value === null || value === undefined) return 'NULL'
  if (kind === 'jsonb') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`
  if (kind === 'array_text') return `'{${value.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(',')}}'`
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (value instanceof Date) return `'${value.toISOString()}'`
  return `'${String(value).replace(/'/g, "''")}'`
}

// table: [source table name, [[destColumn, sourceColumn|null, kind], ...]]
// sourceColumn defaults to destColumn when null. kind is only needed for
// jsonb/array_text columns; everything else is inferred generically.
const TABLES = [
  ['developers', [
    ['id'], ['name'], ['logo_url'], ['website_url'], ['sort_order'], ['is_active'], ['created_at'],
  ]],
  ['projects', [
    ['id'], ['name'], ['type'], ['city'], ['locality'], ['address'], ['google_maps_pin'],
    ['rera_number'], ['rera_registration_date'], ['rera_expiry_date'], ['status'], ['launch_date'],
    ['expected_completion_date'], ['description'], ['total_units'], ['brochure_url'], ['video_url'],
    ['virtual_tour_url'], ['layout_image_url'], ['amenities', null, 'jsonb'], ['is_active'],
    ['created_at'], ['updated_at'], ['gallery_urls', null, 'jsonb'], ['developer_id'],
    ['starting_price'], ['price_per_sqft'], ['bhk_config'], ['website_category'], ['is_featured'],
    ['hero_image_url'], ['developer_about'], ['usp', null, 'array_text'], ['connectivity', null, 'jsonb'],
    ['faqs', null, 'jsonb'], ['rera_authority_name'], ['rera_website_url'],
  ]],
  ['plots', [
    ['id'], ['project_id'], ['plot_number'], ['size_sqyd'], ['size_sqft'], ['type'], ['facing'],
    ['floor_number'], ['configuration'], ['base_price'], ['corner_premium'], ['facing_premium'],
    ['other_premium'], ['development_charges'], ['total_price'], ['status'], ['notes'],
    ['created_at'], ['updated_at'], ['base_price_per_sqyd'], ['grid_row'], ['grid_col'],
  ]],
  ['team_members', [
    ['id'], ['name'], ['designation'], ['level'], ['photo_url'], ['sort_order'], ['is_public'], ['created_at'],
  ]],
  ['blog_posts', [
    ['id'], ['title'], ['slug'], ['excerpt'], ['content'], ['featured_image_url'], ['category'],
    ['tags', null, 'array_text'], ['meta_title'], ['meta_description'], ['is_published'],
    ['published_at'], ['author_id'], ['view_count'], ['created_at'], ['updated_at'],
  ]],
  ['testimonials', [
    ['id'], ['client_name'], ['project'], ['content'], ['rating'], ['photo_url'], ['is_active'],
    ['sort_order'], ['created_at'],
  ]],
  ['career_listings', [
    ['id'], ['title'], ['department'], ['employment_type'], ['location'], ['description'],
    ['requirements'], ['is_active'], ['created_at'], ['updated_at'],
  ]],
  ['career_applications', [
    ['id'], ['listing_id'], ['name'], ['phone'], ['email'], ['resume_url'], ['cover_letter'],
    ['status'], ['created_at'], ['stage'], ['current_company'], ['current_ctc'], ['expected_ctc'],
    ['experience_years'], ['interview_date'], ['interview_mode'], ['interview_rating'],
    ['interview_feedback'], ['offer_ctc'], ['offer_date'], ['joining_date'], ['rejection_reason'],
    ['updated_at'],
  ]],
  ['leads', [
    ['id'], ['full_name'], ['phone'], ['alternate_phone'], ['email'], ['city'], ['locality'],
    ['project_id'], ['property_type'], ['budget_min'], ['budget_max'], ['configuration'], ['purpose'],
    ['timeline'], ['source'], ['utm_source'], ['utm_medium'], ['utm_campaign'], ['utm_term'],
    ['utm_content'], ['campaign_name'], ['ad_set_name'], ['keyword'], ['landing_page_url'],
    ['device_type'], ['stage'], ['temperature'], ['score'], ['next_followup_at'],
    ['last_contacted_at'], ['follow_up_count'], ['whatsapp_opt_in'], ['is_duplicate'], ['is_active'],
    ['created_at'], ['updated_at'], ['loss_reason'],
    // duplicate_of intentionally omitted — always NULL in the copy (internal
    // CRM dedup tracking, not worth preserving cross-row references for).
  ]],
  ['lead_activities', [
    ['id'], ['lead_id'], ['type'], ['outcome'], ['notes'], ['stage_from'], ['stage_to'],
    ['call_duration_seconds'], ['scheduled_at'], ['created_at'], ['call_sid'], ['recording_url'],
  ]],
]

let sql = '-- Generated by scripts/generate-migration-sql.mjs — do not hand-edit.\n'
sql += 'begin;\n\n'

for (const [table, cols] of TABLES) {
  const sourceCols = cols.map(([dest, src]) => src ?? dest)
  const { rows } = await client.query(`select ${sourceCols.join(', ')} from public.${table}`)

  if (rows.length === 0) {
    sql += `-- ${table}: 0 rows, nothing to copy\n\n`
    continue
  }

  const destColNames = cols.map(([dest]) => dest)
  const valuesRows = rows.map((row) => {
    const values = cols.map(([dest, src, kind]) => lit(row[src ?? dest], kind))
    return `  (${values.join(', ')})`
  })

  sql += `-- ${table}: ${rows.length} rows\n`
  sql += `insert into public.${table} (${destColNames.join(', ')}) values\n`
  sql += valuesRows.join(',\n')
  sql += `\non conflict (id) do nothing;\n\n`
}

sql += 'commit;\n'

const outPath = resolve(__dirname, 'migration-data.sql')
writeFileSync(outPath, sql)
console.log(`Wrote ${outPath} (${sql.length} bytes)`)

await client.end()
