import { client } from "../../lib/adminClient";
import groq from "groq";
import { sanityFetch } from "../../lib/live";
import { EnrollmentService } from "./EnrollmentService";
import { PaymentService } from "./PaymentService";

export class StripeWebhookService {
  /**
   * Checks if an event has already been processed.
   */
  static async hasEventBeenProcessed(eventId: string): Promise<boolean> {
    const existing = await sanityFetch({
      query: groq`*[_type == "processedStripeEvent" && eventId == $eventId][0]`,
      params: { eventId },
    });
    return !!existing.data;
  }

  /**
   * Marks an event as processed deterministically.
   */
  static async recordEventProcessed(eventId: string) {
    const id = `stripe-event-${eventId}`;
    return client.createIfNotExists({
      _id: id,
      _type: "processedStripeEvent",
      eventId,
      processedAt: new Date().toISOString(),
    });
  }

  /**
   * Orchestrates the entire webhook processing flow.
   * Maintains strict idempotency and decoupling of concerns.
   */
  static async processCheckoutSessionCompleted({
    eventId,
    studentId,
    courseId,
    amount,
    paymentId, // Stripe session id or payment intent id
  }: {
    eventId: string;
    studentId: string;
    courseId: string;
    amount: number;
    paymentId: string;
  }) {
    // 1. Acknowledge and prevent duplicate event processing
    const isProcessed = await this.hasEventBeenProcessed(eventId);
    if (isProcessed) {
      console.log(`[StripeWebhookService] Event ${eventId} already processed. Skipping.`);
      return { success: true, alreadyProcessed: true };
    }

    // 2. Mark event as processed FIRST (fail-fast architecture)
    await this.recordEventProcessed(eventId);

    // 3. Record the transaction (idempotent via PaymentService)
    await PaymentService.createPayment({
      studentId,
      courseId,
      amount,
      paymentId,
      status: "paid",
    });

    // 4. Provision course access (idempotent via EnrollmentService)
    await EnrollmentService.createEnrollment({
      studentId,
      courseId,
      amount,
      paymentId,
    });

    console.log(`[StripeWebhookService] Successfully processed event ${eventId}`);
    return { success: true, alreadyProcessed: false };
  }
}
