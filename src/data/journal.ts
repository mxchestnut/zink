import type { JournalEntry } from "../types";

/**
 * Local journal entries — shown whenever a Ghost blog isn't configured
 * (see src/lib/ghost.ts and .env.example). Case-file format, Golarion
 * dates; replace freely or let Ghost take over.
 */
export const localJournal: JournalEntry[] = [
  {
    title: "The Magistrate Paid Twice",
    date: "Moonday, 3rd of Neth",
    excerpt:
      "His ledger names four debts; his tomb names none. The dead man kept better books than his executor, and the discrepancy has now been resolved in the client's favor. The widow asked who hired me. I told her the truth — the deceased did, the moment someone decided his story was finished.",
  },
  {
    title: "Concerning the Owl",
    date: "Oathday, 22nd of Lamashan",
    excerpt:
      "It reached the granary before I did. Sixth time this season. I have stopped asking how it knows and begun asking why it waits — a juror does not arrive early unless it intends the verdict witnessed. We understand each other, I think. Neither of us has ever needed the other to speak.",
  },
  {
    title: "Notes on Being Wrong",
    date: "Starday, 9th of Arodus",
    excerpt:
      "Re-interviewed the living witness. Her account has improved with age; the corpse's has not changed by a syllable. Living testimony revises itself toward comfort. Evidence does not. I keep this journal for one reason: if I am ever wrong, I want the proof written in my own hand.",
  },
];
