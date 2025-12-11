# Virtual Desktop Social AI (working title)

An interactive desktop-style web application combining computer vision, AI chat, and mini-games in a cohesive virtual social environment.

Core concept
- Retro desktop UI with draggable/resizable windows
- Onboarding (name, timezone, optional webcam pixel-art avatar)
- Messages app with character-driven AI chat (Rebecca included)
- Mini-games with computer vision elements (Rock Paper Scissors, Scavenger Hunt, Aim Trainer, Doodle Dash)

MVP priorities
- Phase 1: Desktop UI, onboarding, webcam pixel-art avatar, 1-2 AI characters, Rock Paper Scissors
- Phase 2: Voice I/O, image generation in chat, Aim Trainer, timezone-based availability
- Phase 3: Multiple characters, scavenger hunt, persistence, achievements

Tech stack (recommended)
- Frontend: React + TypeScript + Vite
- Styling: TailwindCSS
- CV & models: TensorFlow.js (client-side models), Hugging Face models (image generation, pixel art)
- AI chat: Anthropic API (or preferred LLM)
- Voice: Web Speech API
- Persistence: localStorage / IndexedDB (for MVP)

Key model & resource links
- Facial detection (Caffe): https://huggingface.co/Durraiya/res10_300x300_ssd_iter_140000_fp16.caffemodel
- Text-image: https://huggingface.co/Tongyi-MAI/Z-Image-Turbo
- Pixel art (avatar): https://huggingface.co/nerijs/pixel-art-xl
- Rock Paper Scissors model: https://huggingface.co/uisikdag/yolo-v5-rock-paper-scissors-detection
- Object detection / demos: https://huggingface.co/spaces/Xenova/object-detection-web
- Doodle dash reference: https://huggingface.co/spaces/Xenova/doodle-dash

Getting started (local)
1. Install dependencies:
   - npm install
2. Run dev server:
   - npm run dev
3. Open http://localhost:5173

Project layout & next steps
- Implement onboarding flow (name + timezone)
- Add webcam avatar pixel-art generation (client-side inference call to the pixel-art model or via an API)
- Implement Desktop UI with window management (drag/resize)
- Create Messages App with a single character (Rebecca) and a simple character prompt + Anthropic integration
- Build Rock Paper Scissors CV game using TF.js / YOLO model

Contributing
- Open issues for features/challenges
- Use branches for features and send PRs

Environment & secrets
- Add API keys as GitHub repository secrets (e.g. ANTHROPIC_API_KEY, HUGGING_FACE_API_KEY)

License: MIT