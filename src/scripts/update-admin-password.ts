import prisma from '../server/db';
import bcrypt from 'bcrypt';

async function updateAdminPassword() {
  try {
    const adminEmail = 'admin@example.com';
    const newPassword = 'password123';

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Generated hash length:', hashedPassword.length);

    // Update the admin user
    const updatedAdmin = await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword }
    });

    console.log('Admin password updated successfully');
    console.log('New password hash length:', updatedAdmin.password.length);
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword(); 