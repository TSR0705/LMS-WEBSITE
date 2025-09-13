"use server";

import { completeLessonById } from "@/sanity/lib/lessons/completeLessonById";

export async function completeLessonAction(lessonId: string, clerkId: string) {
  try {
    await completeLessonById({
      lessonId,
      clerkId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, error: "Failed to complete lesson" };
  }
}
