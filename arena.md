<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Main Game Arena - Painterly Play</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
        body { font-family: 'Quicksand', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        
        /* Tactile Button Lift */
        .btn-bubbly {
            box-shadow: 0 4px 0 0 rgba(0,0,0,0.1);
            transition: all 0.1s ease;
        }
        .btn-bubbly:active {
            transform: translateY(4px);
            box-shadow: 0 0 0 0 rgba(0,0,0,0);
        }
        
        /* Recessed Canvas */
        .recessed-inner {
            box-shadow: inset 0 8px 16px rgba(0,0,0,0.06);
        }

        /* Ticking animation for clock */
        @keyframes subtle-tick {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05) rotate(2deg); }
        }
        .animate-tick {
            animation: subtle-tick 1s ease-in-out infinite;
        }
        
        /* Polka dot pattern for background */
        .bg-polka {
            background-image: radial-gradient(var(--tw-colors-surface-variant) 2px, transparent 2px);
            background-size: 20px 20px;
        }
    </style>
</head>
<body class="bg-background text-on-background h-screen w-screen overflow-hidden flex flex-col font-body-md text-body-md">
<!-- TopAppBar (JSON Sourced) -->
<header class="bg-surface-container-lowest shadow-[0_4px_0_0_rgba(0,0,0,0.05)] border-b-2 border-outline-variant shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20">
<!-- Brand -->
<div class="flex-1 flex items-center">
<span class="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight">Painterly Play</span>
</div>
<!-- Central Timer (Custom Addition for Arena) -->
<div class="flex-none flex justify-center hidden sm:flex">
<div class="bg-error-container text-on-error-container rounded-full px-6 py-2 flex items-center gap-3 border-b-4 border-error shadow-sm btn-bubbly">
<span class="material-symbols-outlined icon-fill animate-tick text-[28px]">timer</span>
<span class="font-headline-md text-headline-md font-bold tracking-wider">02:45</span>
</div>
</div>
<!-- Trailing Icons -->
<div class="flex-1 flex justify-end items-center gap-4">
<button class="w-12 h-12 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors text-primary btn-bubbly bg-surface">
<span class="material-symbols-outlined text-[28px]">group</span>
</button>
<button class="w-12 h-12 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors text-primary btn-bubbly bg-surface hidden md:flex">
<span class="material-symbols-outlined text-[28px]">qr_code_2</span>
</button>
<button class="w-12 h-12 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors text-primary btn-bubbly bg-surface">
<span class="material-symbols-outlined text-[28px]">settings</span>
</button>
</div>
</header>
<!-- Desktop SideNavBar (JSON Sourced) -->
<nav class="hidden md:flex bg-surface-container-low border-r-4 border-secondary-container shadow-lg fixed left-0 top-20 h-[calc(100vh-80px)] w-24 flex-col items-center py-base z-40">
<!-- Header Avatar (JSON) -->
<div class="mb-6 mt-4 flex flex-col items-center group cursor-pointer">
<div class="w-16 h-16 rounded-full border-4 border-white shadow-md bg-tertiary-container overflow-hidden flex items-center justify-center btn-bubbly">
<img alt="Current Player Avatar" class="w-full h-full object-cover" data-alt="A brightly colored, stylized 3D avatar headshot of a cartoon character with a big smile, wearing colorful playful accessories. The avatar sits against a soft pastel pink background, lit by even, bright studio lighting that accentuates the smooth, tactile, toy-like textures. The aesthetic is cheerful, child-friendly, and energetic, fitting a modern creative game interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV61viLcWIriywWYk-rP8K7GjxYvir5HQyEcjev6VfSolBk4hMS8iV1_9nlpZ0ul3nt1Udl1D81gfvqkViTA_q4qhFUXMFz6_YXh2L7B4XUFBUI71f6TMpPzYQyObvARYATKstlLYeW1DS77EYEY2mWJRO69EI6m20mbTA1ArGfscV4e45xJU-1vAkW7KgQ3ZLdg_0WDvrN7ZfSVbju74CD-29ZdZBzkyOuuJtoaexzBqHH3L5Cdx3n35R1VfbUSbh2Z_1hOVrOSM"/>
</div>
<div class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-24 bg-inverse-surface text-inverse-on-surface font-label-bold text-label-bold px-3 py-1 rounded-lg whitespace-nowrap z-50">
                Artist Zone<br/><span class="text-xs font-normal">Room: ART-123</span>
