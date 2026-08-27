// Small flat-illustration "photo" scenes shown on the hero globe's pin
// cards, cycling every few seconds while a pin is in view. Stand-ins for
// real destination photography (none is available yet) — swap a slug's
// entries for <img> markup once real photos exist, no caller changes needed
// since hero-globe.js just drops `svg` into innerHTML.
export const DESTINATION_SCENES = {
  "dubai-city-escape": [
    {
      title: "Skyline Hotel",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="dubaiHotelSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2f6fe0" /><stop offset="1" stop-color="#101d54" />
        </linearGradient></defs>
        <rect width="160" height="100" fill="url(#dubaiHotelSky)" />
        <circle cx="128" cy="24" r="14" fill="#7fdcff" opacity="0.5" />
        <rect x="18" y="46" width="18" height="54" fill="#0a1130" />
        <rect x="40" y="30" width="22" height="70" rx="3" fill="#12224f" />
        <rect x="66" y="54" width="16" height="46" fill="#0a1130" />
        <g fill="#7fdcff" opacity="0.55">
          <rect x="45" y="36" width="4" height="4" /><rect x="53" y="36" width="4" height="4" />
          <rect x="45" y="46" width="4" height="4" /><rect x="53" y="46" width="4" height="4" />
          <rect x="45" y="56" width="4" height="4" /><rect x="53" y="56" width="4" height="4" />
          <rect x="45" y="66" width="4" height="4" /><rect x="53" y="66" width="4" height="4" />
        </g>
        <rect x="0" y="92" width="160" height="8" fill="#0a1130" />
      </svg>`,
    },
    {
      title: "Beach Residence",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="dubaiBeachSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#7fdcff" /><stop offset="1" stop-color="#34b8f0" />
        </linearGradient></defs>
        <rect width="160" height="60" fill="url(#dubaiBeachSky)" />
        <rect y="60" width="160" height="16" fill="#1c3fa8" />
        <rect y="76" width="160" height="24" fill="#e8cf9c" />
        <circle cx="24" cy="18" r="10" fill="#fff" opacity="0.85" />
        <path d="M120 76V38" stroke="#1c3fa8" stroke-width="4" stroke-linecap="round" />
        <path d="M120 40c0-10 10-14 22-12-4 10-12 14-22 12Z" fill="#101d54" />
        <path d="M120 40c0-10-10-14-22-12 4 10 12 14 22 12Z" fill="#101d54" />
        <rect x="96" y="80" width="30" height="14" rx="4" fill="#ffffff" />
        <rect x="100" y="70" width="10" height="10" fill="#0a1130" opacity="0.5" />
      </svg>`,
    },
    {
      title: "Amusement Park",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="dubaiParkSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#101d54" /><stop offset="1" stop-color="#1c3fa8" />
        </linearGradient></defs>
        <rect width="160" height="100" fill="url(#dubaiParkSky)" />
        <circle cx="80" cy="46" r="30" fill="none" stroke="#7fdcff" stroke-width="3" />
        <circle cx="80" cy="46" r="4" fill="#7fdcff" />
        <g stroke="#7fdcff" stroke-width="1.6">
          <line x1="80" y1="16" x2="80" y2="76" /><line x1="50" y1="46" x2="110" y2="46" />
          <line x1="59" y1="25" x2="101" y2="67" /><line x1="59" y1="67" x2="101" y2="25" />
        </g>
        <circle cx="80" cy="16" r="3.4" fill="#34b8f0" /><circle cx="80" cy="76" r="3.4" fill="#34b8f0" />
        <circle cx="50" cy="46" r="3.4" fill="#34b8f0" /><circle cx="110" cy="46" r="3.4" fill="#34b8f0" />
        <rect x="0" y="90" width="160" height="10" fill="#0a1130" />
      </svg>`,
    },
  ],

  "classic-london": [
    {
      title: "Iconic Landmark",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="londonLandmarkSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#5b7bb8" /><stop offset="1" stop-color="#101d54" />
        </linearGradient></defs>
        <rect width="160" height="100" fill="url(#londonLandmarkSky)" />
        <rect x="66" y="20" width="28" height="70" rx="2" fill="#0a1130" />
        <path d="M66 20 80 6 94 20Z" fill="#12224f" />
        <circle cx="80" cy="36" r="8" fill="none" stroke="#7fdcff" stroke-width="2.4" />
        <line x1="80" y1="36" x2="80" y2="31" stroke="#7fdcff" stroke-width="1.6" />
        <line x1="80" y1="36" x2="84" y2="36" stroke="#7fdcff" stroke-width="1.6" />
        <rect x="0" y="90" width="160" height="10" fill="#0a1130" />
        <path d="M0 90c20-6 40 6 60 0s40-6 60 0 40-6 40-6V90Z" fill="#1c3fa8" opacity="0.6" />
      </svg>`,
    },
    {
      title: "Museum Quarter",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="londonMuseumSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#7891c9" /><stop offset="1" stop-color="#1c3fa8" />
        </linearGradient></defs>
        <rect width="160" height="100" fill="url(#londonMuseumSky)" />
        <rect x="30" y="46" width="100" height="8" fill="#0a1130" />
        <path d="M26 46 80 20 134 46Z" fill="#12224f" />
        <g fill="#e8e4da">
          <rect x="38" y="54" width="8" height="30" /><rect x="54" y="54" width="8" height="30" />
          <rect x="70" y="54" width="8" height="30" /><rect x="86" y="54" width="8" height="30" />
          <rect x="102" y="54" width="8" height="30" /><rect x="118" y="54" width="8" height="30" />
        </g>
        <rect x="26" y="84" width="108" height="8" fill="#0a1130" />
        <rect x="16" y="92" width="128" height="8" fill="#0a1130" />
      </svg>`,
    },
    {
      title: "Street Market",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="londonMarketSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6b86c4" /><stop offset="1" stop-color="#12224f" />
        </linearGradient></defs>
        <rect width="160" height="100" fill="url(#londonMarketSky)" />
        <g>
          <path d="M14 40h30l-4 14H18Z" fill="#7fdcff" />
          <path d="M50 40h30l-4 14H54Z" fill="#34b8f0" />
          <path d="M86 40h30l-4 14H90Z" fill="#7fdcff" />
          <path d="M122 40h26l-4 14h-22Z" fill="#34b8f0" />
        </g>
        <g fill="#0a1130">
          <rect x="16" y="54" width="26" height="36" /><rect x="52" y="54" width="26" height="36" />
          <rect x="88" y="54" width="26" height="36" /><rect x="122" y="54" width="24" height="36" />
        </g>
        <g fill="#f2c98f" opacity="0.9">
          <circle cx="24" cy="60" r="2.2" /><circle cx="30" cy="60" r="2.2" /><circle cx="36" cy="60" r="2.2" />
          <circle cx="96" cy="60" r="2.2" /><circle cx="102" cy="60" r="2.2" /><circle cx="108" cy="60" r="2.2" />
        </g>
      </svg>`,
    },
  ],

  "east-africa-safari": [
    {
      title: "Savanna Lodge",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="safariLodgeSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f2b155" /><stop offset="1" stop-color="#1c3fa8" />
        </linearGradient></defs>
        <rect width="160" height="70" fill="url(#safariLodgeSky)" />
        <circle cx="34" cy="30" r="14" fill="#ffe1a8" opacity="0.85" />
        <rect y="70" width="160" height="30" fill="#7a5a2f" />
        <path d="M100 70V44l24 12v14Z" fill="#5a3f22" />
        <path d="M96 46l28 6-4 6-24-6Z" fill="#0a1130" />
        <rect x="106" y="76" width="8" height="10" fill="#12224f" />
        <path d="M0 70c14-16 26-16 40-16s26 0 40 16Z" fill="#101d54" opacity="0.5" />
      </svg>`,
    },
    {
      title: "Game Drive",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="safariDriveSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f2b155" /><stop offset="1" stop-color="#2f6fe0" />
        </linearGradient></defs>
        <rect width="160" height="70" fill="url(#safariDriveSky)" />
        <rect y="70" width="160" height="30" fill="#8a6a3a" />
        <rect x="52" y="46" width="46" height="18" rx="3" fill="#101d54" />
        <rect x="58" y="34" width="24" height="14" rx="2" fill="#12224f" />
        <circle cx="64" cy="66" r="7" fill="#0a1130" /><circle cx="88" cy="66" r="7" fill="#0a1130" />
        <circle cx="64" cy="66" r="3" fill="#7fdcff" /><circle cx="88" cy="66" r="3" fill="#7fdcff" />
        <path d="M20 62c10-2 18-2 26 0M14 70c12-2 20-2 30 0" stroke="#e8cf9c" stroke-width="2" fill="none" opacity="0.7" />
      </svg>`,
    },
    {
      title: "Wildlife Watch",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="safariWildlifeSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f2b155" /><stop offset="1" stop-color="#1c3fa8" />
        </linearGradient></defs>
        <rect width="160" height="70" fill="url(#safariWildlifeSky)" />
        <rect y="70" width="160" height="30" fill="#7a5a2f" />
        <path d="M56 70V44c0-6 4-10 8-10s6 4 6 8v-4c0-4 4-8 8-8s8 4 8 9c4-2 8 1 8 6l-2 25Z" fill="#101d54" opacity="0.85" />
        <g fill="#5a3f22"><rect x="106" y="66" width="4" height="16" /><rect x="116" y="66" width="4" height="16" /></g>
        <path d="M20 78c6-8 14-8 20 0" stroke="#0a1130" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
      </svg>`,
    },
  ],

  "complete-umrah-package": [
    {
      title: "The Haram",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="umrahHaramSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1c3fa8" /><stop offset="1" stop-color="#0a1130" />
        </linearGradient></defs>
        <rect width="160" height="100" fill="url(#umrahHaramSky)" />
        <path d="M118 32a8 8 0 1 0 10 6 10 10 0 0 1-10-6Z" fill="#f2e7c9" opacity="0.9" />
        <rect x="66" y="52" width="28" height="38" fill="#101d54" />
        <path d="M66 52a14 14 0 0 1 28 0Z" fill="#12224f" />
        <circle cx="80" cy="34" r="3" fill="#7fdcff" />
        <rect x="30" y="40" width="8" height="50" fill="#101d54" />
        <path d="M30 40a4 4 0 0 1 8 0Z" fill="#7fdcff" />
        <rect x="122" y="40" width="8" height="50" fill="#101d54" />
        <path d="M122 40a4 4 0 0 1 8 0Z" fill="#7fdcff" />
        <rect x="0" y="90" width="160" height="10" fill="#0a1130" />
      </svg>`,
    },
    {
      title: "Nearby Hotel",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="umrahHotelSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2f6fe0" /><stop offset="1" stop-color="#101d54" />
        </linearGradient></defs>
        <rect width="160" height="100" fill="url(#umrahHotelSky)" />
        <rect x="46" y="24" width="68" height="66" rx="3" fill="#12224f" />
        <path d="M46 24a34 34 0 0 1 68 0Z" fill="#0a1130" />
        <g fill="#7fdcff" opacity="0.55">
          <rect x="54" y="36" width="6" height="6" /><rect x="66" y="36" width="6" height="6" />
          <rect x="78" y="36" width="6" height="6" /><rect x="90" y="36" width="6" height="6" /><rect x="102" y="36" width="6" height="6" />
          <rect x="54" y="50" width="6" height="6" /><rect x="66" y="50" width="6" height="6" />
          <rect x="78" y="50" width="6" height="6" /><rect x="90" y="50" width="6" height="6" /><rect x="102" y="50" width="6" height="6" />
          <rect x="54" y="64" width="6" height="6" /><rect x="66" y="64" width="6" height="6" />
          <rect x="78" y="64" width="6" height="6" /><rect x="90" y="64" width="6" height="6" /><rect x="102" y="64" width="6" height="6" />
        </g>
        <rect x="72" y="76" width="16" height="14" fill="#0a1130" />
        <rect x="0" y="90" width="160" height="10" fill="#0a1130" />
      </svg>`,
    },
    {
      title: "Airport Transfer",
      svg: `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="umrahTransferSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#7fdcff" /><stop offset="1" stop-color="#1c3fa8" />
        </linearGradient></defs>
        <rect width="160" height="100" fill="url(#umrahTransferSky)" />
        <g transform="translate(52,30) scale(2.2)">
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5z" fill="#0a1130" />
        </g>
        <path d="M20 78c30-10 90-10 120 0" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.5" stroke-dasharray="6 6" />
        <rect x="0" y="90" width="160" height="10" fill="#0a1130" />
      </svg>`,
    },
  ],
};
