# Architecture & Integration Notes

- Client-only MVP using React + TF.js for CV. Keep heavy models behind an API if necessary.
- Onboarding:
  - Use MediaDevices.getUserMedia() for webcam capture.
  - Pixel-art generation: call Hugging Face inference endpoint for the pixel-art-xl model OR run locally via an API.
- Messages App:
  - Use Anthropic API for chat with persona system prompts.
  - Store conversation in localStorage (migrate to backend later).
  - Use Web Speech API for voice input & speechSynthesis for voice output.
- Games:
  - Rock Paper Scissors: run YOLO/RPS detection with TF.js or run inference via Hugging Face space.
  - Scavenger hunt: object detection via COCO-SSD or MobileNet in TF.js.
- Model notes:
  - Facial detection (Caffe model) can be used for face bounding boxes; it may be heavier to load client-side.
  - For pixel-art avatar generation, prefer calling an API that wraps the Hugging Face model to avoid shipping large weights in the client.

Security & privacy
- Ask for camera permission only when needed.
- Do not upload user images without consent. If using remote APIs, explain data usage in privacy policy.

Deployment
- Static site deploy: Vercel / Netlify / GitHub Pages