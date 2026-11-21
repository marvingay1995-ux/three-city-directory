// Static, invented editorial copy. Not real businesses, people, offers or verified facts.
// Keys reference the six original synthetic fixtures without changing their URLs or baseline test data.
export const demoEditorial = {
  d1: { tagline: "Ideas after hours.", summary: "A fictional studio exploring colour, sound and atmospheric interiors.", theme: "copper", highlights: ["Art direction", "Moodboards", "Visual experiments"] },
  d2: { tagline: "A city, thoughtfully imagined.", summary: "An invented guide to architecture, reading rooms and understated city rituals.", theme: "plum", highlights: ["City stories", "Design walks", "Editorial guides"] },
  m1: { tagline: "Made of light and texture.", summary: "A conceptual workshop inspired by material studies and contemporary craft.", theme: "sand", highlights: ["Material studies", "Spatial sketches", "Creative process"] },
  m2: { tagline: "The quieter side of discovery.", summary: "A wholly fictional selection of neighbourhood narratives and cultural places.", theme: "olive", highlights: ["Culture notes", "Local narratives", "Creative itineraries"] },
  q1: { tagline: "Objects with a point of view.", summary: "An imaginary atelier focused on form, composition and graphic expression.", theme: "rose", highlights: ["Objects", "Visual language", "Design concepts"] },
  q2: { tagline: "Stories make a city.", summary: "A made-up editorial guide to public spaces, design and cultural conversation.", theme: "indigo", highlights: ["Urban stories", "Public spaces", "Art and culture"] },
} as const;

export type EditorialId = keyof typeof demoEditorial;
export function getDemoEditorial(id: string) {
  return Object.hasOwn(demoEditorial, id)
    ? demoEditorial[id as EditorialId]
    : undefined;
}
