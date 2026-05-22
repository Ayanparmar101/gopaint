<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Scanning Masterpiece</title>
<!-- Google Fonts & Material Symbols -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Configuration -->
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-container": "#780214",
                    "on-secondary-fixed": "#221b00",
                    "on-tertiary": "#ffffff",
                    "on-primary": "#ffffff",
                    "surface-variant": "#d5e3fc",
                    "surface-container-highest": "#d5e3fc",
                    "primary-container": "#58a6ff",
                    "tertiary-container": "#ff7a78",
                    "on-secondary": "#ffffff",
                    "on-surface-variant": "#414752",
                    "on-primary-container": "#003a6b",
                    "inverse-on-surface": "#ebf1ff",
                    "primary-fixed-dim": "#a2c9ff",
                    "outline-variant": "#c0c7d4",
                    "on-tertiary-fixed-variant": "#8c1520",
                    "on-error-container": "#93000a",
                    "outline": "#717783",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "on-error": "#ffffff",
                    "secondary-fixed-dim": "#e8c426",
                    "tertiary": "#ae2f34",
                    "surface-container-high": "#dde9ff",
                    "surface": "#f8f9ff",
                    "tertiary-fixed": "#ffdad8",
                    "on-tertiary-fixed": "#410006",
                    "secondary-container": "#fdd73b",
                    "inverse-surface": "#233144",
                    "on-primary-fixed": "#001c38",
                    "on-primary-fixed-variant": "#004882",
                    "on-background": "#0e1c2e",
                    "surface-tint": "#0060aa",
                    "surface-dim": "#cddbf4",
                    "on-secondary-container": "#715d00",
                    "inverse-primary": "#a2c9ff",
                    "surface-container-low": "#eff4ff",
                    "error-container": "#ffdad6",
                    "secondary-fixed": "#ffe173",
                    "surface-container": "#e6eeff",
                    "surface-container-lowest": "#ffffff",
                    "primary": "#0060aa",
                    "background": "#f8f9ff",
                    "surface-bright": "#f8f9ff",
                    "secondary": "#705d00",
                    "error": "#ba1a1a",
                    "on-surface": "#0e1c2e",
                    "primary-fixed": "#d3e4ff",
                    "on-secondary-fixed-variant": "#554500"
            },
            "borderRadius": {
                    "DEFAULT": "1rem",
                    "lg": "2rem",
                    "xl": "3rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xs": "4px",
                    "xl": "64px",
                    "margin-mobile": "16px",
                    "lg": "40px",
                    "sm": "12px",
                    "base": "8px",
                    "gutter": "20px",
                    "md": "24px",
                    "margin-desktop": "48px"
            },
            "fontFamily": {
                    "body-lg": ["Quicksand"],
                    "label-bold": ["Quicksand"],
                    "display-lg": ["Quicksand"],
                    "headline-md": ["Quicksand"],
                    "body-md": ["Quicksand"],
                    "display-lg-mobile": ["Quicksand"]
            },
            "fontSize": {
                    "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "500"}],
                    "label-bold": ["14px", {"lineHeight": "1.2", "fontWeight": "700"}],
                    "display-lg": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "700"}],
                    "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "500"}],
                    "display-lg-mobile": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}]
            }
          }
        }
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        /* Custom Animations */
        @keyframes scanLaser {
            0% { left: -5%; }
            50% { left: 105%; }
            100% { left: -5%; }
        }
        
        .animate-scan {
            animation: scanLaser 4s ease-in-out infinite;
        }

        @keyframes blobPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
        }

        .blob-1 { animation: blobPulse 1.5s ease-in-out infinite 0s; }
        .blob-2 { animation: blobPulse 1.5s ease-in-out infinite 0.3s; }
        .blob-3 { animation: blobPulse 1.5s ease-in-out infinite 0.6s; }

        @keyframes gentleFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .animate-float {
            animation: gentleFloat 3s ease-in-out infinite;
        }
    </style>
</head>
<body class="bg-surface text-on-surface antialiased overflow-hidden min-h-screen flex flex-col relative selection:bg-primary-container selection:text-on-primary-container">
<!-- Global Nav Suppressed: This is a linear/transactional transition screen focused purely on the scanning action. -->
<main class="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop w-full h-full relative z-10">
<!-- Canvas Comparison Area -->
<div class="relative w-full max-w-5xl aspect-square md:aspect-[2/1] bg-surface-container-highest rounded-xl p-base md:p-sm shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-base md:gap-sm overflow-hidden mb-lg">
<!-- Original Art Side -->
<div class="flex-1 relative bg-surface-container-lowest rounded-lg border-4 border-surface-variant overflow-hidden shadow-inner">
<div class="absolute top-sm left-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-bold text-label-bold z-10 shadow-sm flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]">photo_library</span>
                    Original
                </div>
