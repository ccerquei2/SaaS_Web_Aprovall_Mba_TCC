import { regenerateDataset } from './lib/seed';

const dataset = regenerateDataset(42);

console.log(JSON.stringify(dataset, null, 2));
