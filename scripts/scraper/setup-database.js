const fs = require('fs');
const path = require('path');

console.log('🗄️  Database Setup Instructions');
console.log('================================\n');

console.log('To set up your database for the wine scraper:');
console.log('');
console.log('1. Go to your Supabase dashboard:');
console.log('   https://supabase.com/dashboard');
console.log('');
console.log('2. Select your project');
console.log('');
console.log('3. Go to SQL Editor');
console.log('');
console.log('4. Copy and paste the contents of this file:');
console.log(`   ${path.join(__dirname, '../../src/lib/database-schema.sql')}`);
console.log('');
console.log('5. Run the SQL script');
console.log('');
console.log('6. After the database is set up, run the scraper again:');
console.log('   npm run dev');
console.log('');

// Check if schema file exists
const schemaPath = path.join(__dirname, '../../src/lib/database-schema.sql');
if (fs.existsSync(schemaPath)) {
  console.log('✅ Database schema file found at:');
  console.log(`   ${schemaPath}`);
  console.log('');
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const lines = schema.split('\n').length;
  console.log(`📄 Schema contains ${lines} lines of SQL`);
  console.log('');
  console.log('First few lines:');
  console.log('----------------');
  console.log(schema.split('\n').slice(0, 10).join('\n'));
  console.log('...');
} else {
  console.log('❌ Database schema file not found');
  console.log('   Expected location:', schemaPath);
}

console.log('');
console.log('🔧 Alternative: Run scraper in test mode (no database required):');
console.log('   npm run dev test');