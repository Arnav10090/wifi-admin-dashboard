const { execSync } = require('child_process');
const sequelize = require('./lib/db');

async function setupRBAC() {
  try {
    console.log('Setting up RBAC/ABAC system...');
    
    // Test database connection
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection successful!');
    
    // Run migrations
    console.log('Running migrations...');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    
    // Seed RBAC data
    console.log('Seeding RBAC data...');
    const seedRBACData = require('./seeders/rbac-data');
    await seedRBACData();
    
    console.log('RBAC/ABAC setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up RBAC:', error);
    process.exit(1);
  }
}

setupRBAC(); 