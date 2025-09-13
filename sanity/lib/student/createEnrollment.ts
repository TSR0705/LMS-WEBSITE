import { client } from "../adminClient";

interface CreateEnrollmentParams {
  studentId: string;
  courseId: string;
  paymentId: string;
  amount: number;
}

export async function createEnrollment({
  studentId,
  courseId,
  paymentId,
  amount,
}: CreateEnrollmentParams) {
  return client.create({
    _type: "enrollment",
    student: {
      _type: "reference",
      _ref: studentId,
    },
    course: {
      _type: "reference",
      _ref: courseId,
    },
    paymentId,
    amount,
    enrolledAt: new Date().toISOString(),
  });
}
