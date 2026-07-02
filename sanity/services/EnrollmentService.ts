import { client } from "../../lib/adminClient";
import groq from "groq";
import { sanityFetch } from "../../lib/live";

interface CreateEnrollmentParams {
  studentId: string;
  courseId: string;
  paymentId: string;
  amount: number;
}

export class EnrollmentService {
  /**
   * Determinstic enrollment ID ensures idempotency.
   */
  private static generateId(studentId: string, courseId: string) {
    return `enrollment-${studentId}-${courseId}`;
  }

  /**
   * Fetches an existing enrollment.
   */
  static async getEnrollment(studentId: string, courseId: string) {
    const enrollment = await sanityFetch({
      query: groq`*[_type == "enrollment" && student._ref == $studentId && course._ref == $courseId][0]`,
      params: { studentId, courseId },
    });
    return enrollment.data;
  }

  /**
   * Checks if an enrollment already exists for a given student and course.
   */
  static async checkEnrollmentExists(studentId: string, courseId: string): Promise<boolean> {
    const existing = await this.getEnrollment(studentId, courseId);
    return !!existing;
  }

  /**
   * Creates an enrollment idempotently using a deterministic ID.
   * If it already exists, it will not be duplicated.
   */
  static async createEnrollment(params: CreateEnrollmentParams) {
    const enrollmentId = this.generateId(params.studentId, params.courseId);

    // Using createIfNotExists for atomic creation and strict idempotency
    return client.createIfNotExists({
      _id: enrollmentId,
      _type: "enrollment",
      student: {
        _type: "reference",
        _ref: params.studentId,
      },
      course: {
        _type: "reference",
        _ref: params.courseId,
      },
      paymentId: params.paymentId,
      amount: params.amount,
      status: "ACTIVE",
      source: "Stripe",
      enrolledAt: new Date().toISOString(),
    });
  }
}
