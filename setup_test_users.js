import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setup() {
    const rolesToFind = ['donor', 'recipient', 'volunteer', 'admin'];
    const selectedUsers = {};

    // Get all public users to find roles
    const { data: profiles, error } = await supabase.from('users').select('id, email, role');
    if (error) { console.error(error); return; }

    for (const role of rolesToFind) {
        const user = profiles.find(p => p.role === role);
        if (user) {
            selectedUsers[role] = user.email;
            // Update password in auth schema
            const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password: 'Password123!' });
            if (updateError) console.error(`Failed to update ${role}:`, updateError);
            else console.log(`Updated ${role} (${user.email}) password to Password123!`);
        }
    }
    console.log(JSON.stringify(selectedUsers));
}

setup();
