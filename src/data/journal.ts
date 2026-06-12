import type { JournalEntry } from "../types";

/**
 * Local journal entries — shown whenever a Ghost blog isn't configured
 * (see src/lib/ghost.ts and .env.example). Dates follow the Golarion
 * calendar because Zink refuses to use anything so gauche as a real one.
 */
export const localJournal: JournalEntry[] = [
  {
    title: "On the Ethics of Slumber",
    date: "Moonday, 3rd of Neth",
    excerpt:
      "The caravan master asked why I didn't simply burn the bandits like a respectable spellcaster. I told him the truth: anyone can make a corpse, but it takes craft to make a bedtime. He laughed. The bandits, gift-wrapped in their own bedrolls for the constable, did not.",
  },
  {
    title: "Vesper Has Opinions About the New Hat",
    date: "Oathday, 22nd of Lamashan",
    excerpt:
      "The headband sharpens my mind wonderfully, but Vesper sulked on the wagon rail for an hour because it 'ruins the silhouette.' I now travel with an owl who critiques my wardrobe in Sylvan. The moon gives with one hand and takes with the other.",
  },
  {
    title: "Letters I Did Not Answer",
    date: "Starday, 9th of Arodus",
    excerpt:
      "Mother wrote again — frost on the inside of the glass this time, spelled in the old tongue. Vesper pecked the window until I shut the curtain. I lifted a stranger's curse before breakfast just to spite her. Some inheritances are best spent out of the family.",
  },
];
