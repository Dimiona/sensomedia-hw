# SensoMedia - Senior Fullstack szakmai tesztfeladat

**Turborepo + TypeScript API + Nuxt 3 + MongoDB**

## Tartalomjegyzék
1. 🛠️ [ Előkövetelmények ](#prerequisites)
    1. 📦 [ NodeJS ](#prerequisites--nodejs)
    2. 🐋 [ Docker ](#prerequisites--docker)
    3. 🌳 [ Környezeti változók ](#prerequisites--dotenv)
2. 💿 [ Telepítés ](#installation)
    1. 📦 [ Függőségek telepítése ](#installation--deps)
    2. 📦 [ Adatbázis feltöltése ](#installation--seeder)
3. ☝🏻 [ Senior szinten értékeltek ](#senior)
4. 📝 [ Leadási dokumentáció ](#doc)
    1. [ Hogyan indítható a projekt ](#doc--how-to-start)
    2. [ Milyen stack döntéseket hoztál ](#doc--stack-decisions)
    3. [ Milyen kompromisszumokat vállaltál ](#doc--compromises)
    4. [ Hogyan kezelted a túlfoglalás problémáját ](#doc--overbooking)
    5. [ Hogyan valósítottad az idempotenciát (kulcs, header vs body) ](#doc--idempotency)
    6. [ Milyen design systemet / UI library-t választottál és miért ](#doc--design-system)
    7. [ Mit fejlesztenél tovább production környezethez ](#doc--production-ready)
5. ⁉️ [ Rövid technikai döntési dokumentáció ](#tech-doc)

----

<a name="prerequisites"></a>
# 🛠️ Előkövetelmények

Azon előkövetelmények, amelyek szükségesek a program alapvető futtatásához.

<a name="prerequisites--nodejs"></a>
# 📦 NodeJS 

A NodeJS megléte alapvető fontosságú a program futtatásához. Telepíteni az alábbi weboldalon található leírás szerint lehetséges:
<a href="https://nodejs.org/en/download" taget="_blank">NodeJS letöltése</a>

> [!WARNING]
> ‼️ A fejlesztésre a v24.15.0 -es **NodeJS**, és a 11.12.1 -es **NPM** verziókkal került sor.

<a name="prerequisites--docker"></a>
# 🐋 Docker

A programhoz tartozó MongoDB noSQL adatbázishoz szükséges a Docker telepítése. Ez történhet a Docker Desktop letöltésével, vagy telepíthető CLI-ből is.

Docker Desktop: <a href="https://www.docker.com/get-started/" target="_blank">Letöltés</a>

<a name="prerequisites--dotenv"></a>
# 🌳 Környezeti változók

A program futtatásához, azt megelőzően szükséges létrehoznunk egy `.env` fájlt. Ezt megtehetjük az alábbi parancs futtatásával a projekt gyökérkönyvtárából kiindulva:

```bash
cp .env.example .env
```

Ezt követően személyre szabhatjuk a `.env` fájl tartalmát, de alapvetően nem kötelező változtatni rajta, mert anélkül is működőképes!

<a name="installation"></a>
# 💿 Telepítés

<a name="installation--deps"></a>
# 📦 Függőségek telepítése

A program futtatása előtt szükséges a függőségek telepítése. Ezt az alábbi paranccsal tudjuk megtenni (a projekt gyökérkönyvtárából futtatva):

```bash
npm install
```

<a name="installation--seeder"></a>
# 📦 Adatbázis feltöltése

Lehetőség van az adatbázisba az események kollekció, dummy adatokkal való feltöltésére seeder script segítségével.
Ehhez futtatnunk kell a következő parancsot, a projekt gyökérkönyvtárából:

```bash
./scripts/docker/database-seeder.sh
```

Ez átmásolja a dummy adatokat tartalmazó events.json fájlt a **mongodb** Docker container-ébe, és a _mongoimport_ paranccsal beimportálja azt.

<a name="senior"></a>
# ☝🏻 Senior szinten értékeltek

✅ Idempotens foglalás létrehozás
✅ MongoDB transaction vagy atomic update használata
✅ Jól strukturált domain/service réteg
✅ Közös Zod sémák használata frontend és backend között
✅ API hibakezelési stratégia
✅ Design system következetes használata a Nuxt frontendben
✅ Docker Compose MongoDB-vel
✅ Seed script
❌ Alap tesztek
✅ README indítási útmutatóval
✅ Rövid technikai döntési dokumentáció

<a name="doc"></a>
# 📝 Leadási dokumentáció

<a name="doc--how-to-start"></a>
# Hogyan indítható a projekt

A projektet a következő paranccsal tudjuk elindítani, a projekt gyökérkönyvtárából: `npm run dev`

API elérése: <a href="http://localhost:3090" target="_blank">http://localhost:3090</a>

APP elérése: <a href="http://localhost:3080" target="_blank">http://localhost:3080</a>

<a name="doc--stack-decisions"></a>
# Milyen stack döntéseket hoztál

### API
Az API-t a javasolt Hono-val alakítottam ki, mert ahogy jeleztétek is, egyszerűbb, mint a NestJS. De a fő ok leginkább az volt, hogy hasonló struktúrában már dolgoztam ExpressJS-ben is, így könnyebbséggel is járt a használata. Továbbá, tekintve, hogy ez egy szakmai tesztfeladat (házi), a NestJS overkill lett volna, egy ilyen kis méretű projekthez.

### Frontend UI
A Nuxt UI mellett tettem le a voksom, mivel ha már eleve Nuxt környezetben voltam, akkor konzekvensen maradtam a szintén Nuxt team által fejlesztett library-nél.

Előnye, hogy más egyéb design library-k meglehet, hogy nem rendelkeznek Nuxt module wrapper-rel, így ez esetben szükséges lett volna hozzá írni egyet, ami esetemben még inkább kitolta volna a fejlesztési időt.

Példa a fentire:
```js
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 5000,
    hideProgressBar: true,
    position: toast.POSITION.TOP_RIGHT,
    transition: toast.TRANSITIONS.SLIDE,
    theme: toast.THEME.COLORED
  })

  return {
    provide: { toast }
  }
})
```

Annó, a vue3-toastify package-hez nem volt Nuxt module wrapper, így sajátkezűleg kellett megoldani.

### Mongo kliens
Itt a natív MongoDB driver -t választottam. A mongoose jó lett volna a kis projektméret miatt, de növelte volna a fejlesztési időt, és a package méretét is (ez most talán elhanyagolható).
A döntés itt most leginkább a gyorsaság (gyorsabb fejlesztés) és időhiány miatt alakult így.

<a name="doc--stack-compromises"></a>
# Milyen kompromisszumokat vállaltál

MongoDB:
  - **id** mezőneveket külön nem hoztam létre, mert a MongoDB alapból minden dokumentumhoz létrehoz egy **_id** -val egy ObjectId-s azonosítót
  - **date** mezőnél nem a STRING típust használtam, hanem a gyári, beépített "date" bsonType-ot, mivel a STRING típust a leglassabb query-zni, sort-olni

API:
  - Valós hibakezelés. Bár igyekeztem a lehető legkörültekintőbben eljárni, és a lehető legnagyobb odafigyeléssel megírni a controller-eket, repository-kat és service-ket, kezelni az egyértelmű hibalehetőségeket, a globális hibakezelést nem valósítottam, csak oly szinten, hogy felkészítettem rá az API-t (`/apps/api/index.ts`) a 2 legfontosabb eseményre való feliratkozással (unhandledRejection, uncaughtException). Továbbá, ott jeleztem is, hogy ez az egyik szükséges pont, amivel foglalkozni kell ha production-ready -re készülünk.
  - Az ObjectId és Date használata miatt, amelyek JSON formátumban nem maradnak meg eredeti típusukban, kellett konvertálni API és APP oldalon is.

APP:
  - Események lista oldal lapozhatósága jelenleg nem megoldott, de csak APP oldalon! Az API támogatja, és van rá `eventsQuerySchema` is, validálva. APP oldalon a haladás oltárán feláldoztam most ezt, és egy beégetett `?page=1&perpage=100` -al kerül lekérdezésre a listaoldal!
  - Design: Reszponzivitás

<a name="doc--overbooking"></a>
# Hogyan kezelted a túlfoglalás problémáját

Alapvetően transaction-t használtam a foglaláshoz, és a transaction-n belül került kikérésre, hogy hány darab férőhely van még hátra, és annak tükrében haladt tovább a program.

Érintett részek a `/apps/api/src/repositories/booking.ts`:
```ts
async create(booking: TBookingCreateSchema, eventCapacity: number)
```

és
```ts
async getEventRemainingCapacity(eventId: TBookingResponseSchema['eventId'], eventCapacity: number): Promise<number>
```

<a name="doc--idempotency"></a>
# Hogyan valósítottad az idempotenciát (kulcs, header vs body)

### APP
Header-ben küldöm `Idempotency-Key` kulccsal. Azért döntöttem a header-s megoldás mellett, így sokkal jobban elkülöníthető a foglalástól (entitástól) magától.

Az adott, kigenerált (uuidv4) kulcs a foglalási oldalon mindaddig megmarad, azonos marad, amíg újra nem töltjük az oldalt, vagy el nem navigálunk róla.

<a name="doc--design-system"></a>
# Milyen design systemet / UI library-t választottál és miért

Erre a válasz <a href="#doc--stack-decisions">itt található</a>, a **Frontend UI** bekezdésnél.

<a name="doc--production-ready"></a>
# Mit fejlesztenél tovább production környezethez

  - A pagination-t megcsinálni normálisan, mert most pl 100 darabot lekérünk mindig. Továbbá, úgy tudjuk csak, hogy elfogyott, ha kérünk egy újabb adagot és a válaszban már az ITEMS kulcs üres array-el tér vissza. Szóval lenne teendő APP és API oldalon is egyaránt! APP oldalon konkrétan nincs lapozó jelenleg, API oldalon meg inkább UX és performancia szempontból kellene fejleszteni.
  - Controller-ek valami szebb megoldás, valamint a httpResponse.ts function -jeit is tovább dolgoznám, mert most a "c" változót cipeljük mindig magunkkal
  - CORS további finomítása
  - a createBooking részen (controller/booking.ts) még kéne dolgozni, hiba esetére, ha a valamiért a response schema sérülne, akkor az idempotency mentésére már nem kerülne sor, ellenben a booking létrejön az adatbázisban már, így fennállhat az esélye, hogy többször beküldhető maradna a kérés, ugyan avval az IdempotencyKey -jel
  - normális error handling (custom error class-okkal, vagy meglévő pl Hono-s error class-okkal) és logging (pl.: winston-nal)
  - még egységesebb/kidolgozottabb response struktúra (főleg hiba esetén, pl szétválasztani fatal error-t a validation error-tól, vagy egyéb más kisebb hibától, mint például az, hogy több jegyet foglal be, mint maradt /időközben/)
  - Eseményekre vonatkozóan a hátralévő kapacitás számát vagy WebSocket-en keresztül "folyamatosan" frissíteni, vagy adott esemény oldalt megtekintve lekérdezve (performance issues?! hot/cold cache), de akár engedni beküldeni, és ha az jön vissza, hogy nincs elegendő hely az igényelthez képest, akkor lekérdezni pluszban a fennmaradó helyek számát és annyit engedni max a user-nek (de ez nem annyira intuitív; UX bukó)
  - APP és API port-ok .env-be szedése
  - APP oldalon implementálni, és használni a `Content Security Policy` -t!
  - API oldalon hasonló, alapvetőbb security beállítások (pl `X-Frame-Options` beállítása)

<a name="tech-doc"></a>
# ⁉️ Rövid technikai döntési dokumentáció

## Feladat
Egy jegyfoglalós rendszer backend + frontend implementálása volt a cél, viszonylag belátható időn belül. Nem egy teljes production-ready projekt létrehozása volt a cél, hanem a fókusz az alábbi pár ponton voltak:
  - idempotencia
  - foglalás
  - túlfoglalás kezelése

## Stack döntések
  - API: Hono => egyszerű, gyors fejlesztés
  - Frontend UI: Nuxt UI => teljes kompatibilitás a Nuxt -tal + a szükséges element-eket tartalmazza
  - Frontend: Nuxt 3 (adott volt) => gyors, nagy tudású, out-of-the-box megoldások (auto import, full typescript support)
  - Adatbázis: MongoDB (adott volt) => rugalmas séma, gyors, prototypingra alkalmas

## Alternatívák
  - API:
    - NestJS: komplexebb, de ehhez a projektmérethez overkill
  - MongoDB driver/layer:
    - Mongoose/Typegoose: kényelmesebb, de plusz réteg, plusz package, nagyobb bundle méret (projekthez viszonyítva)

## Kompromisszumok
  - MongoDB <==> MySQL: gyorsabb haladás; rugalmasság; gyengébb relációkezelés
  - Hono <==> NestJS: egyszerűsége, de kevesebb kész megoldás?!
  - APP nincs pagination <==> van pagination: rövidebb fejlesztési idő; rosszabb UX;

## További fejlesztések
  - Security fejlesztések még APP és API oldalon
  - Mégjobb hibakezelés APP és API oldalon
  - Logging
  - stb.