</div>
</div>
<div class="flex-1 flex flex-col items-center gap-6 w-full px-2">
<!-- Active Tab -->
<button class="w-full aspect-square flex flex-col items-center justify-center gap-1 bg-secondary-container text-on-secondary-container rounded-xl shadow-[0_4px_0_0_rgba(113,93,0,1)] translate-y-[-2px] active:translate-y-1 active:shadow-none transition-transform duration-100">
<span class="material-symbols-outlined icon-fill text-[32px]">brush</span>
<span class="font-label-bold text-label-bold text-[11px]">Brush</span>
</button>
<!-- Inactive Tabs -->
<button class="w-full aspect-square flex flex-col items-center justify-center gap-1 text-on-surface-variant opacity-80 hover:opacity-100 hover:bg-surface-container-high hover:scale-105 active:translate-y-1 active:shadow-none transition-transform duration-100 rounded-xl">
<span class="material-symbols-outlined text-[32px]">format_color_fill</span>
<span class="font-label-bold text-label-bold text-[11px]">Bucket</span>
</button>
<button class="w-full aspect-square flex flex-col items-center justify-center gap-1 text-on-surface-variant opacity-80 hover:opacity-100 hover:bg-surface-container-high hover:scale-105 active:translate-y-1 active:shadow-none transition-transform duration-100 rounded-xl">
<span class="material-symbols-outlined text-[32px]">ink_eraser</span>
<span class="font-label-bold text-label-bold text-[11px]">Eraser</span>
</button>
<button class="w-full aspect-square flex flex-col items-center justify-center gap-1 text-on-surface-variant opacity-80 hover:opacity-100 hover:bg-surface-container-high hover:scale-105 active:translate-y-1 active:shadow-none transition-transform duration-100 rounded-xl">
<span class="material-symbols-outlined text-[32px]">category</span>
<span class="font-label-bold text-label-bold text-[11px]">Shapes</span>
</button>
<button class="w-full aspect-square flex flex-col items-center justify-center gap-1 text-on-surface-variant opacity-80 hover:opacity-100 hover:bg-surface-container-high hover:scale-105 active:translate-y-1 active:shadow-none transition-transform duration-100 rounded-xl">
<span class="material-symbols-outlined text-[32px]">auto_awesome</span>
<span class="font-label-bold text-label-bold text-[11px]">Stickers</span>
</button>
</div>
<!-- CTA (JSON) -->
<div class="mt-auto mb-6 w-full px-2">
<button class="w-full py-3 bg-primary text-on-primary rounded-xl font-label-bold text-label-bold flex flex-col items-center justify-center btn-bubbly shadow-[0_4px_0_0_rgba(0,72,130,1)] active:shadow-none active:translate-y-1 text-center leading-tight">
<span class="material-symbols-outlined mb-1">add_box</span>
                New Canvas
            </button>
