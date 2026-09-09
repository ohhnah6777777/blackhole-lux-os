

# 🌌 Blackhole OS

**Blackhole OS** is an ultra-premium, minimalist web-based operating system simulation built using React and Tailwind CSS. Stripping away cluttered cyberpunk tropes, Blackhole OS blends the glassmorphic elegance of **macOS Sequoia** with the clean typography and snap layouts of **Windows 11** to deliver a sophisticated, monochromatic desktop workspace right inside your browser.

---

## 🎨 Design Philosophy
* **Pure Monochromatic Aesthetics:** Built entirely using deep pitch-blacks (`#000000`), stark crisp white typography, and subtle fine-lined dark borders (`1px border-neutral-800`).
* **Glassmorphic Elements:** Heavy backdrop blurs (`backdrop-blur-lg`) on active app panels and the bottom floating navigation dock.
* **Fluid Geometry:** Carefully calculated border radiuses and shadows to give overlapping windows a realistic, three-dimensional spatial depth.

---

## 🚀 Implemented Applications & Features

### 🌐 1. Blackhole Browser (Web Portal Gateway)
A custom-built productivity browser modeled after modern modular application frames like Arc and Safari. 
* **Native Iframe Embedding:** Features pre-configured, secure shortcuts for framing-compliant digital libraries, including **Wikipedia** and **The Internet Archive**.
* **Smart URL Sandbox Routing:** Leverages advanced parsing logic to detect iframe-blocking websites (e.g., Google, YouTube) and automatically routes those requests into sandboxed external browser tabs (`_blank`), eliminating the dreaded connection refusal bugs.

### 🕹️ 2. MS-DOS Retro Arcade
Harnessing the open-access power of the Internet Archive, Blackhole OS features a dedicated retro emulation stage. Play thousands of legendary MS-DOS and classic web games natively inside a fluid, hardware-accelerated app window frame supporting keyboard states and controller mapping.

### 📁 3. Interactive File Manager & System Settings
* **Local State File System:** Fully responsive directory traversal (Documents, Downloads, Media) equipped with native breadcrumb navigation paths.
* **Functional System Toggles:** Real-time state management allowing users to update desktop backgrounds, modify canvas scales, and tweak window styling on the fly.
* **Draggable Window Stack:** An integrated desktop canvas engine handling multi-window absolute layout dragging, resizing, minimizing, and z-index window focusing.

---

## 🛠️ Local Installation & Development

To run Blackhole OS locally on your machine, clone the repository and execute the following commands in your terminal:

```bash
# Clone the repository
git clone https://github.com

# Navigate into the project folder
cd blackhole-os

# Install required Node packages
npm install

# Boot up the local Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser to experience the operating system.

