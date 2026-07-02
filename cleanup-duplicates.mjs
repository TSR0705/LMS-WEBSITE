import { createClient } from "next-sanity";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_ADMIN_TOKEN,
  useCdn: false,
});

async function main() {
  console.log("Fetching all enrollments...");
  const enrollments = await client.fetch(
    `*[_type == "enrollment"]{ _id, student, course, amount, paymentId, enrolledAt, _createdAt, _updatedAt, status, source }`
  );

  console.log(`Found ${enrollments.length} total enrollments.`);

  const groups = new Map();

  // Group by student._ref + course._ref
  for (const enrollment of enrollments) {
    if (!enrollment.student?._ref || !enrollment.course?._ref) continue;
    
    const key = `${enrollment.student._ref}-${enrollment.course._ref}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(enrollment);
  }

  const duplicatesToDelete = [];
  const paymentsToCreate = [];
  const backups = [];

  for (const [key, group] of groups.entries()) {
    // We want to migrate ALL payments to the new schema
    for (const record of group) {
      if (record.paymentId) {
        paymentsToCreate.push({
          _id: `payment-${record.paymentId}`,
          _type: "payment",
          student: record.student,
          course: record.course,
          amount: record.amount || 0,
          paymentId: record.paymentId,
          status: "paid",
          processedAt: record.enrolledAt || record._createdAt,
        });
      }
    }

    if (group.length > 1) {
      console.log(`\nFound ${group.length} duplicates for student/course: ${key}`);
      
      // Sort by creation date ascending (oldest first)
      group.sort((a, b) => new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime());

      // Let's choose the canonical document. We will create a NEW deterministic one,
      // and delete ALL old ones to strictly enforce the new schema constraints!
      // The deterministic ID is:
      const studentId = group[0].student._ref;
      const courseId = group[0].course._ref;
      const deterministicId = `enrollment-${studentId}-${courseId}`;

      // Pick the oldest's enrolledAt
      const canonicalEnrolledAt = group[0].enrolledAt || group[0]._createdAt;
      
      // But wait! Is one of the existing documents already the deterministic ID?
      const existingCanonicalIndex = group.findIndex(r => r._id === deterministicId);

      // We back up ALL of them
      backups.push(...group);

      // Mark all non-canonical documents for deletion
      for (const record of group) {
        if (record._id !== deterministicId) {
          duplicatesToDelete.push(record._id);
        }
      }

      // If the deterministic document DOES NOT exist yet, we must create it
      if (existingCanonicalIndex === -1) {
        console.log(`Creating canonical deterministic document for ${key}...`);
        await client.createIfNotExists({
          _id: deterministicId,
          _type: "enrollment",
          student: group[0].student,
          course: group[0].course,
          status: "ACTIVE",
          source: "Migration",
          enrolledAt: canonicalEnrolledAt,
        });
      }
    } else {
      // Even if there's only 1, is it using the deterministic ID?
      const record = group[0];
      const deterministicId = `enrollment-${record.student._ref}-${record.course._ref}`;
      
      if (record._id !== deterministicId) {
        console.log(`Migrating single record ${record._id} to deterministic ID...`);
        backups.push(record);
        
        await client.createIfNotExists({
          _id: deterministicId,
          _type: "enrollment",
          student: record.student,
          course: record.course,
          status: record.status || "ACTIVE",
          source: record.source || "Stripe",
          enrolledAt: record.enrolledAt || record._createdAt,
        });

        duplicatesToDelete.push(record._id);
      }
    }
  }

  // Backup
  if (backups.length > 0) {
    fs.writeFileSync("duplicates-backup.json", JSON.stringify(backups, null, 2));
    console.log(`\nBacked up ${backups.length} old documents to duplicates-backup.json`);
  }

  // Migrate Payments
  if (paymentsToCreate.length > 0) {
    console.log(`\nMigrating ${paymentsToCreate.length} payment records...`);
    for (const payment of paymentsToCreate) {
      await client.createIfNotExists(payment);
    }
  }

  // Delete Duplicates
  if (duplicatesToDelete.length > 0) {
    console.log(`\nDeleting ${duplicatesToDelete.length} legacy/duplicate enrollment records...`);
    for (const id of duplicatesToDelete) {
      await client.delete(id);
    }
  }

  console.log("\nCleanup and Migration Complete!");
}

main().catch(console.error);