</div>
</nav>
<!-- Main Content Area -->
<main class="flex-1 flex flex-col md:flex-row mt-20 md:ml-24 pb-28 md:pb-0 relative bg-polka">
<!-- Center Arena (Split Screen) -->
<div class="flex-1 flex flex-col p-4 md:p-6 gap-6 md:mr-[320px] max-w-[1200px] mx-auto w-full h-full">
<!-- Mobile Timer (Visible only on small screens) -->
<div class="sm:hidden flex justify-center w-full mb-[-8px]">
<div class="bg-error-container text-on-error-container rounded-full px-6 py-2 flex items-center gap-2 border-b-4 border-error shadow-sm">
<span class="material-symbols-outlined icon-fill animate-tick">timer</span>
<span class="font-headline-md text-headline-md font-bold">02:45</span>
</div>
</div>
<!-- Top Half: Reference Painting -->
<div class="flex-1 min-h-[200px] max-h-[35%] bg-surface-container-lowest rounded-[2rem] border-4 border-outline-variant shadow-[0_8px_24px_rgba(0,0,0,0.08)] relative overflow-hidden flex flex-col">
<div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full border-2 border-surface-variant shadow-sm flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-secondary-fixed-dim animate-pulse"></span>
<span class="font-label-bold text-label-bold text-on-surface">Reference</span>
</div>
<!-- The actual reference image to replicate -->
<div class="w-full h-full bg-cover bg-center" data-alt="A vibrant, abstract painting featuring bold, thick brushstrokes of primary blue, sunny yellow, and energetic red on a bright white canvas. The texture of the paint is clearly visible, giving it a tactile, messy, but joyous quality. The lighting is bright and even, casting no deep shadows, emphasizing the cheerful, light-mode aesthetic perfect for a children's creative art game." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxnNqGFi1d9-HfnDUV2rlSZb-MrrWMZN8MhR2ivbghgg08ryCs-NyOqQz454YDzaUASP-pQ2KxhgVZBwzpmNC8ZB64sZh5IvDP9aw8sUY7VppUnbg4NzroqCR17I2IF8talOkzIWku_kEi6jV_GOt3soAc8z3KswKSvc8QJhWMjuoBPjizJ0i40WohM5b6eV-OB7Bjt8odD8gazQuHCpXzK0-HA4cZT0JXA6pnQlQXkFNHyUWmYwMy5QOYDJCoaQpgt8W118qJ1aA');"></div>
</div>
<!-- Bottom Half: Drawing Canvas -->
<div class="flex-[2] bg-white rounded-[2.5rem] border-8 border-primary-container shadow-[0_12px_32px_rgba(0,0,0,0.12)] relative flex flex-col recessed-inner overflow-hidden group cursor-crosshair">
<!-- Canvas Tools Overlay (Top right) -->
<div class="absolute top-4 right-4 z-10 flex gap-2">
<button class="w-12 h-12 bg-surface-container-highest text-on-surface-variant rounded-full flex items-center justify-center hover:bg-surface-variant transition-colors border-2 border-white shadow-sm btn-bubbly">
<span class="material-symbols-outlined">zoom_in</span>
</button>
<button class="w-12 h-12 bg-surface-container-highest text-on-surface-variant rounded-full flex items-center justify-center hover:bg-surface-variant transition-colors border-2 border-white shadow-sm btn-bubbly">
<span class="material-symbols-outlined">delete</span>
</button>
</div>
<!-- The "Canvas" area -->
<div class="flex-1 w-full h-full relative" style="background-image: linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px); background-size: 40px 40px;">
<!-- Simulated user drawing -->
<svg class="w-full h-full absolute inset-0 pointer-events-none" preserveaspectratio="none" viewbox="0 0 100 100">
<path d="M 20 80 Q 40 20 80 50" fill="none" stroke="#58a6ff" stroke-linecap="round" stroke-width="4"></path>
<circle cx="70" cy="40" fill="#fdd73b" r="5"></circle>
</svg>
<!-- Floating playful prompt -->
<div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-10 transition-opacity">
<span class="font-display-lg text-display-lg text-surface-variant">Draw here!</span>
</div>
</div>
</div>
</div>
<!-- Floating Leaderboard (Desktop Right Side) -->
<aside class="hidden md:flex flex-col w-[300px] h-[calc(100vh-120px)] fixed right-6 top-24 z-30 pointer-events-none">
<div class="bg-surface-container-lowest/80 backdrop-blur-xl rounded-[2rem] border-2 border-white shadow-[0_16px_40px_rgba(0,0,0,0.1)] p-5 flex flex-col h-full pointer-events-auto btn-bubbly">
<div class="flex items-center justify-between mb-6">
<h2 class="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined icon-fill text-secondary-fixed-dim text-[32px]">social_leaderboard</span>
                        Top Artists
                    </h2>
