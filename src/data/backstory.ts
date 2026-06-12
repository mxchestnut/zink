/**
 * Zink's dossier, adapted from her wiki bio. Each section renders with an
 * optional small-caps heading; `closingQuote` sets the final word.
 */

/** Short summary at the top of the page — the resume "objective" line. */
export const profile =
  "Zink is an android devotee of Yaezhing, known across several regions as an investigator of violent deaths, a hunter of fugitives, and a practitioner of the necromantic arts. “Necromancer” is the word that follows her into rooms; those familiar with her work consider it misleading. Her concern is not the creation of undead. It is justice on behalf of the dead.";

export const closingQuote = "No story ends until it is understood.";

export interface BioSection {
  heading?: string;
  body: string[];
}

export const dossier: BioSection[] = [
  {
    body: [
      "Her philosophy rests on a controversial conviction: the dead retain ownership of their story. Death does not erase obligation, guilt, innocence, or truth. Those who die unjustly deserve resolution. Those who die before completing their purpose may deserve another chance. And those who commit atrocities should not escape accountability merely because they have passed beyond mortal judgment.",
    ],
  },
  {
    heading: "Appearance",
    body: [
      "Zink is a heavily built android woman with dark hair, bronze-toned synthetic skin, and luminous circuitry running the length of her left arm — markings that brighten during spellcasting and in moments of emotional strain, which she would deny having. She travels in dark garments beneath a hooded cloak patterned with stars, her face behind a stylized owl mask.",
    ],
  },
  {
    heading: "Personality & Beliefs",
    body: [
      "Methodical, patient, and unusually difficult to intimidate, she approaches every conflict as an investigation first and a judgment second. Her greatest fear is not death, nor failure. It is being wrong.",
      "She maintains that every death creates a witness, and that the dead possess knowledge that should not be discarded simply because they can no longer speak. To her, a corpse is not a resource. It is evidence.",
    ],
  },
  {
    heading: "From Copper to Zink",
    body: [
      "Very little is known of her origins. Before Zink, she traveled under the name Copper — curious, introspective, fascinated by the stories of others. The change followed a violent incident: an unsolved murder, or a preventable death, depending on who tells it. Whatever happened, it altered her course entirely.",
      "Scholars of small mysteries note that the names read as deliberate. Copper conducts — observation, connection, understanding. Zinc protects — the sacrificial metal, consumed so the iron beneath it never rusts. Two metals, two mandates, and somewhere between them, a person.",
    ],
  },
  {
    heading: "Rise as the Warden of the Dead",
    body: [
      "Over time her work drew her into investigations of murder, corruption, disappearance, and supernatural crime. Her reputation was made by a series of cases in which people believed untouchable were exposed, condemned, or killed. Eventually she became something difficult to classify: a representative of the dead.",
    ],
  },
  {
    heading: "Legacy",
    body: [
      "Opinions remain sharply divided. To her supporters, she is a necessary force operating where ordinary justice has failed. To her enemies, she is a dangerous fanatic who has assumed authority over matters reserved for gods. To the dead — if the legends are to be believed — she may be the last person still willing to listen.",
    ],
  },
];
