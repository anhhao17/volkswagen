import type { BlogPost } from "./types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "golf-gti-50-years",
    title: "50 Years of the Golf GTI: The Hot Hatch That Started It All",
    excerpt:
      "From 1976 to today, the Golf GTI defined a category. We look back at the legend and what makes the latest generation special.",
    content:
      "When a small team of Volkswagen engineers secretly developed a sporty version of the Golf in the mid-1970s, they had no idea they were about to invent an entire category. The Golf GTI launched in 1976 and quickly became the benchmark for affordable performance. Five decades on, the latest GTI keeps the tartan seats, the honeycomb grille, and the razor-sharp steering that made it famous — now wrapped in a 245 hp package with a digital cockpit. The hot hatch is alive and well.",
    author: "Volw Editorial",
    date: "2024-09-12",
    tags: ["Heritage", "Golf GTI"],
  },
  {
    id: "2",
    slug: "id-buzz-electric-revival",
    title: "ID. Buzz: The Electric Microbus Revival",
    excerpt:
      "Volkswagen's most beloved shape returns as a fully electric people-mover. Here's why the ID. Buzz matters.",
    content:
      "The Microbus is one of the most recognisable shapes in automotive history. The ID. Buzz brings it back as a quiet, zero-emission EV with up to 420 km of range. Beyond nostalgia, it's a serious family EV — spacious, comfortable, and packed with the ID.Light interaction system. It's proof that going electric doesn't mean losing character.",
    author: "Volw Editorial",
    date: "2024-08-30",
    tags: ["Electric", "ID. Buzz"],
  },
  {
    id: "3",
    slug: "tiguan-r-track-test",
    title: "Tiguan R on Track: SUV, Meet Apex",
    excerpt:
      "We took the 320 hp Tiguan R to the circuit. The result surprised us — in the best way.",
    content:
      "An SUV on a track day sounds like a contradiction. The Tiguan R begs to differ. With 4MOTION all-wheel drive, R-Performance torque vectoring, and a DCC adaptive suspension that firms up in Sport Plus mode, it carries speed through corners with genuine composure. The Akrapovic exhaust gives it a voice too. It won't dethrone a GTI, but for a family SUV it's remarkably capable.",
    author: "Volw Editorial",
    date: "2024-07-18",
    tags: ["Performance", "Tiguan R"],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