</div>
<div class="flex-1 overflow-y-auto pr-2 space-y-4">
<!-- Leaderboard Item 1 (User) -->
<div class="bg-primary-container/20 border-2 border-primary-container rounded-2xl p-3 flex flex-col gap-2 relative">
<div class="absolute -left-3 -top-3 w-8 h-8 bg-secondary-fixed-dim text-on-secondary-fixed rounded-full flex items-center justify-center font-label-bold text-label-bold border-2 border-white shadow-sm z-10">1</div>
<div class="flex items-center gap-3">
<img class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" data-alt="A brightly colored, stylized 3D avatar headshot of a cartoon character with a big smile, wearing colorful playful accessories. The avatar sits against a soft pastel pink background, lit by even, bright studio lighting that accentuates the smooth, tactile, toy-like textures. The aesthetic is cheerful, child-friendly, and energetic, fitting a modern creative game interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdl_hp8vBzUclDOE6WatzHBhnzNqEBCoWAjC38cJdsYvjHhqx216s7vrclV2Edl3SKPzCpMoK1tXsvNV1x1KY_Rnf-v8LDkprKldGvfSA5P0RnxarKJqINXb46mGpbJ2h44dtI7Jrp1Zd3u5aUdHk7pEsayXdcb1mI3kX6bjjYnlyHbBoB6SQMy3tE6dvQEEBlAJJIjBeWdFDIz4guwxUX7JOKfJ3c9HBV_RAXzQ5Y-8er0AMwV36BV_H-okM96-VZR8d8vhRBBpE"/>
<div class="flex-1">
<span class="font-label-bold text-label-bold text-on-surface block">You!</span>
<div class="w-full bg-surface-variant rounded-full h-3 mt-1 overflow-hidden border border-white/50">
<div class="bg-primary h-full rounded-full w-[85%]"></div>
</div>
</div>
<span class="font-label-bold text-label-bold text-primary">85%</span>
</div>
</div>
<!-- Leaderboard Item 2 -->
<div class="bg-surface rounded-2xl p-3 flex flex-col gap-2 border border-surface-variant hover:border-outline-variant transition-colors">
<div class="flex items-center gap-3">
<img class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" data-alt="A stylized, bubbly 3D avatar of a friendly character wearing oversized round glasses and a bright yellow beanie. The background is a soft, solid light blue. The lighting is diffuse and playful, highlighting the smooth, plastic-like texture of the character model. The overall mood is vibrant, modern, and perfectly suited for a light-mode multiplayer game UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIStIwRarN2gO5Z1nMJcJsQhOp23uoOrG4_bxMPgT6tfx_u17sjcKN2nMkBZJ69UwYj3cRcOuQ-hRNpa-qoqy3uuZsyhyFZPFKvDzraHQsj9npqFqJc6gE-NOFLRKg6nmXYk0eLtR31m-F6nAJnpTkXHA9J4DGyqotbuOT_QLkEl3p2qOk_XGeWZTjlEt-r3MNmITvoSiVnQG6B_NlO5lK6dZM5NSbRAIF1Ar8pueYzJEeyQ0e-ndSjwfwsQLvVO5S-3TzOxxHbz4"/>
<div class="flex-1">
<span class="font-label-bold text-label-bold text-on-surface-variant block">PixelPete</span>
<div class="w-full bg-surface-variant rounded-full h-3 mt-1 overflow-hidden border border-white/50">
<div class="bg-secondary-fixed-dim h-full rounded-full w-[70%]"></div>
</div>
</div>
<span class="font-label-bold text-label-bold text-on-surface-variant">70%</span>
</div>
</div>
<!-- Leaderboard Item 3 -->
<div class="bg-surface rounded-2xl p-3 flex flex-col gap-2 border border-surface-variant hover:border-outline-variant transition-colors">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-label-bold text-label-bold">
                                SG
                            </div>
<div class="flex-1">
<span class="font-label-bold text-label-bold text-on-surface-variant block">ScribbleGrrl</span>
<div class="w-full bg-surface-variant rounded-full h-3 mt-1 overflow-hidden border border-white/50">
<div class="bg-tertiary-container h-full rounded-full w-[45%]"></div>
</div>
</div>
<span class="font-label-bold text-label-bold text-on-surface-variant">45%</span>
</div>
</div>
</div>
<div class="mt-4 pt-4 border-t-2 border-surface-variant text-center">
<span class="text-xs text-on-surface-variant font-label-bold">Waiting for 2 more players...</span>
</div>
</div>
</aside>
</main>
<!-- Mobile BottomNavBar (JSON Sourced) -->
<nav class="md:hidden bg-surface-container-lowest/90 backdrop-blur-md border-t-4 border-surface-variant shadow-[0_-8px_24px_rgba(0,0,0,0.08)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-end pb-4 px-4 h-24">
<!-- Active Tab -->
<button class="flex flex-col items-center justify-center bg-tertiary-container text-on-tertiary-container rounded-full p-4 scale-110 shadow-md hover:scale-110 transition-transform active:scale-95 duration-150 mb-2 border-b-4 border-on-tertiary-container/20">
<span class="material-symbols-outlined icon-fill text-[28px]">palette</span>
<span class="font-label-bold text-label-bold text-[10px] mt-1">Colors</span>
</button>
<!-- Inactive Tabs -->
<button class="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:scale-110 transition-transform active:scale-95 duration-150 mb-1">
<span class="material-symbols-outlined text-[28px]">line_weight</span>
<span class="font-label-bold text-label-bold text-[10px] mt-1">Sizes</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:scale-110 transition-transform active:scale-95 duration-150 mb-1">
<span class="material-symbols-outlined text-[28px]">layers</span>
<span class="font-label-bold text-label-bold text-[10px] mt-1">Layers</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:scale-110 transition-transform active:scale-95 duration-150 mb-1">
<span class="material-symbols-outlined text-[28px]">undo</span>
<span class="font-label-bold text-label-bold text-[10px] mt-1">Undo</span>
</button>
</nav>
</body></html>