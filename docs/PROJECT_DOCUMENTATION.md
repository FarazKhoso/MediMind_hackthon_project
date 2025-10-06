# MediMind AI: Project Documentation

Yeh document MediMind AI application ka ek overview faraham karta hai. Iska maqsad team members ko project ke vision, features, aur istemal ke tareeqon se aagah karna hai.

---

### Project ka Maqsad (Project Objective)

MediMind AI ek aesa mobile-first health application hai jo Pakistan ke aam shehrion ko unki sehat se judi zarooriyat ke liye AI (Artificial Intelligence) ki taqat faraham karta hai. Iska bunyadi maqsad sehat ki maloomat aur fori mashwaray ko har ek ke liye aasan aur qabil-e-rasai (accessible) banana hai.

Humne is app ko khaas taur par **Roman Urdu** ko samajhne aur usmein jawab dene ke liye banaya hai, taake zaban (language) ki rukawat khatam ho aur log aasani se apni pareshani bata sakein.

---

### App ke Aham Features (Key Features)

Yeh app 5 bunyadi (core) AI agents par mushtamil hai:

#### 1. Symptom Checker (Alamaat Check karne wala)
*   **Yeh Kya Hai?** User apni bimari ki alamaat (symptoms) jaise "bukhar aur khansi" bata kar fori mashwara le sakta hai.
*   **Log Ise Kyun Istemal Karenge?** Aam bimariyon ke liye fori gharelu ilaaj aur maloomat haasil karne ke liye, aur yeh janne ke liye ke doctor ke paas kab jana zaroori hai.
*   **Use Case:** Agar kisi ko halka bukhar aur gala kharab hai, to woh AI se pooch sakta hai ke use kya karna chahiye. AI use aaram karne, paani peene, aur agar alamaat barhein to doctor se milne ka mashwara dega.

#### 2. Disease Tracking (Bimariyon ki Nigrani)
*   **Yeh Kya Hai?** Yeh feature wabai amraaz (epidemics) jaise Dengue ya Flu ke data ko sheher (city) level par analyze karta hai.
*   **Log Ise Kyun Istemal Karenge?** Khaas taur par health professionals aur sarkari idaaray is feature ko istemal karke yeh dekh sakte hain ke kaun se ilaaqe 'hotspots' hain aur kahan bimari phailne ka khatra zyada hai.
*   **Use Case:** Health department ke log dekh sakte hain ke Lahore mein Dengue ke cases barh rahe hain, jis par woh wahan fori spray campaigns shuru kar sakte hain.

#### 3. Health Data Analysis (Sehat ke Data ka Tajziya)
*   **Yeh Kya Hai?** Users apne health vitals jaise Blood Pressure, Blood Sugar, aur Heart Rate daal kar AI se tajziya (analysis) karwa sakte hain.
*   **Log Ise Kyun Istemal Karenge?** Apni sehat par nazar rakhne aur lifestyle behtar banane ke liye mashwaray haasil karne ke liye. Khaas taur par woh log jinhein BP ya sugar jaisi purani bimariyan hain.
*   **Use Case:** Ek user apna BP `150/90` enter karta hai. AI use batayega ke yeh thora high hai aur use namak kam karne aur walk karne ka mashwara dega.

#### 4. Medicine & Vaccination Reminder (Dawa aur Vaccine ki Yaad-dehani)
*   **Yeh Kya Hai?** Users apni dawa ya bachon ki vaccine ke liye AI ki madad se reminder set kar sakte hain. Woh likh kar ya prescription ki tasveer upload karke bhi reminder laga sakte hain.
*   **Log Ise Kyun Istemal Karenge?** Dawa ka waqt par lena ya vaccine lagwana yaad rakhne ke liye.
*   **Use Case:** Ek user apne phone se doctor ki prescription ki photo kheench kar upload karta hai. AI us prescription mein se dawa ka naam "Panadol" aur waqt "din mein 2 baar" extract karke automatically reminder set kar dega.

#### 5. Mental Health Chatbot (Zehni Sehat ka Chatbot)
*   **Yeh Kya Hai?** Yeh ek hamdard (empathetic) AI dost hai jisse log apne stress, anxiety, ya depression ke baare mein Roman Urdu mein baat kar sakte hain.
*   **Log Ise Kyun Istemal Karenge?** Fori zehni sahara (emotional support) haasil karne aur apni pareshani share karne ke liye, jab woh kisi insaan se baat karne mein hichkicha rahe hon.
*   **Use Case:** Ek student exam ke stress ki wajah se pareshan hai. Woh chatbot ko batata hai, "Main bohat stress mein hoon." AI usay hamdardana jawab dega aur stress kam karne ke liye kuch aasan tips (jaise gehri saans lena) batayega.

---

### Technology Stack

*   **AI & Agents:** Google Gemini & Genkit
*   **Backend & Deployment:** Firebase App Hosting & Cloud Functions
*   **Database:** Firestore (for user data and logs)
*   **Frontend:** Next.js (React Framework)
*   **Styling:** Tailwind CSS & ShadCN UI

Yeh documentation aapki team ke liye ek accha starting point hai. Woh is app ke link ke saath is document ko parh kar iske tamam features aur maqsad ko aasani se samajh sakte hain.
