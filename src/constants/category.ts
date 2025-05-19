interface Category {
  id: number;
  label: string;
  value: string;
  description: string;
  section?: string;
}

export const categories: Category[] = [
  // 1. Genres
  {
    id: 1,
    label: "Drama",
    value: "drama",
    description: "Films that depict realistic characters and emotional themes.",
    section: "Genres"
  },
  {
    id: 2,
    label: "Comedy",
    value: "comedy",
    description: "Films designed to entertain and amuse with humor.",
    section: "Genres"
  },
  {
    id: 3,
    label: "Thriller & Suspense",
    value: "thriller_suspense",
    description: "Films designed to excite and create tension.",
    section: "Genres"
  },
  {
    id: 4,
    label: "Horror",
    value: "horror",
    description: "Films that aim to evoke fear and suspense.",
    section: "Genres"
  },
  {
    id: 5,
    label: "Romance",
    value: "romance",
    description: "Films that focus on romantic relationships and love stories.",
    section: "Genres"
  },
  {
    id: 6,
    label: "Action & Adventure",
    value: "action_adventure",
    description: "Films with exciting action sequences and adventurous journeys.",
    section: "Genres"
  },
  {
    id: 7,
    label: "Sci-Fi & Fantasy",
    value: "scifi_fantasy",
    description: "Films that explore futuristic concepts, speculative fiction, and fantastical worlds.",
    section: "Genres"
  },
  {
    id: 8,
    label: "Crime & Mystery",
    value: "crime_mystery",
    description: "Films about crimes, investigations, and mysterious events.",
    section: "Genres"
  },
  {
    id: 9,
    label: "Animation",
    value: "animation",
    description: "Films created through animation techniques.",
    section: "Genres"
  },
  {
    id: 10,
    label: "Documentary",
    value: "documentary",
    description: "Non-fiction films documenting reality.",
    section: "Genres"
  },

  // 2. Themes
  {
    id: 11,
    label: "Social Message",
    value: "social_message",
    description: "Films with strong social commentary and messages.",
    section: "Themes"
  },
  {
    id: 12,
    label: "Women-Centric",
    value: "women_centric",
    description: "Films focused on women's stories and perspectives.",
    section: "Themes"
  },
  {
    id: 13,
    label: "LGBTQ+ Voices",
    value: "lgbtq_voices",
    description: "Films exploring LGBTQ+ experiences and stories.",
    section: "Themes"
  },
  {
    id: 14,
    label: "Mental Health & Emotions",
    value: "mental_health_emotions",
    description: "Films exploring mental health issues and emotional journeys.",
    section: "Themes"
  },
  {
    id: 15,
    label: "Coming of Age",
    value: "coming_of_age",
    description: "Films about growing up and transitioning to adulthood.",
    section: "Themes"
  },
  {
    id: 16,
    label: "Relationships & Family",
    value: "relationships_family",
    description: "Films about familial bonds and interpersonal relationships.",
    section: "Themes"
  },
  {
    id: 17,
    label: "Mythology & Folklore",
    value: "mythology_folklore",
    description: "Films based on mythological stories and folk tales.",
    section: "Themes"
  },

  // 3. Formats
  {
    id: 18,
    label: "Live Action",
    value: "live_action",
    description: "Films with real actors and physical sets.",
    section: "Formats"
  },
  {
    id: 19,
    label: "Animated",
    value: "animated",
    description: "Films created using animation techniques.",
    section: "Formats"
  },
  {
    id: 20,
    label: "Experimental",
    value: "experimental",
    description: "Films that push the boundaries of traditional filmmaking.",
    section: "Formats"
  },
  {
    id: 21,
    label: "Silent Films",
    value: "silent_films",
    description: "Films without spoken dialogue, relying on visual storytelling.",
    section: "Formats"
  },

  // 4. Collections
  {
    id: 22,
    label: "Festival Selections",
    value: "festival_selections",
    description: "Films selected for screening at film festivals.",
    section: "Collections"
  },
  {
    id: 23,
    label: "Award Winners",
    value: "award_winners",
    description: "Films that have won awards and recognition.",
    section: "Collections"
  },
  {
    id: 24,
    label: "Debut Directors",
    value: "debut_directors",
    description: "First films by emerging directors.",
    section: "Collections"
  },
  {
    id: 25,
    label: "Short & Sweet (Under 5 min)",
    value: "short_sweet",
    description: "Very short films under 5 minutes in length.",
    section: "Collections"
  },
  {
    id: 26,
    label: "Editor's Picks",
    value: "editors_picks",
    description: "Films selected by the editorial team.",
    section: "Collections"
  },
  {
    id: 27,
    label: "Trending Now",
    value: "trending_now",
    description: "Currently popular films on the platform.",
    section: "Collections"
  },
  {
    id: 28,
    label: "Most Watched",
    value: "most_watched",
    description: "Films with the highest view counts.",
    section: "Collections"
  },
  {
    id: 29,
    label: "Based on True Events",
    value: "true_events",
    description: "Films based on real-life events and stories.",
    section: "Collections"
  },

  // 5. Audience
  {
    id: 30,
    label: "For Kids",
    value: "for_kids",
    description: "Films suitable for children.",
    section: "Audience"
  },
  {
    id: 31,
    label: "For Teens",
    value: "for_teens",
    description: "Films targeting teenage audiences.",
    section: "Audience"
  },
  {
    id: 32,
    label: "Family-Friendly",
    value: "family_friendly",
    description: "Films suitable for viewing by the whole family.",
    section: "Audience"
  }
];
