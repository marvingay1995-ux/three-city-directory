import test from "node:test";
import assert from "node:assert/strict";
import {
  asCitySlug, assertTransition, DomainError, validateCity, validateCategory,
  validateListing, validateIntegrity,
} from "../lib/domain/model.ts";
import {createDemoRepository, createDemoSeed, InMemoryListingRepository} from "../lib/data/in-memory.ts";

const draft = (id, cityId, slug, categoryId="creative") => ({
  id,cityId,slug,categoryId,title:"Fictional Design",description:"Synthetic fixture only.",
  status:"draft",verificationStatus:"unverified",sponsoredExample:false,
  createdAt:"2026-01-01T00:00:00.000Z",updatedAt:"2026-01-01T00:00:00.000Z",revision:0,
});
const failure = (fn,code) => assert.throws(fn,err=>err instanceof DomainError && err.code===code);

test("seed has three countries, categories and six deterministic profiles",()=>{
  const seed=createDemoSeed();
  assert.deepEqual(seed.cities.map(x=>x.slug),["dubai","muscat","doha"]);
  assert.deepEqual(seed.cities.map(x=>x.currencyCode),["AED","OMR","QAR"]);
  assert.equal(seed.categories.length,2);assert.equal(seed.listings.length,6);
  validateIntegrity(seed);
  for(const x of seed.listings) {
    assert.equal(x.verificationStatus,"unverified");
    assert.equal(x.createdAt,"2026-01-01T00:00:00.000Z");
    validateListing(x);
  }
});
test("city and category validators reject invalid identities and codes",()=>{
  const seed=createDemoSeed();
  assert.equal(asCitySlug("dubai"),"dubai");
  failure(()=>asCitySlug("unknown"),"INVALID");
  failure(()=>validateCity({...seed.cities[0],countryCode:"OM"}),"INVALID");
  failure(()=>validateCategory({...seed.categories[0],slug:"INVALID"}),"INVALID");
  failure(()=>validateListing({...seed.listings[0],revision:-1}),"INVALID");
  failure(()=>validateListing({...seed.listings[0],createdAt:"2026-02-30T00:00:00.000Z"}),"INVALID");
});
test("all reads require a valid city and filter by city and category",()=>{
  const repo=createDemoRepository();
  assert.deepEqual(repo.list("dubai").map(x=>x.id),["d1","d2"]);
  assert.deepEqual(repo.list("muscat",{query:"WORKSHOP"}).map(x=>x.id),["m1"]);
  assert.deepEqual(repo.list("doha",{categoryId:"lifestyle"}).map(x=>x.id),["q2"]);
  assert.equal(repo.findBySlug("muscat","creative-studio"),undefined);
  failure(()=>repo.list("unknown"),"INVALID");
  failure(()=>repo.findBySlug("unknown","creative-studio"),"INVALID");
});
test("duplicate city-scoped slugs rejected but same slug across cities is allowed",()=>{
  const repo=createDemoRepository();
  const sameCity=draft("new-a","dubai","creative-studio");
  failure(()=>repo.create("dubai",sameCity),"CONFLICT");
  assert.equal(repo.list("dubai").length,2);
  const crossCity=draft("new-b","muscat","creative-studio");
  assert.equal(repo.create("muscat",crossCity).slug,"creative-studio");
  assert.equal(repo.findBySlug("muscat","creative-studio")?.id,"new-b");
  assert.equal(repo.findBySlug("dubai","creative-studio")?.id,"d1");
});
test("missing category, missing city, duplicate global IDs and cross-city writes fail atomically",()=>{
  const repo=createDemoRepository();
  failure(()=>repo.create("dubai",draft("new-c","dubai","new-c","missing")),"INVALID");
  failure(()=>repo.create("dubai",draft("new-d","muscat","new-d")),"INVALID");
  failure(()=>repo.create("dubai",draft("d1","dubai","new-e")),"CONFLICT");
  assert.equal(repo.list("dubai").length,2);
  const seed=createDemoSeed();
  failure(()=>validateIntegrity({...seed,listings:[...seed.listings,{...seed.listings[0],categoryId:"unknown",id:"unique",slug:"unique"}]}),"INVALID");
  failure(()=>validateIntegrity({...seed,categories:[...seed.categories,{...seed.categories[0],id:"other",slug:"creative"}]}),"CONFLICT");
});
test("transitions enforce approval distinct from publication, and reject illegal shortcuts",()=>{
  const repo=createDemoRepository();const item=draft("new-life","dubai","new-life");
  repo.create("dubai",item);
  failure(()=>repo.transition("dubai",item.id,"published",0,"2026-01-02T00:00:00.000Z"),"ILLEGAL_TRANSITION");
  let v=repo.transition("dubai",item.id,"submitted",0,"2026-01-02T00:00:00.000Z");
  v=repo.transition("dubai",item.id,"under_review",1,"2026-01-03T00:00:00.000Z");
  v=repo.transition("dubai",item.id,"approved",2,"2026-01-04T00:00:00.000Z");
  assert.equal(v.status,"approved");
  assert.equal(v.verificationStatus,"unverified");
  assert.equal(repo.transition("dubai",item.id,"approved",3,"2026-01-05T00:00:00.000Z").revision,3);
  v=repo.transition("dubai",item.id,"published",3,"2026-01-05T00:00:00.000Z");
  assert.equal(v.status,"published");assert.equal(v.revision,4);
  failure(()=>repo.transition("dubai",item.id,"draft",4,"2026-01-06T00:00:00.000Z"),"ILLEGAL_TRANSITION");
  failure(()=>repo.transition("muscat",item.id,"archived",4,"2026-01-06T00:00:00.000Z"),"NOT_FOUND");
  assert.equal(repo.findBySlug("dubai","new-life")?.status,"published");
});
test("optimistic revisions, invalid timestamps and clones prevent partial mutation",()=>{
  const repo=createDemoRepository();repo.create("doha",draft("new-state","doha","new-state"));
  failure(()=>repo.transition("doha","new-state","submitted",1,"2026-01-02T00:00:00.000Z"),"CONFLICT");
  failure(()=>repo.transition("doha","new-state","submitted",0,"garbage"),"INVALID");
  assert.equal(repo.findBySlug("doha","new-state")?.revision,0);
  const copy=repo.findBySlug("doha","new-state");copy.title="Tampered";
  assert.equal(repo.findBySlug("doha","new-state")?.title,"Fictional Design");
  repo.transition("doha","new-state","submitted",0,"2026-01-02T00:00:00.000Z");
  failure(()=>repo.transition("doha","new-state","under_review",0,"2026-01-03T00:00:00.000Z"),"CONFLICT");
});
test("in-memory repository instances never share mutations",()=>{
  const one=createDemoRepository(),two=createDemoRepository();
  one.create("muscat",draft("new-isolated","muscat","new-isolated"));
  assert.equal(one.list("muscat").length,3);
  assert.equal(two.list("muscat").length,2);
});
test("related media, submissions, decisions, reports and audits validate references",()=>{
  const seed=createDemoSeed();
  validateIntegrity({...seed,
    media:[{id:"media-1",listingId:"d1",assetRef:"synthetic-placeholder",rightsStatus:"unknown",sortOrder:0}],
    submissions:[{id:"sub-1",listingId:"d1",actorRef:"synthetic-actor",status:"submitted",submittedAt:"2026-01-01T00:00:00.000Z"}],
    decisions:[{id:"decision-1",submissionId:"sub-1",actorRef:"synthetic-moderator",outcome:"approved",reasonCode:"demo",occurredAt:"2026-01-01T00:00:00.000Z"}],
    reports:[{id:"report-1",listingId:"d1",reasonCode:"demo",status:"open",createdAt:"2026-01-01T00:00:00.000Z"}],
    audits:[{id:"audit-1",actorRef:"synthetic-moderator",action:"inspect",targetType:"listing",targetId:"d1",occurredAt:"2026-01-01T00:00:00.000Z"}]});
  failure(()=>validateIntegrity({...seed,reports:[{id:"report-2",listingId:"missing",reasonCode:"demo",status:"open",createdAt:"2026-01-01T00:00:00.000Z"}]}),"INVALID");
});
test("lifecycle contract allows retry and rejects forbidden transition",()=>{
  assert.doesNotThrow(()=>assertTransition("draft","draft"));
  assert.doesNotThrow(()=>assertTransition("approved","published"));
  failure(()=>assertTransition("published","approved"),"ILLEGAL_TRANSITION");
});
