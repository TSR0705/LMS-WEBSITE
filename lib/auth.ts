import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import getCourseById from "@/sanity/lib/courses/getCourseById";

interface AuthResult {
  isAuthorized: boolean;
  redirect?: string;
  studentId?: string;
}

export async function checkCourseAccess(
  clerkId: string | null,
  courseId: string
): Promise<AuthResult> {
  if (!clerkId) {
    return {
      isAuthorized: false,
      redirect: "/",
    };
  }

  const student = await getStudentByClerkId(clerkId);
  if (!student?.data?._id) {
    return {
      isAuthorized: false,
      redirect: "/",
    };
  }

  const isEnrolled = await isEnrolledInCourse(clerkId, courseId);
  const course = await getCourseById(courseId);
  if (!isEnrolled) {
    return {
      isAuthorized: false,
      redirect: `/courses/${course?.slug?.current}`,
    };
  }

  return {
    isAuthorized: true,
    studentId: student.data._id,
  };
}
