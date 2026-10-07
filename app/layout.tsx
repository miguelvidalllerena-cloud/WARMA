import type { Metadata } from 'next';
import './globals.css';
import './warma.css';
export const metadata: Metadata = {title:'WARMA — Vuelve a tu centro',description:'Organización académica, pausas conscientes, bitácora y autorregulación. Un espacio personal que funciona sin conexión.',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'WARMA'},icons:{icon:'/favicon.svg',shortcut:'/favicon.svg',apple:'/icon-192.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es" className="dark"><head><meta name="theme-color" content="#080f15"/></head><body>{children}</body></html>;}
