# The Curiosity Path

> A Progressive Web Application for conscious living, mindfulness, and self-realization, mixed with our community of like-minded people.

**[→ Visit Live App](https://digital-curiosity-path.vercel.app)**

---

## Overview

Curiosity Path is a solo-developed digital companion that blends timeless wisdom practices with modern technology - combining AI, gamification, immersive community spaces, and multi-modal self-analysis into a single, cohesive platform for inner development.

---

## Features

### 🌿 Mindfulness & Emotional Wellness
- Energy tracking and daily reflection
- Gratitude and affirmations systems
- Journaling environment
- Meditation support
- Happiness cultivation and self-inquiry tools
- Daily inspirational guidance

### 🔮 Transformative Spiritual Tools
- **TarotVisionAI** - AI-enhanced tarot interpretation
- **ShadowAlchemyLab** - Jungian archetype exploration and guided shadow work
- **SelfAnalysisPro** - Multi-modal analysis integrating astrology, numerology, and tarot, with professional PDF report generation

### 🌐 Community Hub
Immersive virtual gathering spaces organized by lunar cycles, solar seasons, and specialized practice themes - including Breathwork, Reiki, OSHO, Campfire, Silent Meditation, Chakra Work, and more.

### ⚙️ Platform Foundations
- Conversational AI chatbot guidance
- Karma economy and reward system (Karma Shop)
- Narrative reframing tool (FlipTheScript)
- Sophisticated gamification and progress architecture
- Dark mode, fully responsive UI
- PWA support - installable on any device

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| Build Tooling | Vite |
| Auth & Database | Supabase (PostgreSQL + Google OAuth) |
| Deployment | Vercel |
| AI | Groq API (chat, tarot interpretation) |
| PWA | Service Worker + Web App Manifest |

---

## Project Structure

```
src/
├── Core/          # App state, auth, navigation, DB, gamification
├── Features/      # Journaling, tarot, energy tracking, affirmations, etc.
├── Mini-Apps/
│   ├── CommunityHub/     # Virtual rooms (Lunar, Solar, specialized)
│   ├── SelfAnalysisPro/  # Astrology, numerology, tarot, PDF reports
│   ├── ShadowAlchemyLab/ # Shadow work framework
│   └── FlipTheScript/    # Narrative reframing tool
├── styles/        # Main, mobile, dark mode, themed skins
api/               # Vercel serverless functions (chat, astro, tarot, etc.)
public/            # Static assets, PWA manifest, icons
```

---

## Getting Started

```bash
git clone https://github.com/lironkerem/curiosity-path.git
cd curiosity-path
npm install
npm run dev
```

> **Requirements:** Node.js 18+, a Supabase project, and relevant API keys (Groq, astro proxy). Configure via `.env`.

---

## About

Curiosity Path is a solo passion project by **Liron Kerem**, built to provide a thoughtful digital space for individuals committed to conscious evolution and self-discovery.

---

## License

© 2026 Liron Kerem. All rights reserved.  
This project is not open source and is not intended for redistribution or commercial use.