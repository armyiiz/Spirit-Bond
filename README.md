# Spirit Bond

## เกี่ยวกับเกม (Game Overview)

**Spirit Bond** คือเกมเว็บแอปพลิเคชันแนว **Monster Raising & Idle RPG** บนมือถือ ที่ผู้เล่นจะได้เลี้ยงดูมอนสเตอร์คู่ใจ ฝึกฝนค่าสถานะ และออกผจญภัยในโลกแฟนตาซี

**หัวใจหลักของเกม:**
*   **Bonding:** การสร้างความผูกพันผ่านการดูแล (ให้อาหาร, อาบน้ำ, เล่น)
*   **Idle Growth:** ระบบที่ช่วยให้มอนสเตอร์เติบโตได้แม้ผู้เล่นจะไม่ได้เปิดเกม (Offline Progression)
*   **Tactical Auto-Battle:** การต่อสู้แบบอัตโนมัติที่เน้นการวางแผนธาตุและการบริหารจัดการไอเทม

---

## สถานะการพัฒนาและสิ่งที่ทำเสร็จแล้ว (Development Status & History)

รายละเอียดระบบทั้งหมดที่มีการพัฒนาจนถึงปัจจุบัน แบ่งตาม Phase การทำงาน:

### Phase 1: โครงสร้างพื้นฐาน (Foundation & Architecture)
*   **Tech Stack:** พัฒนาด้วย Vite, React, TypeScript, และ Tailwind CSS (v3).
*   **State Management:** ใช้ **Zustand** เป็นตัวกลางจัดการข้อมูลเกมทั้งหมด แยก Logic ออกจาก UI อย่างชัดเจน
*   **Data Persistence:** ระบบ Save Game อัตโนมัติลง `localStorage` ฝั่ง Client (ใช้ Middleware `persist`)
*   **Game Loop:** สร้าง Global Tick System ที่ทำงานทุก 10 วินาที (`tick`) เพื่อคำนวณเหตุการณ์ต่างๆ

### Phase 2: ระบบการเลี้ยงดู (Care System)
*   **Vitals (ค่าสถานะหลัก):**
    *   **HP:** พลังชีวิต (ลดเมื่อต่อสู้)
    *   **Hunger:** ความหิว (เพิ่มขึ้นตามเวลา)
    *   **Mood:** อารมณ์ (ลดลงเมื่อหิวหรือสกปรก)
    *   **Energy:** พลังงานสำหรับทำกิจกรรม
*   **Actions:**
    *   **Bath:** ใช้ 5 Energy เพื่อเพิ่ม 10 Mood (แก้สถานะตัวเหม็น)
    *   **Train:** ใช้ Energy เพื่อเพิ่มค่า Stats
    *   **Feed:** ลดความหิวและเพิ่ม HP ตามประเภทอาหาร
*   **Excretion System:** มอนสเตอร์มีโอกาส 0.5% ต่อ Tick ที่จะขับถ่าย (Poop) หากปล่อยทิ้งไว้ Mood จะลดลง 0.5 ต่อก้อน/Tick
*   **Offline Progression:**
    *   ระบบคำนวณเวลาที่หายไป (`Date.now()` delta) เมื่อเปิดเกมกลับมา (`wakeUp`)
    *   HP และ Energy ฟื้นฟูเต็ม 100% ภายในระยะเวลา 2 ชั่วโมง (7200 วินาที) ของเวลาจริง

### Phase 3: ระบบการต่อสู้ (Battle System)
*   **Action Gauge:** ระบบต่อสู้แบบ Real-time (Auto-battler) ที่ความถี่การโจมตีขึ้นอยู่กับค่า Speed
*   **Elemental System:** วงจรธาตุ 4 ธาตุ (Terra > Aero > Aqua > Pyro > Terra)
*   **Battle Flow:**
    *   รองรับการ **Pause** เพื่อเปิดกระเป๋า (Battle Bag)
    *   ระบบใช้ไอเทมฟื้นฟู (รองรับทั้ง Flat HP และ % HP)
    *   หากแพ้ HP จะเหลือ 1 (Critical) และกลับบ้าน
    *   ปุ่ม **Retreat** (หนี) ในหน้าชนะ เพื่อรีเซ็ตด่าน
*   **Stability:** ใช้ `useRef` ในการคำนวณ Logic ต่อสู้เพื่อความแม่นยำและป้องกัน Re-render loop

