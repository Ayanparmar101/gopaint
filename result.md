<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Painterly Play - Results</title>
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
                      "body-lg": [
                              "Quicksand"
                      ],
                      "label-bold": [
                              "Quicksand"
                      ],
                      "display-lg": [
                              "Quicksand"
                      ],
                      "headline-md": [
                              "Quicksand"
                      ],
                      "body-md": [
                              "Quicksand"
                      ],
                      "display-lg-mobile": [
                              "Quicksand"
                      ]
              },
              "fontSize": {
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "1.6",
                                      "fontWeight": "500"
                              }
                      ],
                      "label-bold": [
                              "14px",
                              {
                                      "lineHeight": "1.2",
                                      "fontWeight": "700"
                              }
                      ],
                      "display-lg": [
                              "48px",
                              {
                                      "lineHeight": "1.2",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "700"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "1.3",
                                      "fontWeight": "700"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "1.6",
                                      "fontWeight": "500"
                              }
                      ],
                      "display-lg-mobile": [
                              "32px",
                              {
                                      "lineHeight": "1.2",
                                      "fontWeight": "700"
                              }
                      ]
              }
      },
          },
        }
      </script>
<style>
        body { font-family: 'Quicksand', sans-serif; background-color: theme('colors.background'); }
        
        .bubbly-btn {
            position: relative;
            transition: all 0.1s ease;
            box-shadow: 0 4px 0 0 rgba(0,0,0,0.15);
        }
        .bubbly-btn:active {
            transform: translateY(4px);
            box-shadow: 0 0 0 0 rgba(0,0,0,0);
        }

        .confetti-piece {
            position: absolute;
            width: 10px;
            height: 20px;
            background-color: #fdd73b;
            opacity: 0;
            animation: fall linear infinite;
        }

        @keyframes fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0.2; }
        }

        .podium-shadow {
            box-shadow: inset 0 -10px 20px rgba(0,0,0,0.05);
        }
    </style>
</head>
<body class="text-on-background min-h-screen relative overflow-x-hidden pt-24 pb-32">
<!-- Confetti Container -->
<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden" id="confetti-container"></div>
<!-- Main Content Canvas -->
<main class="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex flex-col items-center">
<!-- Header -->
<header class="text-center mb-12 animate-fade-in-down">
<h1 class="font-display-lg text-display-lg text-primary drop-shadow-md mb-2">Results</h1>
<p class="font-headline-md text-headline-md text-on-surface-variant">Awesome job, everyone!</p>
</header>
<!-- Podium Section -->
<div class="relative w-full max-w-2xl h-80 mb-16 flex items-end justify-center gap-4 px-4">
<!-- 2nd Place -->
<div class="flex flex-col items-center justify-end w-1/3 relative group animate-[bounce_2s_ease-in-out_infinite] animation-delay-100">
<div class="absolute -top-24 flex flex-col items-center">
<div class="w-20 h-20 rounded-full border-4 border-surface-container-lowest bg-surface-variant overflow-hidden shadow-lg mb-2 z-10 group-hover:scale-110 transition-transform">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A cute, colorful 3D rendered avatar of a joyful character with big eyes, suitable for a kids multiplayer game. Tactile plastic toy aesthetic, bright pastel colors, soft studio lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr6atDURopRnfvKDQ3QxzqBXWFUoGcrCGY9ITAe1ug0dHrX_ocM7Zg8jlXFpupVT0inB5MgeoNpLZ3xVYrPlMzxHaC1CMbH9oa-fkr_BkWAMX6_twc4lttRo-zTpdoI1FkIA-47X_0hzh8G6sMujk6EK2Jdh6304BmE5y2IXlx41-fyGANkRAyd3rb3Nv3rVijJCjj2btoPuXmtXhZJcrJjlcZQ-zB3xJrXcjexJ7IoIDzG5tFMBAmAUgdzGj3e9df89Wfs67rBmI"/>
</div>
<div class="bg-surface-container-lowest rounded-full px-3 py-1 shadow-sm font-label-bold text-label-bold text-on-surface-variant border border-outline-variant">
                        Sammy
                    </div>
