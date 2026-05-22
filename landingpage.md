<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Painterly Play - Join Game</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
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
                        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "500" }],
                        "label-bold": ["14px", { "lineHeight": "1.2", "fontWeight": "700" }],
                        "display-lg": ["48px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "700" }],
                        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "500" }],
                        "display-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "700" }]
                    }
                }
            }
        }
    </script>
<style>
        body {
            background-color: theme('colors.surface');
            background-image: radial-gradient(theme('colors.surface-container-highest') 2px, transparent 2px);
            background-size: 30px 30px;
        }
        
        .bubbly-button {
            border-bottom: 4px solid theme('colors.on-primary-container');
            text-shadow: 1px 1px 0px rgba(0,0,0,0.2);
            transition: all 0.1s ease-in-out;
        }
        .bubbly-button:active {
            border-bottom-width: 0px;
            transform: translateY(4px);
        }
        
        .avatar-overlap {
            border: 4px solid theme('colors.surface-container-lowest');
        }
    </style>
</head>
<body class="min-h-screen text-on-surface font-body-lg flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop overflow-hidden relative">
<div class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface-container-lowest shadow-[0_4px_0_0_rgba(0,0,0,0.05)] border-b-2 border-outline-variant shadow-sm">
<div class="font-display-lg-mobile text-display-lg-mobile text-primary flex items-center gap-sm">
<span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">palette</span>
            Painterly Play
        </div>
<div class="flex items-center gap-md hidden"></div>
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-primary text-3xl cursor-pointer hover:bg-surface-container-high transition-colors p-2 rounded-full">group</span>
<span class="material-symbols-outlined text-primary text-3xl cursor-pointer hover:bg-surface-container-high transition-colors p-2 rounded-full">qr_code_2</span>
<span class="material-symbols-outlined text-primary text-3xl cursor-pointer hover:bg-surface-container-high transition-colors p-2 rounded-full">settings</span>
</div>
</div>
<!-- Main Content Canvas -->
<main class="w-full max-w-4xl mt-20 grid grid-cols-1 md:grid-cols-2 gap-lg items-center relative z-10">
<!-- Join Form Side -->
<div class="bg-surface-container-lowest rounded-xl p-lg shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col gap-md relative">
<h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-sm">Ready to Paint?</h1>
<div class="flex flex-col gap-base">
<label class="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider" for="playerName">Your Artist Name</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">brush</span>
<input class="w-full bg-surface-container-low border-2 border-outline-variant rounded-lg py-4 pl-12 pr-4 text-headline-md font-headline-md text-on-surface focus:outline-none focus:border-4 focus:border-primary focus:bg-surface-container-lowest transition-all shadow-inner" id="playerName" placeholder="Enter Your Name" type="text"/>
</div>
</div>
<div class="flex flex-col gap-base mt-sm">
<label class="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider" for="roomCode">Room Code (Optional)</label>
<input class="w-full bg-surface-container-low border-2 border-outline-variant rounded-lg py-3 px-4 text-body-lg font-body-lg text-on-surface focus:outline-none focus:border-4 focus:border-primary focus:bg-surface-container-lowest transition-all shadow-inner" id="roomCode" placeholder="e.g. ART-123" type="text"/>
</div>
<button class="bubbly-button mt-md w-full bg-primary text-on-primary font-headline-md text-headline-md py-4 rounded-full shadow-md flex justify-center items-center gap-sm">
                JOIN GAME
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
</button>
</div>
<!-- Lobby Status Side -->
<div class="flex flex-col items-center md:items-start gap-md">
<div class="bg-surface-container-high rounded-xl p-md shadow-sm w-full">
<h2 class="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-base">
<span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>
                    Friends in Lobby
                </h2>
