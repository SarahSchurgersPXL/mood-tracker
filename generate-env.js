const fs = require('fs');
const path = './src/environments/environment.prod.secret.ts';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Vercel environment variables!');
}

const content = `
export const environment = {
  production: true,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

fs.writeFileSync(path, content.trim());
console.log('✅ environment.prod.secret.ts gegenereerd');
