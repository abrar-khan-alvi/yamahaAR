# Implementation Plan: Yamaha Eid Offer AR Microsite

Building a premium Web AR experience for Yamaha Bangladesh using Next.js, Three.js (R3F), and MindAR.js.

## User Review Required

> [!IMPORTANT]
> **MindAR.js Integration**: MindAR works best with direct DOM access. I will integrate it into Next.js using a custom hook and a dedicated AR component that handles the life-cycle of the MindAR controller.
> **3D Assets**: We will need optimized `.glb` models for the Yamaha bikes. I will start with placeholder models (high-quality primitives or generic bikes) until the official Yamaha assets are available.

## Proposed Changes

### [Component Name] Project Foundation

#### [NEW] [package.json](file:///c:/Users/Alvi/Downloads/yamaha_site/package.json)
Initialize a Next.js project with the following dependencies:
- `three`: 3D Engine.
- `@react-three/fiber`: React renderer for Three.js.
- `@react-three/drei`: Helpers for R3F.
- `mind-ar`: AR framework.
- `framer-motion`: For premium UI animations (Price reveal).

### [Component Name] Stage 1: Virtual Showroom

#### [NEW] [Showroom.tsx](file:///c:/Users/Alvi/Downloads/yamaha_site/components/Showroom/Showroom.tsx)
- A 3D environment featuring a floor, lighting, and a list of bikes.
- Users can orbit the showroom and tap on bikes to select them.

### [Component Name] Stage 2: AR Mode (MindAR)

#### [NEW] [ARView.tsx](file:///c:/Users/Alvi/Downloads/yamaha_site/components/AR/ARView.tsx)
- Activates the device camera.
- Uses MindAR's World Tracking to detect the floor.
- Places the selected GLB bike in the real world at a 1:1 scale.

### [Component Name] UI & Lead Generation

#### [NEW] [LeadForm.tsx](file:///c:/Users/Alvi/Downloads/yamaha_site/components/UI/LeadForm.tsx)
- Premium form for user details.
- Integration with an API route for data capture.

#### [NEW] [PriceReveal.tsx](file:///c:/Users/Alvi/Downloads/yamaha_site/components/UI/PriceReveal.tsx)
- Animated component to show the Eid Offer price.

## Verification Plan

### Automated Tests
- Build check: `npm run build`.
- 3D Scene sanity check: Verify models load in the virtual showroom.

### Manual Verification
- **Mobile Browser Test**: Test MindAR world tracking on a real mobile device via local network tunneling (e.g., Localtunnel or Ngrok).
- **UI Flow**: Verify the transition from Showroom -> Selection -> AR -> Lead Form.
