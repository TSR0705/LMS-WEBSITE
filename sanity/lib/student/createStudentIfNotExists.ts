import groq from "groq";
import { client } from "../adminClient";
import { sanityFetch } from "../live";

interface CreateStudentProps {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export async function createStudentIfNotExists({
  clerkId,
  email,
  firstName,
  lastName,
  imageUrl,
}: CreateStudentProps) {
  // First check if student exists
  const existingStudentQuery = await sanityFetch({
    query: groq`*[_type == "student" && clerkId == $clerkId][0]`,
    params: { clerkId },
  });

  if (existingStudentQuery.data) {
    console.log("Student already exists", existingStudentQuery.data);
    return existingStudentQuery.data;
  }

  // If no student exists, create a new one
  const newStudent = await client.create({
    _type: "student",
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,
  });

  console.log("New student created", newStudent);

  return newStudent;
}
