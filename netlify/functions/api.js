import serverless from 'serverless-http';

// Set serverless environment flags
process.env.NETLIFY = 'true';
process.env.SERVERLESS = 'true';

import app from '../../server/src/server.js';

export const handler = serverless(app);
