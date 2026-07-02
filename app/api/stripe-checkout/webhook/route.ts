import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { StripeWebhookService } from "@/sanity/services/StripeWebhookService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return new NextResponse("No signature found", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${errorMessage}`);

      return new NextResponse(`Webhook Error: ${errorMessage}`, {
        status: 400,
      });
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get the courseId and userId from the metadata
      const courseId = session.metadata?.courseId;
      const userId = session.metadata?.userId;

      if (!courseId || !userId) {
        return new NextResponse("Missing metadata", { status: 400 });
      }

      const student = await getStudentByClerkId(userId);

      if (!student.data) {
        return new NextResponse("Student not found", { status: 400 });
      }

      console.log(
        `[Webhook] Processing ${event.id} (Session: ${session.id}) for Student: ${student.data._id}, Course: ${courseId}`
      );

      // Use the service layer to orchestrate the creation
      await StripeWebhookService.processCheckoutSessionCompleted({
        eventId: event.id,
        studentId: student.data._id,
        courseId,
        amount: session.amount_total || 0, // already in cents for payment tracking
        paymentId: session.id,
      });

      return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
