"use server";

import { uncompleteLessonById } from "@/sanity/lib/lessons/uncompleteLessonById";

export async function uncompleteLessonAction(
  lessonId: string,
  clerkId: string
) {
  try {
    await uncompleteLessonById({
      lessonId,
      clerkId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error uncompleting lesson:", error);
    throw error;
  }
}
