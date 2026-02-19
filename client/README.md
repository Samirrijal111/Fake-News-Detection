# 🛡️ FakeNews AI — Frontend

A modern fake news detection web app built with **Next.js 14**, **Tailwind CSS**, and **Lucide React**.

---

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.jsx          # Root layout (Navbar)
│   ├── page.jsx            # Homepage (Hero)
│   ├── check/page.jsx      # News detection form
│   ├── about/page.jsx      # About page
│   ├── contact/page.jsx    # Contact page
│   └── doc/page.jsx        # Documentation
├── components/
│   ├── Navbar.jsx
│   ├── HeroSection.jsx
│   └── NewsForm.jsx
├── public/
├── tailwind.config.js
└── package.json
```

---

## ⚡ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Install icon library

```bash
npm install lucide-react
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ Make sure the FastAPI backend is running on `http://127.0.0.1:8000` for the detection feature to work.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🔗 Pages

| Route      | Description            |
| ---------- | ---------------------- |
| `/`        | Landing page           |
| `/check`   | Detect fake news       |
| `/about`   | About the project      |
| `/contact` | Contact & social links |
| `/doc`     | Project documentation  |

---

## 👨‍💻 Author

**Samir Rijal** · LC00017002045 · Bachelor of Information Technology
