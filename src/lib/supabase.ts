import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://ffpkneionqoixqlqschn.supabase.co';
const supabaseKey = 'sb_publishable_noR-KE_yjKlYC0mYXsPGJw_8kHEZRzr';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };