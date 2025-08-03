import { initializeDatabase } from './database';

export async function initializeApp() {
  console.log('Initializing application...');
  
  // Initialize database tables
  await initializeDatabase();
  
  console.log('Application initialization complete');
}
