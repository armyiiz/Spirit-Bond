# Spirit Bond

## เกี่ยวกับโปรเจกต์ (About Project)

**Spirit Bond** เป็นเว็บแอปพลิเคชันเกมแนว **Monster Raising & Idle RPG** ที่ออกแบบมาสำหรับมือถือ (Mobile-first) พัฒนาโดยใช้เทคโนโลยีสมัยใหม่เน้นความลื่นไหลและประสิทธิภาพ ผู้เล่นจะได้รับบทบาทเป็นผู้เลี้ยงมอนสเตอร์ที่ต้องดูแลคู่หู ฝึกฝน ออกสำรวจ และต่อสู้ในดันเจี้ยนต่างๆ เพื่อรวบรวมวัตถุดิบและพัฒนาร่าง

## การติดตั้งและเริ่มใช้งาน (Getting Started)

1.  **ติดตั้ง Dependencies:**
    ```bash
    npm install
    ```
2.  **รัน Development Server:**
    ```bash
    npm run dev
    ```
    เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`
3.  **รัน Unit Tests:**
    ```bash
    npm test
    ```
    *หมายเหตุ: อาจมีคำเตือนเกี่ยวกับ `localStorage` จาก Vitest ซึ่งสามารถเพิกเฉยได้หากการทดสอบผ่าน*
4.  **สร้าง Production Build:**
    ```bash
    npm run build
    ```
    คำสั่งนี้จะทำการตรวจสอบ TypeScript (`tsc`) และ Build ไฟล์ด้วย Vite

## ระบบหลักของเกม (Core Game Mechanics)

### 1. ระบบการต่อสู้ (Battle System)
-   **Auto-battler:** การต่อสู้เป็นแบบอัตโนมัติ ควบคุมด้วยระบบ **Action Gauge** แบบ Real-time ตามค่า Speed ของมอนสเตอร์
-   **ธาตุ (Elemental System):** ระบบแพ้ชนะธาตุเป็นวงกลม:
    -   **Terra (ดิน)** > Aero (ลม)
    -   **Aero (ลม)** > Aqua (น้ำ)
    -   **Aqua (น้ำ)** > Pyro (ไฟ)
    -   **Pyro (ไฟ)** > Terra (ดิน)
-   **การใช้ไอเทม:** สามารถกดหยุดเกมชั่วคราว (`isPaused`) เพื่อเปิดกระเป๋า (Battle Bag) และใช้ไอเทมฟื้นฟูได้
    -   ไอเทมฟื้นฟูรองรับทั้งแบบค่าคงที่ (`hp`) และเปอร์เซ็นต์ (`hpPercent`)
-   **ความพ่ายแพ้:** หาก HP หมด มอนสเตอร์จะไม่ตายแต่ HP จะเหลือ 1 (Critical State) และถูกส่งกลับหน้าหลัก
-   **การหนี (Retreat):** ผู้เล่นสามารถเลือกหนีจากหน้าสรุปผลชนะเพื่อรีเซ็ตความก้าวหน้าในด่านนั้นได้

### 2. การสำรวจและดรอปไอเทม (Exploration & Drops)
-   **โครงสร้างด่าน:** มีทั้งหมด 8 เส้นทาง (Routes) แบ่งตามธีมธาตุ
-   **ระบบ Encounter:** การเจอศัตรูจะอิงตาม `explorationStep`:
    -   Step 0-2: มอนสเตอร์ทั่วไป (Common Mobs) - ดรอปอาหาร (Meat, Apple)
    -   Step 3: มินิบอส (Mini Boss) - ดรอปยา (Potions)
    -   Step 4: บอสประจำด่าน (Route Boss) - ดรอปวัสดุวิวัฒนาการ (Evo Materials) และมีโอกาส 1% ดรอปหินธาตุหายาก (Elemental Stones)

### 3. ระบบการดูแล (Care System)
-   **Vitals:**
    -   **HP:** พลังชีวิต
    -   **Hunger:** ความหิว เพิ่มขึ้นตามเวลา ต้องให้อาหาร
    -   **Mood:** อารมณ์ ลดลงหากมีอึ (Poop) กองอยู่ หรือหิว
    -   **Energy:** ใช้ทำกิจกรรม (Train/Bath) ฟื้นฟูอัตโนมัติ
-   **Game Loop:** `tick` จะทำงานทุก 10 วินาที เพื่อคำนวณ Passive Regeneration และสุ่มเหตุการณ์ขับถ่าย (Poop chance 0.5%)
-   **การขับถ่าย (Poop):** เกิดขึ้นได้เฉพาะตอนตื่น หากปล่อยทิ้งไว้จะลด Mood -0.5 ต่อ Tick ต่อก้อน
-   **การนอนหลับ (Sleep & Offline Progress):**
    -   คำนวณความก้าวหน้าขณะออฟไลน์ (Offline Progression) โดยเทียบเวลา `Date.now()` กับเวลาเซฟล่าสุด
    -   HP และ Energy จะฟื้นฟูเต็ม 100% ภายใน 2 ชั่วโมงจริง (Real-time)

### 4. ร้านค้าและวิวัฒนาการ (Shop & Evolution)
-   **ร้านค้า:** รองรับการซื้อไอเทมและการคราฟต์ (Crafting) โดยเช็ค `craftReq` สำหรับไอเทมพิเศษ
-   **วิวัฒนาการ:** เมื่อมอนสเตอร์เข้าเงื่อนไข จะเปลี่ยนร่างโดย:
    -   เขียนทับ Stats, Name, Element, Stage, Appearance
    -   คงเหลือ Level และ EXP ไว้เท่าเดิม
    -   เชื่อมโยงสายวิวัฒนาการผ่าน `parentSpeciesId`

## คู่มือสำหรับนักพัฒนา (Technical Architecture & Developer Guidelines)

### Tech Stack
-   **Core:** React, TypeScript, Vite
-   **Styling:** Tailwind CSS v3 (Config ต้องใช้ `.cjs`), Framer Motion
-   **State Management:** Zustand (พร้อม Middleware `persist` ลง `localStorage`)

### โครงสร้างและการจัดการ State (State Management)
-   **Data Persistence:** ข้อมูลทั้งหมดเก็บใน `localStorage` ฝั่ง Client เท่านั้น (ไม่มี Backend)
-   **Atomic Selectors:** การเรียกใช้ Store ต้องใช้ Selector แบบ Atomic (เช่น `useStore(state => state.prop)`) เพื่อป้องกัน Infinite Re-render
-   **Action Console:** UI การเล่นทั้งหมด (Bag, Care, Battle, Shop) จะแสดงผลในคอมโพเนนต์ `ActionConsole` ผ่านการสลับ Mode
-   **MonsterStage:** เป็น Presentational Component เท่านั้น รับ Props มาแสดงผล ห้ามมี Logic คำนวณ State ภายใน

### ข้อควรระวังในการเขียนโค้ด (Coding Standards)
1.  **Type Safety:** ข้อมูล `Enemy` จากไฟล์ Data ต้องถูก Map เข้าสู่ Type `Monster` อย่างปลอดภัยก่อนนำไปใช้เสมอ (ใส่ Default values ให้ครบ)
2.  **Hooks Logic:** `useBattle` ใช้ `useRef` สำหรับค่าที่เปลี่ยนแปลงเร็ว (HP, Gauge) เพื่อประสิทธิภาพ และใช้ `useState` เฉพาะตอนต้องการ Re-render UI
3.  **Language:**
    -   **UI/Logs:** ภาษาไทย
    -   **Code/Variables/Comments:** ภาษาอังกฤษ
4.  **Strict Build:** โปรเจกต์ตั้งค่า TypeScript ไว้เข้มงวด ห้ามมี Unused Variables/Imports (ต้องผ่าน `tsc` ก่อน Commit)

## ประวัติการเปลี่ยนแปลง (Changelog)

*จะมีการอัปเดตส่วนนี้ทุกครั้งที่มีการเปลี่ยนแปลงโค้ด*

## แผนในอนาคต (Roadmap)

-   [ ] นำรูปภาพมอนสเตอร์ที่วาดขึ้นมาใช้แทนที่ Emoji
-   [ ] เพิ่มระบบเสียงและดนตรีประกอบ (BGM/SFX)
-   [ ] เพิ่มเนื้อเรื่องและเควส (Story & Quests)
-   [ ] ปรับปรุง Animation การโจมตีและ Effect
