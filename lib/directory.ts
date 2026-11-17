export const cities = [{slug:"dubai",name:"Dubai",country:"United Arab Emirates",flag:"🇦🇪"},{slug:"muscat",name:"Muscat",country:"Oman",flag:"🇴🇲"},{slug:"doha",name:"Doha",country:"Qatar",flag:"🇶🇦"}] as const;
export type CitySlug = (typeof cities)[number]["slug"];
export const demoListings = [
{id:"d1",city:"dubai",title:"Creative Studio",category:"Creative",description:"Fictional demonstration business profile."},
{id:"d2",city:"dubai",title:"City Concierge",category:"Lifestyle",description:"Fictional demonstration business profile."},
{id:"m1",city:"muscat",title:"Design Workshop",category:"Creative",description:"Fictional demonstration business profile."},
{id:"m2",city:"muscat",title:"Local Experiences",category:"Lifestyle",description:"Fictional demonstration business profile."},
{id:"q1",city:"doha",title:"Modern Atelier",category:"Creative",description:"Fictional demonstration business profile."},
{id:"q2",city:"doha",title:"Community Guide",category:"Lifestyle",description:"Fictional demonstration business profile."}
] as const;
export function getCity(slug:string){return cities.find(city=>city.slug===slug);}
export function getListings(slug:string,query=""){return demoListings.filter(item=>item.city===slug && `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()));}
