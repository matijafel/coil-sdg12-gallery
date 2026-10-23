# Waste Less, Live Better — COIL SDG 12

Ta projekt je prilagojena predloga za šolsko COIL spletno galerijo na temo **SDG 12 – Responsible Consumption and Production**, s poudarkom na elektronskih odpadkih. Spletna stran in besedila za obiskovalce so v angleščini.

## Kako odpreti spletno stran
1. Razširi ZIP datoteko.
2. Odpri mapo `COIL_SDG_Gallery_Template`.
3. Dvoklikni `index.html`, da si ogledaš stran v brskalniku.

## Pred oddajo obvezno dokončajta
- V `gallery-data.js` spremenita `Student A` in `Student B` v vajini imeni.
- V `assets/images/` zamenjajta vzorčne SVG ilustracije z vsaj 12 lastnimi fotografijami (6 na dijaka), nato posodobita poti in opise v `gallery-data.js`. Vzorčne ilustracije niso vajine fotografije.
- V `index.html` dodajta oba predstavitvena videa iz 3. naloge. Za YouTube uporabita obliko `https://www.youtube-nocookie.com/embed/VIDEO_ID`.
- Popravita razdelitev dela v razdelku Meet the creators, da ustreza dejanskemu prispevku vsakega dijaka.
- Dodajta še vire, ki sta jih dejansko uporabila pri raziskavi. Za začetek je povezava na uradni cilj SDG 12 že na strani: https://sdgs.un.org/goals/goal12
- Preverita kviz, filtre, povečavo fotografij, anketo in mobilni prikaz.

## Datoteke
- `index.html` — struktura in angleška vsebina spletne strani
- `style.css` — oblikovanje in odzivni prikaz
- `script.js` — galerija, kviz, anketa in mobilni meni
- `gallery-data.js` — napisi, kategorije, avtorji in poti fotografij

## Pomembno o anketi
Anketa shrani glasove samo v brskalnik obiskovalca prek `localStorage`. Glasovi niso združeni med vsemi obiskovalci. Za skupno anketo bi bila potrebna zunanja podatkovna storitev in backend.

## GitHub Pages
Naložita vsebino mape `COIL_SDG_Gallery_Template` v koren javnega repozitorija. Nato odpri `Settings → Pages → Deploy from a branch → main → /(root) → Save`.
