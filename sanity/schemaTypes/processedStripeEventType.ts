import { defineField, defineType } from "sanity";

export const processedStripeEventType = defineType({
  name: "processedStripeEvent",
  title: "Processed Stripe Event",
  type: "document",
  fields: [
    defineField({
      name: "eventId",
      title: "Event ID",
      type: "string",
      validation: (rule) => rule.required(),
      description: "The Stripe event ID",
    }),
    defineField({
      name: "processedAt",
      title: "Processed At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      eventId: "eventId",
      processedAt: "processedAt",
    },
    prepare({ eventId, processedAt }) {
      return {
        title: eventId,
        subtitle: processedAt ? new Date(processedAt).toLocaleString() : "",
      };
    },
  },
});
