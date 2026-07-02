import { client } from "../lib/adminClient";
import groq from "groq";
import { sanityFetch } from "../lib/live";

interface CreatePaymentParams {
  studentId: string;
  courseId: string;
  amount: number;
  paymentId: string;
  status: "pending" | "paid" | "failed" | "refunded" | "partially_refunded" | "disputed" | "cancelled";
}

export class PaymentService {
  /**
   * Deterministic ID for payments based on Stripe Session / Payment Intent ID.
   * This guarantees we never record the same transaction twice.
   */
  private static generateId(paymentId: string) {
    return `payment-${paymentId}`;
  }

  /**
   * Records a payment transaction idempotently.
   */
  static async createPayment(params: CreatePaymentParams) {
    const id = this.generateId(params.paymentId);

    return client.createIfNotExists({
      _id: id,
      _type: "payment",
      student: {
        _type: "reference",
        _ref: params.studentId,
      },
      course: {
        _type: "reference",
        _ref: params.courseId,
      },
      amount: params.amount,
      paymentId: params.paymentId,
      status: params.status,
      processedAt: new Date().toISOString(),
    });
  }

  static async getPaymentByPaymentId(paymentId: string) {
    const existing = await sanityFetch({
      query: groq`*[_type == "payment" && paymentId == $paymentId][0]`,
      params: { paymentId },
    });
    return existing.data;
  }
}
