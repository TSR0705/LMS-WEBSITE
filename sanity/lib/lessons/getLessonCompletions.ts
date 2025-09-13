import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getLessonCompletions(
  studentId: string,
  courseId: string
) {
  const getCompletionsQuery = defineQuery(`{
    "completedLessons": *[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
      ...,
      "lesson": lesson->{...},
      "module": module->{...}
    },
    "course": *[_type == "course" && _id == $courseId][0] {
      ...,
      "modules": modules[]-> {
        ...,
        "lessons": lessons[]-> {...}
      }
    }
  }`);

  const result = await sanityFetch({
    query: getCompletionsQuery,
    params: { studentId, courseId },
  });

  const { course, completedLessons } = result.data;

  // Calculate module progress
  const moduleProgress = course?.modules?.map((module) => {
    const totalLessons = module.lessons?.length || 0;
    const completedInModule = completedLessons.filter(
      (completion) => completion.module?._id === module._id
    ).length;

    return {
      moduleId: module._id,
      title: module.title,
      progress: totalLessons > 0 ? (completedInModule / totalLessons) * 100 : 0,
      completedLessons: completedInModule,
      totalLessons,
    };
  });

  // Calculate overall course progress
  const totalLessons =
    course?.modules?.reduce(
      (acc, module) => acc + (module?.lessons?.length || 0),
      0
    ) || 0;

  const totalCompleted = completedLessons?.length || 0;
  const courseProgress =
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;

  return {
    completedLessons: completedLessons || [],
    moduleProgress: moduleProgress || [],
    courseProgress,
  };
}
