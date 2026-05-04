# Yamaha Eid Offer AR Microsite

A premium, high-conversion Web AR microsite built for the Yamaha Eid Offer campaign. This project features a mobile-first experience that starts with a 3D virtual showroom and leads into an interactive Augmented Reality visualization.

## 🚀 Features

- **3D Virtual Showroom**: Interactive showroom environment built with React Three Fiber.
- **Augmented Reality**: Seamless AR floor placement using Google Model Viewer.
- **Lead Generation**: Integrated form to capture customer interest and details.
- **Premium UI**: Modern, dark-themed interface with smooth animations (Framer Motion).
- **Eid Offer Price Reveal**: Interactive price reveal animation for the campaign.
- **Performance Optimized**: Built with Next.js 15 for fast loading and SEO.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **3D Engine**: Three.js, React Three Fiber
- **AR Component**: Google Model Viewer
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Lucide React (Icons)
- **Language**: TypeScript

## 📂 Project Structure

- `/src/components/Showroom`: 3D showroom components and bike models.
- `/src/components/AR`: Augmented Reality integration logic.
- `/src/components/UI`: Lead form, bike details, and general UI elements.
- `/public/models`: 3D bike assets (GLB format).

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abrar-khan-alvi/yamahaAR.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile Testing

To test AR functionality, the site must be served over HTTPS. For local testing, you can use `ngrok`:
```bash
ngrok http 3000
```

## 📄 License

This project is for demonstration purposes for Yamaha Bangladesh.

---
Built with ❤️ for Yamaha by [Antigravity AI](https://github.com/google/antigravity)
