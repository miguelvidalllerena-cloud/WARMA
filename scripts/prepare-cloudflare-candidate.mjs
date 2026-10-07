import fs from 'node:fs';
import path from 'node:path';

// Deployment metadata only. Never alter application code, assets or feature flags.
const file = 'dist/server/wrangler.json';
const config = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!config.main || !config.assets?.directory || !config.no_bundle) {
  throw new Error('Expected the generated Cloudflare Worker config with bundled assets.');
}
for (const target of [config.main, config.assets.directory]) {
  if (!fs.existsSync(path.resolve(path.dirname(file), target))) {
    throw new Error(`Missing generated output: ${target}`);
  }
}
config.name = 'warma-candidate-cfcfc59';
if ('topLevelName' in config) config.topLevelName = config.name;
config.preview_urls = true;
config.workers_dev = false;
config.vars = { ...config.vars, AI_REMOTE_ENABLED: 'false' };
fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n');
console.log('Prepared WARMA candidate version upload; production route disabled.');
