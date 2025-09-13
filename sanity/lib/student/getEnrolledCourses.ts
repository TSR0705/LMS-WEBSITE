import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getEnrolledCourses(clerkId: string) {
  const getEnrolledCoursesQuery =
    defineQuery(`*[_type == "student" && clerkId == $clerkId][0] {
    "enrolledCourses": *[_type == "enrollment" && student._ref == ^._id] {
      ...,
      "course": course-> {
        ...,
        "slug": slug.current,
        "category": category->{...},
        "instructor": instructor->{...}
      }
    }
  }`);

  const result = await sanityFetch({
    query: getEnrolledCoursesQuery,
    params: { clerkId },
  });

  return result?.data?.enrolledCourses || [];
}
