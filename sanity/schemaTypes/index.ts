import { type SchemaTypeDefinition } from "sanity";
import { courseType } from "./CourseType";
import { moduleType } from "./moduleType";
import { lessonType } from "./lessonType";
import { instructorType } from "./instructorType";
import { blockContent } from "./blockContent";
import { studentType } from "./StudentType";
import { enrollmentType } from "./enrollmentType";
import { categoryType } from "./categoryType";
import { lessonCompletionType } from "./lessonCompletionType";
import { paymentType } from "./paymentType";
import { processedStripeEventType } from "./processedStripeEventType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    blockContent,
    studentType,
    enrollmentType,
    categoryType,
    lessonCompletionType,
    paymentType,
    processedStripeEventType,
  ],
};

export * from "./CourseType";
export * from "./moduleType";
export * from "./lessonType";
export * from "./instructorType";
export * from "./StudentType";
export * from "./enrollmentType";
export * from "./categoryType";
export * from "./lessonCompletionType";
export * from "./paymentType";
export * from "./processedStripeEventType";
