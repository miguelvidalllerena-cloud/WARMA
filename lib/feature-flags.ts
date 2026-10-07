/** Release defaults. Neither browser storage nor query parameters can enable restricted features. */
export const FEATURE_FLAGS = Object.freeze({
 PSS10_ENABLED: false,
 AI_REMOTE_ENABLED: false,
 CLOUD_SYNC_ENABLED: false,
});
export type FeatureEnvironment = {AI_REMOTE_ENABLED?: string};
/** Server-only configuration input; all provider, consent and limiter gates still apply. */
export function remoteAIEnabled(env: FeatureEnvironment): boolean {
 return env.AI_REMOTE_ENABLED === 'true';
}
