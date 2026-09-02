import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Career Goals',
    short_name: 'Career Goals',
    description: "Joy's CV/Robotics accountability tracker.",
    start_url: '/',
    display: 'standalone',
    background_color: '#059669',
    theme_color: '#059669',
    icons: [
      { src: '/api/icon?size=192', sizes: '192x192', type: 'image/png' },
      { src: '/api/icon?size=512', sizes: '512x512', type: 'image/png' },
    ],
  };
}