<div class="w-full h-full bg-cover bg-center rounded-[12px] opacity-90" data-alt="A vibrant, playful digital illustration of abstract, bubbly geometric shapes in primary red, blue, and yellow against a clean white background. High-key lighting creates a soft, welcoming atmosphere. The tactile aesthetic makes the shapes look like smooth, physical plastic toys scattered playfully on a bright canvas." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBscCKNq22zh-72BQdl5NuK4Yr6P5xopVmqmBS1OYaDdZ_PuoewI47kSi8fCZgtG3B4hrCzNO75J5Vhl0T3p8iC2rcpmgb71AmM5yvTE-baFb50NM0qGirqxW68hmDm_cm57G5Afmuadz8Wkh3_mZw6yhWrN5AfHb43WAwKzG0nXnV4LrMoOu_wGD8B30IbomEVS8AYEYkh0G8M46xz4GedjJ5sBVrDHjtNa9jaVkGQhgNm1ONQpfui3kCmqRm-PKIJrDY1GEuMM5Q');">
</div>
</div>
<!-- Kid's Drawing Side -->
<div class="flex-1 relative bg-surface-container-lowest rounded-lg border-4 border-surface-variant overflow-hidden shadow-inner">
<div class="absolute top-sm left-sm bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-bold text-label-bold z-10 shadow-sm flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]">brush</span>
                    Your Masterpiece
                </div>
<div class="w-full h-full bg-cover bg-center rounded-[12px]" data-alt="A charming, slightly messy digital recreation of abstract shapes using thick digital crayon brush strokes in bright colors on a white digital canvas. The artwork looks hand-drawn with slight, endearing imperfections, conveying immense joy and energetic creativity typical of a young artist's vibrant expression." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBlpEZC0fODelcSkPgiMe4bE2flrOePYhD4KvSarx-pR5Ls5GWMqddfPnC23hmZfwV8im4rk6LfybEQ4pHIqNWYN0wUCakk3pId-2KlIDoecN3__94U7iv_uSE6u3a8RWNZZtiPjRyKL8qVfCuM1luTtlWSYtcDJ-cgY9f-liO2zKRHTTshfOTVdRobllSH-lROhaqP8tzg6J1y2G80zBoXxqIQ8qvlWVcuybhOgjMqmM1z4aa6d-hyYinbTseMLyGhY4lF89OcWDY');">
</div>
</div>
<!-- AI Laser Scanner Overlay -->
<div class="absolute top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-transparent via-tertiary-container/80 to-transparent z-20 animate-scan pointer-events-none flex justify-center items-center backdrop-blur-[2px]">
<div class="w-[2px] h-full bg-tertiary shadow-[0_0_20px_rgba(174,47,52,1)] rounded-full"></div>
</div>
</div>
<!-- Status & Loading Indicator -->
<div class="flex flex-col items-center justify-center animate-float">
<!-- Painter Palette Loading Spinner -->
<div class="relative w-24 h-24 mb-md">
<svg class="w-full h-full drop-shadow-md" viewbox="0 0 100 100">
<!-- Palette Base -->
<path class="fill-surface-container-lowest stroke-outline-variant" d="M50,15 C25,15 10,35 10,60 C10,85 35,90 50,90 C80,90 90,75 90,50 C90,25 75,15 50,15 Z M70,70 C63,70 58,65 58,58 C58,51 63,46 70,46 C77,46 82,51 82,58 C82,65 77,70 70,70 Z" stroke-linejoin="round" stroke-width="3"></path>
<!-- Paint Blobs -->
<circle class="fill-tertiary blob-1 drop-shadow-sm origin-center" cx="25" cy="55" r="8"></circle>
<circle class="fill-primary container blob-2 drop-shadow-sm origin-center" cx="35" cy="35" r="9"></circle>
<circle class="fill-secondary blob-3 drop-shadow-sm origin-center" cx="55" cy="25" r="7"></circle>
</svg>
</div>
<!-- Loading Text -->
<h1 class="font-headline-md text-headline-md md:font-display-lg md:text-display-lg text-primary text-center">
                Checking your masterpiece...
            </h1>
<p class="mt-base font-body-md text-body-md text-on-surface-variant text-center max-w-md">
                Our AI art critic is looking at all those wonderful colors and shapes!
            </p>
</div>
</main>
<!-- Decorative Background Elements -->
<div class="absolute top-[-10%] left-[-5%] w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
<div class="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-primary-container/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
</body></html>