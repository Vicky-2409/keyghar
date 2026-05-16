export type PropertyType = "apartment" | "flat" | "pg" | "villa" | "studio";
export type Furnishing = "furnished" | "semi-furnished" | "unfurnished";
export type Badge = "VERIFIED" | "FEATURED" | "HOT_DEAL";
export type SortOption = "relevance" | "price-asc" | "price-desc" | "newest";

export type PropertyFilters = {
  minBudget?: number;
  maxBudget?: number;
  propertyType?: PropertyType;
  bedrooms?: number;
  furnishing?: Furnishing;
  parking?: boolean;
  lift?: boolean;
  petFriendly?: boolean;
  bachelorAllowed?: boolean;
  familyPreferred?: boolean;
  immediateMoveIn?: boolean;
  verifiedOnly?: boolean;
  metroNearby?: boolean;
  gatedCommunity?: boolean;
};

export type SearchContext = {
  query?: string;
  city?: string;
  locality?: string;
  filters?: PropertyFilters;
  page?: number;
  pageSize?: number;
  sort?: SortOption;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  city: string;
  locality: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  furnishing: Furnishing;
  amenities: string[];
  nearbyPlaces: string[];
  images: string[];
  badges: Badge[];
  activity: {
    viewsToday: number;
    contactedToday: number;
    postedAgo: string;
  };
  filterFlags: {
    parking: boolean;
    lift: boolean;
    petFriendly: boolean;
    bachelorAllowed: boolean;
    familyPreferred: boolean;
    immediateMoveIn: boolean;
    metroNearby: boolean;
    gatedCommunity: boolean;
    verified: boolean;
  };
  owner: {
    name: string;
    role: string;
    rating: number;
    listingsCount: number;
    avatarSeed: string;
    phone: string;
  };
  description: string;
};

export type ParsedQuery = {
  bedrooms?: number;
  propertyType?: PropertyType;
  locality?: string;
  city?: string;
  minBudget?: number;
  maxBudget?: number;
};

export type ParsedSeoSlug = ParsedQuery & {
  rawSlug: string;
};
