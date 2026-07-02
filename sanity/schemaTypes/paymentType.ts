import { defineField, defineType } from "sanity";

export const paymentType = defineType({
  name: "payment",
  title: "Payment",
  type: "document",
  fields: [
    defineField({
      name: "student",
      title: "Student",
      type: "reference",
      to: [{ type: "student" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: [{ type: "course" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "number",
      validation: (rule) => rule.required().min(0),
      description: "The amount paid in cents",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
          { title: "Partially Refunded", value: "partially_refunded" },
          { title: "Disputed", value: "disputed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "paymentId",
      title: "Payment/Session ID",
      type: "string",
      validation: (rule) => rule.required(),
      description: "The Stripe checkout session ID or payment intent ID",
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
      courseTitle: "course.title",
      amount: "amount",
      status: "status",
    },
    prepare({ courseTitle, amount, status }) {
      return {
        title: `${courseTitle} - $${(amount / 100).toFixed(2)}`,
        subtitle: `Status: ${status}`,
      };
    },
  },
});