<div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-sm">
<!-- Avatars -->
<div class="flex flex-col items-center gap-xs">
<div class="w-16 h-16 rounded-full avatar-overlap bg-tertiary-container flex items-center justify-center overflow-hidden shadow-sm">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A brightly colored cartoon-style avatar of a cute, fluffy animal character smiling. Designed for a children's game interface, featuring soft, tactile lighting and a solid vibrant background. The aesthetic is playful, high-contrast, and soft like clay." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJo0xIJjrDrXR3j_snS6lcTdonFxAHOVxDTownOrAbEePtIre6pHMuhW_p-FpZ4qF54zEV18mLXuaq9Jt6G3gm-AhtZAI05kgl_YHdmCJIAvZ4HMtnD1hdXU4mJnbmn_6VjE-c6vbqei7_JKPOm4mXgJYse7ZCNTbwDQB053R9vmtQYibCkMhmdWJsREi4PFbJuSKfyTjqwSECn5bPe3aTd67RKm2NCJkxGGiVz89NZbLybkGS9JljyJRTvZRxxS5rDWFoL_TYd8c"/>
</div>
<span class="bg-surface-container-lowest px-2 py-1 rounded-full font-label-bold text-label-bold text-on-surface-variant text-xs shadow-sm">Leo</span>
</div>
<div class="flex flex-col items-center gap-xs">
<div class="w-16 h-16 rounded-full avatar-overlap bg-secondary-container flex items-center justify-center overflow-hidden shadow-sm">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A bubbly cartoon avatar of a friendly alien with large eyes, rendered in a 3D claymation style. The background is a bright, solid pastel yellow. The lighting is soft and ambient, fitting for a modern kids' multiplayer game UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkj3mzBw4kn86am1bYHboZ6-jNzT0NcVZhwjZtWTLncPgcD3FjByhBudw-fZAVFTwGWkepmwYYbwv_OojebiafQKW78O9wx-rpKjRl3jDkpi8nuigZ4o4W9R5414bc5rX8gizf8Y69sJJbkswNkwmIunvO71CLMi_SA3QqK30J6_V24UNMgWdHJKq4AmLsnW5If4r4Zt3iJx_FTJb5qFYuGxra7LbGmKbmq5wcJ14JPq9FeSRpX77dKLM4C96ZTQ3sObAjnmEmBHc"/>
</div>
<span class="bg-surface-container-lowest px-2 py-1 rounded-full font-label-bold text-label-bold text-on-surface-variant text-xs shadow-sm">Mia</span>
</div>
<div class="flex flex-col items-center gap-xs">
<div class="w-16 h-16 rounded-full avatar-overlap bg-primary-container flex items-center justify-center overflow-hidden shadow-sm">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A cute, stylized 3D avatar of a robot holding a tiny paintbrush, set against a vibrant light blue background. The character has a soft, plastic toy texture. The lighting is bright and cheerful, designed to feel energetic and tactile." src="https://lh3.googleusercontent.com/aida-public/AB6AXuATPvYnas5wy80Ry29qebGGGKapQ4F1JpYbNK5o97rflQpSZWZbzlj5PUxrsK01X7-gBKus_VrPsRsACRz4GpT9uH20-HAadw0S4Nw64WG8zXGG2QXm_RaicxnmSgkPfY_jgaNEy6hPWEdWO0_E8TafKfskq12Au5xi9o34povohbGd_exQRsvcCrBKMcKlOWkHAfP5DLxZbOq2G6A2X9g5R_KkSpYSDpWZmgiZzbYJnTamVRqc2UPYwVvuTlW_gjucE9TkjQkZKZg"/>
</div>
<span class="bg-surface-container-lowest px-2 py-1 rounded-full font-label-bold text-label-bold text-on-surface-variant text-xs shadow-sm">Sam</span>
</div>
<div class="flex flex-col items-center gap-xs">
<div class="w-16 h-16 rounded-full avatar-overlap bg-surface-container-highest border-dashed border-2 border-outline-variant flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-outline">add</span>
</div>
<span class="bg-transparent px-2 py-1 font-label-bold text-label-bold text-on-surface-variant text-xs">Invite</span>
</div>
</div>
<div class="mt-md bg-surface-container-lowest rounded-lg p-sm border-l-4 border-secondary flex items-start gap-sm shadow-sm">
<span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">info</span>
<p class="font-body-md text-body-md text-on-surface-variant">Waiting for host to start the game. Grab your brushes!</p>
</div>
</div>
<!-- Mascot Decoration -->
<div class="hidden md:block w-48 h-48 self-end -mr-xl mt-md">
<img alt="Mascot" class="w-full h-full object-contain drop-shadow-xl" data-alt="A large, transparent-background 3D render of a friendly, blob-like mascot character holding an oversized, colorful paintbrush. The mascot is shiny and tactile, looking like a high-quality soft vinyl toy. The lighting is bright, casting soft shadows, perfectly matching a vibrant kids' art game." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM1WDifyswqigjX8qN7XZZQdezp949N_OMrEifg1MomO-gtd4UDSueko_-OoxVMInORYSEOoHvJbx0xKAIRzEBRn62n4bAVxDgnXgQrkfMaFM24MmkL4QT5mN6hatAwR7fQ3i51bpk3XB9JJ3TTozeI3lvQhFxJvhFywsn14dsN9H_iZ2tpweb2XIWwKP4P5WyV4x9rH4zJ6Z_8HZHv7KKExfeJP-ikQkfnsmoB7xZYyFv6fp8pPPXMkUQk9zO3lhb7IHpaBPhGcg"/>
</div>
</div>
</main>
<!-- Floating Decorative Elements -->
<div class="absolute top-1/4 left-10 w-12 h-12 bg-secondary-container rounded-full opacity-50 blur-sm pointer-events-none -z-10 animate-bounce" style="animation-duration: 3s;"></div>
<div class="absolute bottom-1/4 right-20 w-16 h-16 bg-tertiary-container rounded-lg rotate-12 opacity-40 blur-[2px] pointer-events-none -z-10"></div>
<div class="absolute top-1/3 right-1/4 w-8 h-8 bg-primary-container rounded-full opacity-60 blur-sm pointer-events-none -z-10 animate-pulse"></div>
</body></html>