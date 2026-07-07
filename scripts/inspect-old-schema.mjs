#!/usr/bin/env node
// One-off introspection of the OLD Supabase project's schema, so the
// migration script's column/enum assumptions can be verified against
// reality before copying data. Read-only.

import pg from 'pg'
import { readFileSync } from 'fs'
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

const { rows: tables } = await client.query(`
  select table_name from information_schema.tables
  where table_schema = 'public' order by table_name
`)
console.log('Tables:', tables.map(t => t.table_name).join(', '))

for (const t of tables) {
  const { rows: cols } = await client.query(`
    select column_name, data_type, udt_name, is_nullable, column_default
    from information_schema.columns
    where table_schema = 'public' and table_name = $1
    order by ordinal_position
  `, [t.table_name])
  console.log(`\n-- ${t.table_name} --`)
  for (const c of cols) {
    console.log(`  ${c.column_name}: ${c.data_type}${c.data_type === 'USER-DEFINED' ? ` (${c.udt_name})` : ''}${c.is_nullable === 'NO' ? ' NOT NULL' : ''}${c.column_default ? ` DEFAULT ${c.column_default}` : ''}`)
  }
  const { rows: countRows } = await client.query(`select count(*) from public.${t.table_name}`)
  console.log(`  rows: ${countRows[0].count}`)
}

// Enum types used anywhere in public schema
const { rows: enums } = await client.query(`
  select t.typname, e.enumlabel
  from pg_type t
  join pg_enum e on t.oid = e.enumtypid
  join pg_catalog.pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public'
  order by t.typname, e.enumsortorder
`)
if (enums.length) {
  console.log('\n-- Enums --')
  const grouped = {}
  for (const e of enums) (grouped[e.typname] ??= []).push(e.enumlabel)
  for (const [name, labels] of Object.entries(grouped)) console.log(`  ${name}: ${labels.join(', ')}`)
}

await client.end()
