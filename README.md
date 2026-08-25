# Shaharyar Concrete Pty Ltd — Website

Yeh ab ek proper **Vite + React + Tailwind** project hai (pehle jo aap ke paas single `index.html` file thi, wohi design/content is project ke andar `src/App.jsx` mein move ho gaya hai — sab kuch bilkul waisa hi dikhega, sirf structure proper ho gaya hai taake VS Code mein `npm install` / `npm run dev` chal sake).

## Local par chalane ka tareeqa (VS Code)

1. Is zip ko extract karein, folder ban jayega (e.g. `shaharyar-concrete-website`).
2. Us folder ko VS Code mein open karein.
3. VS Code ka terminal kholein (`Terminal > New Terminal`) aur yeh command chalayein:
   ```bash
   npm install
   ```
4. Install hone ke baad yeh command chalayein:
   ```bash
   npm run dev
   ```
5. Terminal mein ek link milega, aam tor par:
   ```
   http://localhost:5173
   ```
   Yeh link browser mein open karein — website Vite ke local server par live dikhegi.

## GitHub par push karna

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Vercel par deploy karna

1. [vercel.com](https://vercel.com) par apne GitHub account se login karein.
2. "Add New Project" > apna GitHub repo select karein (jo abhi push kiya).
3. Vercel khud detect kar lega ke yeh Vite project hai (Build Command: `vite build`, Output Directory: `dist`) — bas "Deploy" dabayein.
4. Deploy hone ke baad Vercel ek live link dega (e.g. `https://your-project.vercel.app`) — yehi link client ko bhej sakte hain.

## Project apni project photos add karna (optional)

"Our Work" section abhi placeholder textures use kar raha hai. Real photos lagane ke liye:

1. `public/images/` folder banayein aur us mein apni photos rakh dein (e.g. `public/images/driveway-01.jpg`).
2. `src/App.jsx` mein `WorkTile` component ke andar wale style ko badal dein, e.g.:
   ```jsx
   style={{ backgroundImage: 'url(/images/driveway-01.jpg)', backgroundSize: 'cover' }}
   ```

## Quote form

Quote form filhal server-less hai — submit hone par customer ke email app mein pehle se filled hui email khul jati hai jo `shaharyar1892@gmail.com` ko jaati hai. Agar aap chahte hain ke form silently background mein submit ho (bina email app khole), Formspree ya Netlify Forms wire kiya ja sakta hai — bata dein to woh bhi kar dete hain.

## Project structure

```
├── index.html          # Vite entry HTML (fonts, meta tags)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx         # React entry point
    ├── App.jsx          # Poori website ke components (Nav, Hero, About, Services, Work, Hours, QuoteForm, Footer)
    └── index.css        # Tailwind + custom styles (formwork grid, hazard stripe, etc.)
```
