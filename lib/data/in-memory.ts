/**
 * In-memory deterministic adapter. No IO or global mutable singleton.
 * Each createDemoRepository call receives independent state.
 */
import { categories as legacyCategories, cities as legacyCities, demoListings } from "../directory.ts";
import {
  asCitySlug, assertTransition, DomainError, validateIntegrity, validateListing,
  type Category, type City, type CitySlug, type Listing, type ListingStatus,
} from "../domain/model.ts";

export interface ListingRepository {
  list(city: CitySlug, options?: { query?: string; categoryId?: string }): readonly Listing[];
  findBySlug(city: CitySlug, slug: string): Listing | undefined;
  create(city: CitySlug, listing: Listing): Listing;
  transition(city: CitySlug, listingId: string, next: ListingStatus, expectedRevision: number, updatedAt: string): Listing;
}
export interface RepositorySeed {
  cities: readonly City[]; categories: readonly Category[]; listings: readonly Listing[];
}
const clone = <T>(value: T): T => structuredClone(value);
const fixtureTime = "2026-01-01T00:00:00.000Z";
export function createDemoSeed(): RepositorySeed {
  const countryCodes: Record<CitySlug, City["countryCode"]> = {dubai:"AE",muscat:"OM",doha:"QA"};
  const currencies: Record<CitySlug, City["currencyCode"]> = {dubai:"AED",muscat:"OMR",doha:"QAR"};
  const cities: City[] = legacyCities.map(city=>({
    id:city.slug,slug:city.slug,name:city.name,countryCode:countryCodes[city.slug],
    currencyCode:currencies[city.slug],locale:"en",enabled:true,
  }));
  const categories: Category[] = legacyCategories.map(category=>({
    id:category.slug,slug:category.slug,label:category.label,enabled:true,
  }));
  const listings: Listing[] = demoListings.map(item=>{
    const category = categories.find(x=>x.label===item.category);
    if (!category) throw new DomainError("INVALID","Missing fixture category");
    return {
      id:item.id,cityId:item.city,categoryId:category.id,slug:item.slug,
      title:item.title,description:item.description,status:"published",
      verificationStatus:"unverified",sponsoredExample:!!item.sponsoredExample,
      createdAt:fixtureTime,updatedAt:fixtureTime,revision:0,
    };
  });
  return {cities,categories,listings};
}
export class InMemoryListingRepository implements ListingRepository {
  private state: RepositorySeed;
  constructor(seed: RepositorySeed) {
    validateIntegrity(seed);
    this.state = clone(seed);
  }
  private cityId(city: CitySlug): string {
    const slug = asCitySlug(city);
    const config = this.state.cities.find(x=>x.slug===slug && x.enabled);
    if (!config) throw new DomainError("NOT_FOUND","City is unavailable");
    return config.id;
  }
  list(city: CitySlug, options: { query?: string; categoryId?: string } = {}): readonly Listing[] {
    const cityId = this.cityId(city);
    const query = (options.query ?? "").trim().toLowerCase();
    return clone(this.state.listings.filter(item=>item.cityId===cityId &&
      (!options.categoryId || item.categoryId===options.categoryId) &&
      `${item.title} ${item.description} ${this.state.categories.find(x=>x.id===item.categoryId)?.label ?? ""}`.toLowerCase().includes(query)));
  }
  findBySlug(city: CitySlug, slug: string): Listing | undefined {
    const cityId = this.cityId(city);
    const found = this.state.listings.find(x=>x.cityId===cityId && x.slug===slug);
    return found ? clone(found) : undefined;
  }
  create(city: CitySlug, listing: Listing): Listing {
    const cityId = this.cityId(city);
    validateListing(listing);
    if (listing.cityId!==cityId) throw new DomainError("INVALID","Cross-city creation denied");
    if (listing.status!=="draft" || listing.revision!==0) throw new DomainError("INVALID","New records must start as draft");
    const candidate: RepositorySeed = {...this.state,listings:[...this.state.listings,clone(listing)]};
    validateIntegrity(candidate); // validate entire candidate before committing
    this.state=candidate;
    return clone(listing);
  }
  transition(city: CitySlug, listingId: string, next: ListingStatus, expectedRevision: number, updatedAt: string): Listing {
    const cityId=this.cityId(city);
    const index=this.state.listings.findIndex(x=>x.cityId===cityId && x.id===listingId);
    if(index<0) throw new DomainError("NOT_FOUND","Listing not found within city");
    const current=this.state.listings[index];
    if(current.revision!==expectedRevision) throw new DomainError("CONFLICT","Stale listing revision");
    assertTransition(current.status,next);
    if(current.status===next) return clone(current); // idempotent without mutation
    const updated: Listing={...current,status:next,revision:current.revision+1,updatedAt};
    validateListing(updated);
    const items=[...this.state.listings];items[index]=updated;
    const candidate:RepositorySeed={...this.state,listings:items};
    validateIntegrity(candidate);
    this.state=candidate;
    return clone(updated);
  }
}
export function createDemoRepository(): InMemoryListingRepository {
  return new InMemoryListingRepository(createDemoSeed());
}
