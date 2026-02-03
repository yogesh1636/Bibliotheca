// Supabase Configuration
const SUPABASE_URL = 'https://eldzamhnwbbxuziexwrf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZHphbWhud2JieHV6aWV4d3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjkwNzEsImV4cCI6MjA4NTcwNTA3MX0.B7WJz3GSfnVNALGJwQ1ENbTmvBXVxQT7XkDZObByYSo';

// Initialize Supabase client
let supabaseClient;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseClient = supabaseClient;
  }
} catch (error) {
  console.error('Error initializing Supabase:', error);
}