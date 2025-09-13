import { type SchemaTypeDefinition } from "sanity";
import {
  courseType,
  moduleType,
  lessonType,
  instructorType,
  studentType,
  enrollmentType,
  categoryType,
  lessonCompletionType,
} from "./schemaTypes";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    studentType,
    enrollmentType,
    categoryType,
    lessonCompletionType,
  ],
};
