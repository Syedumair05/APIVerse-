import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { CacheService } from '../services/cacheService';
import { logger } from '../utils/logger';

async function main() {
  console.log('--- APIVerse Research Experimental Control: Clear Cache ---');
  const port = process.env.PORT || '5000';
  const researchSecret = process.env.RESEARCH_SECRET || '';
  const serverUrl = `http://localhost:${port}/api/research/clear-cache`;

  let clearedRunningServer = false;

  try {
    const headers: Record<string, string> = {};
    if (researchSecret) {
      headers['x-research-key'] = researchSecret;
    }
    const response = await axios.post(serverUrl, {}, { headers, timeout: 3000 });
    if (response.data && response.data.success) {
      console.log(`[HTTP SUCCESS] Cleared in-memory Map and MongoDB cache on running backend server (Port ${port}).`);
      clearedRunningServer = true;
    }
  } catch {
    console.log(`[NOTICE] Running backend server not reachable at ${serverUrl} or endpoint restricted. Falling back to direct database purge...`);
  }

  // Perform database purge as well to guarantee MongoDB CacheModel is reset
  await connectDatabase();
  const dbResult = await CacheService.clearAll();
  console.log('Direct Database Purge Result:', dbResult);
  if (clearedRunningServer) {
    console.log('Note: Both running process inMemoryCache and MongoDB CacheModel are verified cleared.');
  } else {
    console.log('Note: Direct database purge completed. If the backend server is running in another process, invoke POST /api/research/clear-cache to clear its process inMemoryCache.');
  }
  logger.info('Cache clear operation finished.');
  await disconnectDatabase();
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to clear cache:', err);
  process.exit(1);
});
