import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- Connected to MongoDB ---');

    try {
      await mongoose.connection.collection('users').dropIndex('contact_1');
      console.log('Dropped legacy contact_1 index to avoid conflicts.');
    } catch (e) {
      // Ignore if index doesn't exist
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@saboyouthfoundation.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Qwerty123';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log('Admin account not found. Creating a new one...');
      admin = new User({
        fullName: process.env.ADMIN_NAME || 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        adminRole: 'super_admin',
        isActive: true,
        isEmailVerified: true
      });
      await admin.save();
      console.log('✅ Admin account created successfully.');
    } else {
      console.log('Admin account found. Updating roles and resetting password...');
      admin.role = 'admin';
      admin.adminRole = 'super_admin';
      admin.fullName = process.env.ADMIN_NAME || 'Super Admin';
      admin.password = adminPassword;
      await admin.save();
      console.log('✅ Admin account updated successfully.');
    }

    console.log('\n================================');
    console.log('    ADMIN LOGIN CREDENTIALS     ');
    console.log('================================');
    console.log('URL:      http://localhost:5174/admin-login');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Role:     super_admin');
    console.log('================================\n');

  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    process.exit();
  }
};

setupAdmin();
