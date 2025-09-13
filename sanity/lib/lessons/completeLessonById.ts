import groq from "groq";
import { client } from "../adminClient";
import { getStudentByClerkId } from "../student/getStudentByClerkId";
import { sanityFetch } from "../live";

export async function completeLessonById({
  lessonId,
  clerkId,
}: {
  lessonId: string;
  clerkId: string;
}) {
  try {
    // Get Sanity student ID from Clerk ID
    const student = await getStudentByClerkId(clerkId);

    if (!student?.data?._id) {
      throw new Error("Student not found");
    }

    const studentId = student.data._id;

    // Check if lesson is already completed
    const existingCompletion = await sanityFetch({
      query: groq`*[_type == "lessonCompletion" && student._ref == $studentId && lesson._ref == $lessonId][0]`,
      params: { studentId, lessonId },
    });

    if (existingCompletion.data) {
      return existingCompletion.data;
    }

    // Fetch lesson details to get module and course
    const lesson = await sanityFetch({
      query: groq`*[_type == "lesson" && _id == $lessonId][0]{
        _id,
        "module": *[_type == "module" && references(^._id)][0]{
          _id,
          "course": *[_type == "course" && references(^._id)][0]._id
        }
      }`,
      params: { lessonId },
    });

    if (!lesson?.data?.module?._id || !lesson?.data?.module?.course) {
      throw new Error("Could not find module or course for lesson");
    }

    // Create new completion record
    const completion = await client.create({
      _type: "lessonCompletion",
      student: {
        _type: "reference",
        _ref: studentId,
      },
      lesson: {
        _type: "reference",
        _ref: lessonId,
      },
      module: {
        _type: "reference",
        _ref: lesson.data.module._id,
      },
      course: {
        _type: "reference",
        _ref: lesson.data.module.course,
      },
      completedAt: new Date().toISOString(),
    });

    return completion;
  } catch (error) {
    console.error("Error completing lesson:", error);
    throw error;
  }
}
