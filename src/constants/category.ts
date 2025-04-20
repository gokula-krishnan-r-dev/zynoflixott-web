interface Category {
  id: number;
  label: string;
  value: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 1,
    label: "Drama Short",
    value: "drama_short",
    description:
      "Short films that depict realistic characters and emotional themes.",
  },
  {
    id: 2,
    label: "Comedy Short",
    value: "comedy_short",
    description: "Short films designed to entertain and amuse with humor.",
  },
  {
    id: 3,
    label: "Horror Short",
    value: "horror_short",
    description: "Short films that aim to evoke fear and suspense.",
  },
  {
    id: 4,
    label: "Science Fiction Short",
    value: "sci_fi_short",
    description:
      "Short films that explore futuristic concepts and speculative fiction.",
  },
  {
    id: 5,
    label: "Animated Short",
    value: "animated_short",
    description: "Short films created through animation techniques.",
  },
  {
    id: 6,
    label: "Experimental Short",
    value: "experimental_short",
    description:
      "Short films that push the boundaries of traditional filmmaking.",
  },
  {
    id: 7,
    label: "Foreign Language Short",
    value: "foreign_language_short",
    description:
      "Short films produced in languages other than the primary language of the region.",
  },
  {
    id: 8,
    label: "Music Video",
    value: "music_video",
    description:
      "Short films that accompany and visually represent a piece of music.",
  },
];
