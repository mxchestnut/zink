# Zink Profile

This was built with Claude. I told it to show me what it could do with my character sheet. It probably has errors that will remain unfixed.

## PathCompanion character import

Paste a PathCompanion character key from onee.cloud into the sidebar form. The app will keep Zink’s portfolio bio and styling while loading your own character values.

## Database

Auth and saved characters use Supabase (see `.env.example`). The editable bio
is persisted in a `character_bios` table so the owner's edits show for every
visitor of `onee.cloud/<alias>` instead of living in one browser.

To set it up, run [`supabase/migrations/0001_character_bios.sql`](supabase/migrations/0001_character_bios.sql)
in the Supabase dashboard (SQL Editor → paste → Run). It creates the table with
row-level security: bios are publicly readable, only the row's owner can write,
and the `zink` alias is reserved for the owner account by email. The page reads
the bio anonymously and the built-in content is shown until a row is saved.
