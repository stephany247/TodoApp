# React Native Todo App

A clean, real-time Todo app built with **React Native**, **Expo**, **NativeWind**, and **Convex**.  
It supports light/dark themes, smooth UI, and real-time updates using Convex.

---

## ⚙️ Setup

```bash
# Clone the repo
git clone https://github.com/stephany247/TodoApp.git
cd todo-app

# Install dependencies
npm install

# Start development server
npm run start
# or
npx expo start
```
Scan the QR code with the Expo Go app to open it on your device.

### 🗄️ Convex Setup

#### Install Convex CLI
```bash
npm install convex
```

#### Initialize Convex
```bash
npx convex dev
```


🔐 Environment Variables

Create a .env file in the project root:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
RESEND_API_KEY=your_resend_api_key
```
Add schema in convex/schema.ts:
```bash
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    completed: v.boolean(),
    createdAt: v.string(),
  }),
});
```

Deploy Convex backend:
```bash
npx convex deploy
```

### 🎨 Built With

- React Native (Expo) – App framework
- NativeWind – Tailwind styling
- Convex – Real-time backend
- Resend – Email service (optional)


### 🧠 Features

- Real-time Todo CRUD (add, edit, delete, toggle)
- Light/Dark theme with NativeWind
- Responsive layout
- Clean and minimal UI


## 🧡 Credits

Built for the HNG Internship Stage 3 Task 🧑‍💻
Developed with ❤️ using React Native, Expo, and Convex.