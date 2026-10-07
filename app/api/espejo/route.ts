import {env} from 'cloudflare:workers';
import {handleMirrorStatus,handleMirrorRequest,type MirrorEnvironment} from '@/lib/server/mirror-endpoint';
export const dynamic='force-dynamic';

// Runtime secrets and bindings, never process.env injected into client code.
export async function GET(){return handleMirrorStatus(env as unknown as MirrorEnvironment);}
export async function POST(request:Request){return handleMirrorRequest(request,env as unknown as MirrorEnvironment);}
