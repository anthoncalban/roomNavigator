# NEU Campus Navigator

A **web application** designed to help freshmen, faculty, and visitors easily navigate **NEU's campus**.
By entering a room code (e.g., `M410B`) into the search bar, the app instantly translates it into clear building, floor, and room information — complete with seating, capacity, and available facilities.
Beyond room codes, the app also provides **faculty directories, college/building guides, an admin panel, and popular spots** to make campus navigation simple and accessible.

**Live Demo:** [NEU Campus Navigator](https://campus-navigator-psi.vercel.app/)

---

## Project Statement

NEU Campus Navigator focuses on **clarity, accessibility, and ease of use** — ensuring that new students, faculty, and visitors can confidently find their way around campus.
It reduces confusion during the first weeks of school by translating codes into plain language, while also serving as a **directory of colleges, faculties, buildings, and events**.

---

## Features

- **Room Code Translation** — enter a code like `M410B` and instantly see building name, floor, and room number.
- **Room Details** — capacity, seating, and inventory (e.g., projector, whiteboard, air conditioning).
- **Colleges View** — browse colleges and their associated buildings directly.
- **Faculty & Building Directory** — explore faculty offices and buildings without typing codes.
- **Admin Panel** — protected admin interface for managing campus data.
- **User Authentication** — login system to control access to admin features.
- **Smooth Animations** — enhanced UI transitions powered by the `motion` library.
- **Legend Guide** — quick reference for building abbreviations:
  - `M` = Main Building
  - `SOM` = School of Management
  - `PSB` = Professional School Building
  - `IS` = Integrated School
- **Popular Spots** — shortcuts to frequently searched rooms and faculty offices.
- **Fast Deployment** — lightweight front-end hosted on **Vercel** for easy access.

---

## Project Structure

```
campusNavigator/
├── src/                         # Application source code
│   ├── components/
│   │   ├── AdminView.tsx        # Admin panel for managing campus data
│   │   ├── CollegesView.tsx     # Browse colleges and buildings
│   │   ├── DirectoryView.tsx    # Faculty & building directory
│   │   ├── HomeView.tsx         # Main landing/search view
│   │   └── LoginView.tsx        # User authentication screen
│   ├── services/                # Service layer (admin utilities, API calls)
│   │   └── admin/
│   ├── App.tsx                  # Root component and routing logic
│   ├── index.css                # Global styles (Tailwind CSS)
│   ├── main.tsx                 # Application entry point
│   └── types.ts                 # Shared TypeScript type definitions
├── .env.example                 # Environment variable template
├── .gitignore
├── README.md
├── index.html                   # HTML entry point
├── metadata.json                
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Application Flows

### 1. Room Code Translation (Search Bar)

**Purpose:** Core feature for freshmen navigation
**Steps:**
1. User enters a room code in the search bar (e.g., `M410B`)
2. System parses building abbreviation, floor, and room number
3. Display clear output: *Main Building, 4th Floor, Room 410*
4. Show extra details: capacity, seating, and inventory

### 2. Colleges & Faculty Directory

**Purpose:** Helps users explore colleges, faculties, and buildings
**Steps:**
1. User selects a college from the Colleges view or a faculty/building from the Directory
2. System displays building details and available rooms
3. Provides quick navigation shortcuts

### 3. Admin Panel

**Purpose:** Allows authorized users to manage campus data
**Steps:**
1. User logs in via the Login screen
2. Admin is redirected to the Admin view
3. Admin can manage rooms, faculties, and building information

### 4. Popular Spots

**Purpose:** Quick access to common rooms and faculty offices
**Steps:**
1. User taps a shortcut (e.g., `SOM201`)
2. System jumps directly to room/faculty details

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS v4 |
| Animations | Motion (`motion` library) |
| Icons | Lucide React |
| Backend/API | Express.js |
| Hosting | Vercel |

---

---

## Future Enhancements

- Smart search with autocomplete and typo handling
- Outdoor routing between buildings
- Event overlays for seminars, sports fest, and club activities
- Accessibility routes for ramps and safe pathways
- Favorites/bookmarks for personalized navigation

---

## License

MIT License

Copyright (c) 2026 anthoncalban

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
