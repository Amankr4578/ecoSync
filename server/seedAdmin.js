import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Admin user credentials
const ADMIN_USER = {
    name: 'Admin User',
    email: 'admin@ecosync.com',
    password: 'admin123', // Change this in production!
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    ecoPoints: 0,
    totalRecycled: 0,
    carbonOffset: 0,
    level: 1
};

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get User model
        const userSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true },
            password: String,
            phone: String,
            location: String,
            avatar: String,
            ecoPoints: Number,
            totalRecycled: Number,
            carbonOffset: Number,
            level: Number,
            role: String,
            createdAt: { type: Date, default: Date.now }
        });

        const User = mongoose.models.User || mongoose.model('User', userSchema);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_USER.email });
        
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log(`Email: ${ADMIN_USER.email}`);
            console.log('Updating role to admin...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin role updated!');
        } else {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(ADMIN_USER.password, salt);

            // Create admin user
            const admin = await User.create({
                ...ADMIN_USER,
                password: hashedPassword
            });

            console.log('\n✅ Admin user created successfully!\n');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  Admin Login Credentials:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`  Email:    ${ADMIN_USER.email}`);
            console.log(`  Password: ${ADMIN_USER.password}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            console.log('⚠️  Change the password after first login!\n');
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
