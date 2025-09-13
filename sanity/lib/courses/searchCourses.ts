import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function searchCourses(term: string) {
  const searchQuery = defineQuery(`*[_type == "course" && (
    title match $term + "*" ||
    description match $term + "*" ||
    category->name match $term + "*"
  )] {
    ...,
    "slug": slug.current,
    "category": category->{...},
    "instructor": instructor->{...}
  }`);

  const result = await sanityFetch({
    query: searchQuery,
    params: { term },
  });

  return result.data || [];
}