<div class="font-body-lg text-body-lg text-secondary mt-1">94/100</div>
</div>
<div class="w-full h-32 bg-primary-fixed rounded-t-lg podium-shadow border-t-2 border-primary-fixed-dim relative flex items-center justify-center">
<span class="font-display-lg text-display-lg text-primary-container drop-shadow-sm font-bold">2</span>
</div>
</div>
<!-- 1st Place -->
<div class="flex flex-col items-center justify-end w-1/3 relative group z-20 animate-[bounce_2s_ease-in-out_infinite]">
<div class="absolute -top-32 flex flex-col items-center">
<div class="relative">
<span class="material-symbols-outlined absolute -top-8 left-1/2 -translate-x-1/2 text-secondary text-5xl animate-pulse" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
<div class="w-24 h-24 rounded-full border-4 border-secondary-container bg-surface-variant overflow-hidden shadow-xl mb-2 z-10 group-hover:scale-110 transition-transform">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A cute, colorful 3D rendered avatar of a joyful character with big eyes, wearing a tiny crown, suitable for a kids multiplayer game. Tactile plastic toy aesthetic, bright pastel colors, soft studio lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYxo2VdcfeYMm7Sg-6iHTr4W3VpkeF6DglPpp5vcb3NBbEM5c49cGnpUfYUYrjXfSxj9jh3eFarwzm8Ah0SEtihX2dudLwiclow2URCYUmFvsHYD3Aw2VPTkANrLjpQFYjnwoYVglHXgDoX5Kq3b1ftsgvnkAhT17mjnsko8AU30bb1CkL2hZGawQsvHc8M3iHARchRvI28GYBRRE7tr8hYCNcX7nCQE16TXMIyyrhKw-Vf-tq_7BJ115IJHp3rYi4m-fC1aSlwxM"/>
</div>
</div>
<div class="bg-surface-container-lowest rounded-full px-4 py-1.5 shadow-md font-label-bold text-label-bold text-secondary border-2 border-secondary-container">
                        Alex
                    </div>
<div class="font-body-lg text-body-lg text-secondary font-bold mt-1">98/100</div>
</div>
<div class="w-full h-44 bg-secondary-fixed rounded-t-lg podium-shadow border-t-2 border-secondary relative flex items-center justify-center">
<span class="font-display-lg text-display-lg text-secondary-container drop-shadow-sm font-bold">1</span>
</div>
</div>
<!-- 3rd Place -->
<div class="flex flex-col items-center justify-end w-1/3 relative group animate-[bounce_2s_ease-in-out_infinite] animation-delay-200">
<div class="absolute -top-20 flex flex-col items-center">
<div class="w-16 h-16 rounded-full border-4 border-surface-container-lowest bg-surface-variant overflow-hidden shadow-md mb-2 z-10 group-hover:scale-110 transition-transform">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A cute, colorful 3D rendered avatar of a joyful character with big eyes, suitable for a kids multiplayer game. Tactile plastic toy aesthetic, bright pastel colors, soft studio lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoQTGDGq96vZ2brHi0u3u3rxqHqP59KPXi4NowNRblLvuXqFuq4VGvqNT6a2xHUOuQurBZlOxzANXMG93TkRTDNJV3jkMdXxf8DKypGPQHjBzSxxTDuQf1pBwP64G_lINym7eAyqeEaeC2OwrSUYM_dUeVD2fGJEXT_hKfu6q02R96dI5PuMNVKkYTVH_yF_VyE6j1yTOhCj8Nm43LOtkAjbBg47MPR98AcKbMFS3yF5S9GSFv8f9WKyFqg6TfhnuyYqzJAsSqYNU"/>
</div>
<div class="bg-surface-container-lowest rounded-full px-3 py-1 shadow-sm font-label-bold text-label-bold text-on-surface-variant border border-outline-variant">
                        Jordan
                    </div>
<div class="font-body-md text-body-md text-secondary mt-1">89/100</div>
</div>
<div class="w-full h-24 bg-tertiary-fixed rounded-t-lg podium-shadow border-t-2 border-tertiary-fixed-dim relative flex items-center justify-center">
<span class="font-display-lg text-display-lg text-tertiary-container drop-shadow-sm font-bold">3</span>
</div>
</div>
</div>
<!-- Call to Action Buttons -->
<div class="flex flex-col sm:flex-row gap-6 mb-16 w-full max-w-md justify-center">
<button class="bubbly-btn bg-primary text-on-primary font-headline-md text-headline-md py-4 px-8 rounded-full flex-1 border-b-4 border-on-primary-container">
                Play Again
            </button>
<button class="bubbly-btn bg-surface-container-lowest text-primary font-headline-md text-headline-md py-4 px-8 rounded-full flex-1 border-2 border-primary border-b-4">
                Go to Lobby
            </button>
