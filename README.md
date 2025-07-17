# Chuck Norris Jokes App 💥😂

> "Chuck Norris doesn't do push-ups. He pushes the Earth down."

## 🚀 About this project
This is a **Next.js** app that delivers unlimited Chuck Norris jokes because the world can always use more of them. Users can **favorite** jokes, **rate them**, **sort them by rating**, and even **share them on WhatsApp**. Because, let's be honest, some Chuck Norris jokes are just deadlier than others. 💀

---

## 🛠 Setup Instructions

### 1️⃣ Clone this repo
```sh
 git clone https://github.com/GuilloSGit/greencode-challenge.git
 cd greencode-challenge
```

### 2️⃣ Install dependencies
```sh
 pnpm install
```

### 3️⃣ If you encounter styling issues, run these commands:
```sh
 # Install compatible versions of Tailwind CSS, PostCSS, and Autoprefixer
 pnpm install -D tailwindcss@3.3.0 postcss@8.4.31 autoprefixer@10.4.14
 
 # Initialize Tailwind CSS
 npx tailwindcss init -p
```

### 4️⃣ Run the development server
```sh
 pnpm run dev
```
Then, open [http://localhost:3000](http://localhost:3000) in your browser and enjoy the legendary wisdom of Chuck Norris. 🥋

### 5️⃣ Run the tests
```sh
 pnpm test
```
Chuck Norris doesn't test his code; the code tests itself out of fear. But since we're mere mortals, we have comprehensive tests. 💪

---

## 📦 Dependencies
- **Next.js** – Because React alone isn't Chuck Norris enough.
- **Tailwind CSS** – Choosed weapon for styling.
- **LocalStorage** – No backend needed; Chuck Norris stores everything in his head, but we use local storage.
- **Jest & Testing Library** – Because even Chuck Norris's code needs to prove itself in battle.

---

## 🎯 Features
✔️ Fetch random Chuck Norris jokes

✔️ Favorite jokes for later inspiration

✔️ Remove jokes from your favorites if you realize you can't handle the truth

✔️ Rate jokes (1-5 ⭐) and sort them accordingly from Favorite Jokes tab

✔️ Share your favorite jokes on WhatsApp with a single click

✔️ Data persists locally, so your favorites survive even a nuclear apocalypse (or just a browser refresh)

✔️ Toast notifications that appear faster than Chuck Norris can roundhouse kick

✔️ Full accessibility support because Chuck Norris believes jokes should be for everyone

✔️ Visual feedback on buttons to show their current state (even Chuck Norris appreciates good UX)

---

## 📝 Implementation Notes
- **State Management:** No Redux, just good ol' useState and useEffect.
- **Data Persistence:** LocalStorage keeps your jokes safe.
- **UI Library:** Tailwind CSS, because even Chuck Norris appreciates good design.
- **Custom Hooks:** We've separated logic into custom hooks - something even Chuck Norris would approve of.
- **Accessibility:** ARIA attributes, semantic HTML and screen reader support - because Chuck Norris is very inclusive.
- **SVG Components:** Modular SVG icons for consistency across the UI.

---

## 🧪 Testing Strategy
> "When Chuck Norris unit tests, he doesn't mock dependencies. The dependencies mock themselves."

This app is tested more thoroughly than Chuck Norris's martial arts skills:

### Unit Tests
- **useFavorites Hook:** Tests adding, removing, and rating jokes in favorites
- **useJoke Hook:** Tests fetching new jokes (because Chuck Norris's jokes never fail)
- **useSortedFavorites Hook:** Makes sure jokes are sorted properly by rating and date

### End-to-End Tests
- **JokeApp Component:** Full integration testing that simulates user interactions
- **Toast Notifications:** Tests that notifications appear properly (even Chuck Norris likes feedback)

The tests are so robust that they once made a bug surrender without even running. 💥

---

## 🎉 Have fun!
Pull requests, feature suggestions, and Chuck Norris jokes are always welcome! 😎

Feel free to contact me:

- Email: guillermoandrada@gmail.com
- LinkedIn: https://www.linkedin.com/in/guillermo-david-andrada/
- GitHub: https://github.com/GuilloSGit

---

> "Chuck Norris doesn't debug. He just stares down the bugs until the code confesses."
