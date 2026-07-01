// src/config/seed.js
// Seeds MongoDB with default users, services, and announcements.
// Run: node src/config/seed.js

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from './env.js';
import { connectDb } from './db.js';
import { User } from '../models/User.js';
import { Service } from '../models/Service.js';
import { Announcement } from '../models/Announcement.js';
import { logger } from '../utils/logger.js';

async function seed() {
  await connectDb();
  logger.info('🌱 Seeding MongoDB database...');

  // ─── Users ──────────────────────────────────────────────────────────────────
  const citizenPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin2026', 10);

  await User.deleteMany({}); // Clear existing users

  await User.insertMany([
    {
      citizenId: 'GOV-2026-001',
      name: 'Citizen Zone',
      identifier: 'citizen@egov.portal',
      password: citizenPassword,
      role: 'citizen',
      tier: 'gold',
    },
    {
      citizenId: 'GOV-2026-002',
      name: 'Admin User',
      identifier: 'admin@egov.portal',
      password: adminPassword,
      role: 'admin',
      tier: 'platinum',
    },
    {
      citizenId: 'GOV-2026-003',
      name: 'Citizen Phone',
      identifier: '60123456789',
      password: citizenPassword,
      role: 'citizen',
      tier: 'standard',
    },
  ]);
  logger.success('✅ Users seeded (3 accounts).');

  // ─── Services ────────────────────────────────────────────────────────────────
  await Service.deleteMany({});

  await Service.insertMany([
    { icon: '📋', title: 'National ID Card', description: 'Apply, renew or replace your National ID', category: 'Identity', color: 'rgba(212,175,55,0.15)', badge: 'Popular' },
    { icon: '🌐', title: 'Passport Services', description: 'New passport, renewal and emergency travel docs', category: 'Immigration', color: 'rgba(212,175,55,0.15)', badge: 'Popular' },
    { icon: '📜', title: 'Birth Certificate', description: 'Register new birth or request certified copy', category: 'Identity', color: 'rgba(212,175,55,0.1)' },
    { icon: '💒', title: 'Marriage Certificate', description: 'Marriage registration and certified copies', category: 'Identity', color: 'rgba(212,175,55,0.1)' },
    { icon: '🏥', title: 'Medical Registration', description: 'Register with national health system', category: 'Health', color: 'rgba(34,197,94,0.12)' },
    { icon: '💊', title: 'Health Subsidy', description: 'Apply for medical cost assistance', category: 'Health', color: 'rgba(34,197,94,0.12)', badge: 'New' },
    { icon: '🎓', title: 'Scholarship Portal', description: 'Apply for government scholarships', category: 'Education', color: 'rgba(59,130,246,0.12)' },
    { icon: '📚', title: 'School Enrollment', description: 'Public school registration & enrollment', category: 'Education', color: 'rgba(59,130,246,0.12)' },
    { icon: '💼', title: 'Job Portal', description: 'Government and private sector job listings', category: 'Employment', color: 'rgba(168,85,247,0.12)' },
    { icon: '🏠', title: 'Housing Permit', description: 'Apply for construction & housing permits', category: 'Housing', color: 'rgba(249,115,22,0.12)' },
    { icon: '💰', title: 'Tax Filing', description: 'Submit annual personal income tax', category: 'Finance', color: 'rgba(236,72,153,0.12)', badge: 'Popular' },
    { icon: '🚗', title: 'Vehicle Registration', description: 'Register or renew vehicle road tax', category: 'Transport', color: 'rgba(14,165,233,0.12)' },
    { icon: '🚔', title: 'Police Report', description: 'Submit and track police reports online', category: 'Security', color: 'rgba(239,68,68,0.12)' },
    { icon: '⚖️', title: 'Legal Aid', description: 'Access free legal consultation services', category: 'Legal', color: 'rgba(239,68,68,0.12)' },
    { icon: '🌿', title: 'Environment Permit', description: 'Environmental impact assessment and permits', category: 'Environment', color: 'rgba(16,185,129,0.12)' },
    { icon: '✈️', title: 'Visa Application', description: 'Apply or track visa applications', category: 'Immigration', color: 'rgba(99,102,241,0.12)' },
  ]);
  logger.success('✅ Services seeded (16 entries).');

  // ─── Announcements ───────────────────────────────────────────────────────────
  await Announcement.deleteMany({});

  await Announcement.insertMany([
    { title: 'E-Passport Application Portal Now Available Online', summary: 'Citizens can now apply for new and renewal passports entirely online. The new system allows upload of required documents and online payment, reducing wait times by 80%.', category: 'Immigration', priority: 'urgent', isNew: true, publishedAt: new Date('2026-06-29') },
    { title: 'New Digital National Identity Card (MyDigital ID) Program Launched', summary: 'The government has officially launched the MyDigital ID program, enabling all citizens to carry a verified digital identity on their smartphones.', category: 'Digital Services', isNew: true, publishedAt: new Date('2026-06-29') },
    { title: 'Tax Submission Deadline Extended to August 31, 2026', summary: 'The Revenue Department has extended the personal income tax filing deadline by one month. Citizens are encouraged to use the online e-Filing system.', category: 'Finance', isNew: true, publishedAt: new Date('2026-06-28') },
    { title: 'Healthcare Subsidy for Low-Income Families — Applications Open', summary: 'A new government healthcare subsidy program is now accepting applications. Eligible families can receive monthly medical support worth up to $200 per month.', category: 'Health', priority: 'info', publishedAt: new Date('2026-06-25') },
    { title: 'Government Scholarship Applications for 2026/2027 Academic Year', summary: 'The Education Ministry is now accepting scholarship applications for the upcoming academic year. Deadline: July 31, 2026.', category: 'Education', publishedAt: new Date('2026-06-22') },
    { title: 'Vehicle Road Tax Renewal Now Available 24/7 Online', summary: 'Citizens can now renew their vehicle road tax at any time through the official government portal.', category: 'Transport', publishedAt: new Date('2026-06-20') },
    { title: 'Scheduled System Maintenance — July 5, 2026 (02:00–04:00)', summary: 'The e-Gov Portal will undergo scheduled maintenance on July 5, 2026. All services will be temporarily unavailable during this period.', category: 'System', priority: 'urgent', publishedAt: new Date('2026-06-18') },
    { title: 'New Public Housing Application Cycle Now Open', summary: 'The Ministry of Housing has announced the new cycle for public housing applications. Priority given to first-time applicants and low-income families.', category: 'Housing', priority: 'info', publishedAt: new Date('2026-06-15') },
  ]);
  logger.success('✅ Announcements seeded (8 entries).');

  logger.success('\n🎉 MongoDB seeding complete!');
  logger.info('  Default accounts:');
  logger.info('    citizen@egov.portal / password123  (citizen, gold tier)');
  logger.info('    60123456789 / password123           (citizen, standard)');
  logger.info('    admin@egov.portal / admin2026       (admin, platinum)');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  logger.error('❌ Seed failed:', err);
  process.exit(1);
});