### Phase 4: ความก้าวหน้าและเศรษฐกิจ (Progression & Economy)
*   **Exploration Routes:** มีทั้งหมด 8 เส้นทาง ตามธีมธาตุต่างๆ
*   **Encounter Logic:**
    *   Step 0-2: มอนสเตอร์ทั่วไป (Common) - เน้นดรอปอาหาร
    *   Step 3: มินิบอส (Mini Boss) - เน้นดรอปยา (Potion)
    *   Step 4: บอส (Boss) - ดรอปวัตถุดิบวิวัฒนาการ (Evo Material) และมีโอกาส 1% ดรอปหินธาตุ (Jackpot)
*   **Evolution:** ระบบวิวัฒนาการที่เปลี่ยน Base Stats, Element, และ Appearance แต่ยังคง Level/EXP ไว้ (เชื่อมโยงผ่าน `parentSpeciesId`)
*   **Shop & Crafting:** ร้านค้าที่รองรับทั้งการซื้อด้วยเงิน (Gold) และการคราฟต์ผสมไอเทม (`craftReq`)

### Phase 5: ส่วนติดต่อผู้ใช้ (UI/UX Refinement)
*   **Mobile-First Design:** จัดวาง Layout แนวตั้ง (Header -> Stage -> Status -> Console)
*   **Action Console:** พื้นที่ควบคุมหลักที่เปลี่ยน Mode ได้ (Menu, Battle, Bag, Shop) แทนการใช้ Modal
*   **Sleep Summary:** หน้าสรุปผลหลังตื่นนอน แสดงค่าที่ฟื้นฟูไประหว่างออฟไลน์
*   **Localization:** UI และข้อความในเกมทั้งหมดเป็น **ภาษาไทย**

### Phase 6: เนื้อหาขั้นสูง (Advanced Content - Patch 3.0)
*   **Raid System (Spirit Calamity):**
    *   บอส **Titan** หมุนเวียนรายวันตามธาตุ (จันทร์/พฤหัส: Terra, อังคาร/ศุกร์: Pyro, พุธ/เสาร์: Aqua, อาทิตย์: Aero)
    *   การต่อสู้จำกัดเวลา **10 Turns** เน้นทำ Damage สูงสุด
    *   **Spirit Tokens:** รางวัลที่ได้จากการคำนวณ Damage (1 Token ต่อ 100 Damage)
    *   **Raid Tickets:** โควต้าลง Raid 3 ครั้ง/วัน (รีเซ็ตตอน `wakeUp`)
*   **Equipment System:**
    *   ไอเทมประเภท `equipment` ช่วยเพิ่มค่า Stats
    *   การคำนวณ Stats เป็นแบบ Additive (Base Stats + Equipment Bonus) โดยจะคำนวณใหม่ทุกครั้งที่ Level up เพื่อความถูกต้อง
*   **Battle Hub:** ปรับปรุงเมนู Battle ให้รวม 3 โหมดไว้ด้วยกัน:
    1.  **Arena:** Quick Battle กับมอนสเตอร์สุ่ม (ใช้ Global Pool)
    2.  **Adventure:** โหมดเนื้อเรื่องตะลุยด่าน (Exploration Routes)
    3.  **Raid:** โหมดล่าบอสรายวัน

---

## คู่มือการติดตั้ง (Installation)

1.  **Clone & Install:**
    ```bash
    git clone <repository-url>
    npm install
    ```
2.  **Development Mode:**
    ```bash
    npm run dev
    ```
    เข้าเกมได้ที่ `http://localhost:5173`
3.  **Build for Production:**
    ```bash
    npm run build
    ```

## ข้อมูลทางเทคนิคที่ควรทราบ (Technical Notes)
*   **UI Assets:** ปัจจุบันใช้ Placeholder Cards และ Emojis แทนกราฟิกจริง
*   **Dependencies:** โปรเจกต์ใช้ `@tailwindcss/postcss` และ config files (`.cjs`)
*   **Validation:** ห้ามมี Unused Variables ในโค้ด (Strict TypeScript)

---

## แผนงานถัดไป (Roadmap)
- [ ] แทนที่ Emoji ด้วยภาพวาดมอนสเตอร์จริง (Pixel Art/Sprite)
- [ ] เพิ่มระบบเสียง (BGM และ Sound Effects)
- [ ] เพิ่มเนื้อเรื่อง (Story Mode) และเควส
- [ ] ปรับปรุง Visual Effect ในฉากต่อสู้