</div>
<!-- Leaderboard List -->
<div class="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-outline-variant overflow-hidden">
<div class="p-4 bg-surface-container-high border-b border-outline-variant flex justify-between items-center">
<h3 class="font-headline-md text-headline-md text-on-surface">All Players</h3>
<span class="material-symbols-outlined text-primary">groups</span>
</div>
<ul class="divide-y divide-surface-variant">
<li class="flex items-center justify-between p-4 hover:bg-surface-container-lowest transition-colors">
<div class="flex items-center gap-4">
<span class="font-label-bold text-label-bold text-on-surface-variant w-6">4.</span>
<div class="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A cute small 3D rendered avatar icon of a character, soft lighting, vibrant colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVzstQDBrk5GaB7WSC1Gr-Bd9LKUdpaCvNT5cKhd8b_ff_QF1DfuqIZuYabT3XACi9YFpwT025FycxF37VAvnrz9rpXy3siGgapA8UJX444E9T6Ej9mkQdPGcp6XkG1unq6zHBNcerzyCYqVpfCa4C4ZPZUcyOBMFXv4WNrvFxLY_2A7RA9fGTZ4OEsQZBVdTc3IjqEjwdaeP8_6Ti_4zOXbaxYCtCTUZCzL4vGbJ2xQPsLQzd_AbvZPvhwic7_LUz2w9jfFbpbEQ"/>
</div>
<span class="font-body-lg text-body-lg text-on-surface">Taylor</span>
</div>
<span class="font-label-bold text-label-bold text-primary bg-primary-container text-on-primary-container px-3 py-1 rounded-full">85/100</span>
</li>
<li class="flex items-center justify-between p-4 hover:bg-surface-container-lowest transition-colors">
<div class="flex items-center gap-4">
<span class="font-label-bold text-label-bold text-on-surface-variant w-6">5.</span>
<div class="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A cute small 3D rendered avatar icon of a character, soft lighting, vibrant colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjbdMcpW08qv9H6-28vJtsUTQPg6b3wBL2hnEIDjzvlLEtOrOCI1vQPomWcZOgxf5uUPzCSNLQ5Gge6750YriGA8bwComPRK2PESfhMMpdvo-B-HUlSBgpvj2gdA7EuGT_3EnQVOm0zcpJux2bPZkDetNDEmojLc3XbkAUN9A1Dt0MVTNxGFeV2pNYT-RoQKLXEir-oM6QovX51mzi-EPlp2VtA_rdUnYPKiEuCM_OzibKChorh3LEVXEVf5FVgGNCoIYpUDSh-Pg"/>
</div>
<span class="font-body-lg text-body-lg text-on-surface">Casey</span>
</div>
<span class="font-label-bold text-label-bold text-primary bg-primary-container text-on-primary-container px-3 py-1 rounded-full">78/100</span>
</li>
<li class="flex items-center justify-between p-4 hover:bg-surface-container-lowest transition-colors">
<div class="flex items-center gap-4">
<span class="font-label-bold text-label-bold text-on-surface-variant w-6">6.</span>
<div class="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
<img alt="Avatar" class="w-full h-full object-cover" data-alt="A cute small 3D rendered avatar icon of a character, soft lighting, vibrant colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbfgalfncOOC0ZnfiJpqPIfLLh3N0Jn52k4E22vZNIUKcl800i1EaiAwQ6MZKikej-S5a9eg0XcRJdVZ4c5KMolYC4XpThcYXmw6i4u3XBrgrwqNQ_BLRu271G1d_OUgYJP7heytAaz4r4IQVReXAtycxqIYWRQ4sCStWYmq0rIQXu7f7zEkqXzvLvjBTsoIMGG1xO1J2M-QWpGku2eGn61X5Ayp231ADijvukISJw1Pdi_6g5u1-Tvbd998fl4IhNKjIS0ceprMg"/>
</div>
<span class="font-body-lg text-body-lg text-on-surface">Riley</span>
</div>
<span class="font-label-bold text-label-bold text-primary bg-primary-container text-on-primary-container px-3 py-1 rounded-full">72/100</span>
</li>
</ul>
</div>
</main>
<script>
        // Simple confetti effect
        const colors = ['#58a6ff', '#ff7a78', '#fdd73b', '#a2c9ff'];
        const container = document.getElementById('confetti-container');

        function createConfetti() {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            // Randomly pick shape (rectangle or circle)
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
                confetti.style.width = '15px';
                confetti.style.height = '15px';
            }

            container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }

        // Generate initial batch
        for(let i=0; i<50; i++) {
            createConfetti();
        }

        // Keep generating
        setInterval(createConfetti, 200);
    </script>
</body></html>