import DeckClient from './deck-client'

// Server Component — reads env variables, content never exposed in client bundle
export default function Home() {
  // Content split across multiple env vars due to Vercel 4KB limit
  const raw = (process.env.DECK_CONTENT_A || '') +
              (process.env.DECK_CONTENT_B || '') +
              (process.env.DECK_CONTENT_C || '')

  let content: any = {}
  try {
    content = JSON.parse(raw)
  } catch {
    content = { error: 'Content not configured. Set DECK_CONTENT env variables.' }
  }

  return <DeckClient content={content} />
}
