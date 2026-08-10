import {
  LEGAL_CONTROLLER_NAME,
  LEGAL_CONTROLLER_TRADE,
  LEGAL_JURISDICTION,
  LEGAL_POSTAL_ADDRESS,
  SUPPORT_EMAIL,
  WEBSITE_URL,
} from "@/lib/appLinks";
import type { LanguageCode } from "@/types";

const controllerLine = `${LEGAL_CONTROLLER_NAME} (operating as ${LEGAL_CONTROLLER_TRADE})`;
const contactBlock = `Address: ${LEGAL_POSTAL_ADDRESS}
Email: ${SUPPORT_EMAIL}`;
const contactBlockHu = `Cím: ${LEGAL_POSTAL_ADDRESS}
E-mail: ${SUPPORT_EMAIL}`;

export const PRIVACY_POLICY_EN = `Privacy Policy — Sip & Pill

Last updated: 10 August 2026

1. Controller
The data controller for Sip & Pill is ${controllerLine}, established in ${LEGAL_JURISDICTION}.
${contactBlock}
Website: ${WEBSITE_URL}

This notice is provided under the EU General Data Protection Regulation (GDPR / DSGVO) and applicable German law (including the Telemediengesetz / Digitale-Dienste-Gesetz where relevant).

2. What the app stores
Sip & Pill is designed as an offline wellness companion. On your device it may store:
• the display name you enter;
• language and theme preferences;
• water goals, glass size, and daily water logs;
• medication names, schedules, and taken/not-taken status;
• reminder preferences and celebration flags;
• other settings you configure in the app.

This information is stored locally (for example in the app’s local storage / device storage). It is not uploaded to our servers as part of normal app use.

3. Purpose of processing
We process the data listed above solely to provide the app’s features on your device (personalization, tracking, reminders, and settings). There is no advertising profile and no sale of personal data.

4. Legal basis
Where GDPR applies, processing is based on Art. 6(1)(b) GDPR (performance of the service you request) and, where needed, Art. 6(1)(f) GDPR (legitimate interest in operating a local app experience). You choose what to enter; you can delete it at any time.

5. No account, no cloud sync
Sip & Pill does not require an account. We do not operate a cloud backend for your water or medication logs. If you use the “Contact support” feature, your device mail app may send a message you compose to our support address; that is handled by your mail provider, not by uploading app content from within Sip & Pill.

6. Analytics, ads, and tracking
The app does not include third-party advertising SDKs or analytics trackers that profile you for marketing. Platform services (Apple / Google) may collect diagnostic or store-related data under their own terms when you install or rate the app.

7. Children
Sip & Pill is a general wellness tool. It is not directed at children under 13 (or the higher age required in your country). Do not enter another person’s health information without a lawful basis.

8. Retention and deletion
Data remains on your device until you change or delete it, uninstall the app, or use “Reset All Data” in Settings, which erases local app preferences and logs stored by Sip & Pill.

9. Your rights (EEA / UK / similar)
Depending on applicable law, you may have rights of access, rectification, erasure, restriction, objection, and data portability regarding personal data. Because data is stored on your device, you can exercise many of these rights directly in the app (edit or reset). For other requests, contact ${SUPPORT_EMAIL}. You may lodge a complaint with a supervisory authority in ${LEGAL_JURISDICTION} or your place of residence.

10. Medical disclaimer
Sip & Pill is not a medical device and does not provide medical advice, diagnosis, or treatment. Always follow guidance from qualified healthcare professionals for medications and health decisions.

11. Changes
We may update this Privacy Policy when the app or legal requirements change. The “Last updated” date will be revised accordingly. Continued use after an update constitutes acknowledgment of the revised notice where permitted by law.

12. Contact
${controllerLine}
${contactBlock}
Jurisdiction: ${LEGAL_JURISDICTION}`;

export const PRIVACY_POLICY_HU = `Adatvédelmi tájékoztató — Sip & Pill

Utolsó frissítés: 2026. augusztus 10.

1. Adatkezelő
A Sip & Pill adatkezelője: ${controllerLine}, székhely / joghatóság: ${LEGAL_JURISDICTION}.
${contactBlockHu}
Weboldal: ${WEBSITE_URL}

Ez a tájékoztató az EU általános adatvédelmi rendelete (GDPR / DSGVO) és a vonatkozó német jog alapján készült.

2. Mit tárol az app
A Sip & Pill offline wellness társnak készült. Az eszközödön tárolhatja többek között:
• a megadott megjelenített nevet;
• nyelv- és témabeállításokat;
• vízcélokat, pohárméretet és napi naplókat;
• gyógyszerneveket, ütemezést és bevételi állapotot;
• emlékeztető-beállításokat és ünneplési jelzőket;
• egyéb, az appban megadott beállításokat.

Az adatok helyben (pl. helyi tárolóban) maradnak. A szokásos használat során nem töltjük fel őket a szervereinkre.

3. A kezelés célja
Az adatokat kizárólag az app funkcióinak biztosítására kezeljük az eszközödön (személyre szabás, követés, emlékeztetők, beállítások). Nincs reklámprofil, és nem értékesítünk személyes adatot.

4. Jogalap
Ahol a GDPR alkalmazandó: Art. 6(1)(b) (a kért szolgáltatás teljesítése), szükség esetén Art. 6(1)(f) (jogos érdek a helyi app-élmény működtetéséhez). Te döntöd el, mit írsz be; bármikor törölheted.

5. Nincs fiók, nincs felhőszinkron
A Sip & Pill nem kér fiókot, és nem üzemeltet felhőbackendet a víz- és gyógyszernaplókhoz. A „Kapcsolat / támogatás” funkció a készüléked levelezőappját nyitja meg; az üzenetet a te levelezőszolgáltatód továbbítja.

6. Analitika, hirdetések, követés
Az app nem tartalmaz harmadik felek reklám- vagy marketing-analitikai SDK-jait. Az Apple / Google a saját feltételeik szerint gyűjthet diagnosztikai vagy áruházi adatokat telepítéskor / értékeléskor.

7. Gyermekek
A Sip & Pill általános wellness eszköz. Nem 13 év alatti gyermekeknek szól (vagy a lakóhelyeden előírt magasabb korhatár alatt). Ne add meg más egészségügyi adatait jogszerű alap nélkül.

8. Megőrzés és törlés
Az adatok az eszközödön maradnak, amíg nem módosítod / törlöd őket, nem távolítod el az appot, vagy nem használod a Beállításokban a „Minden adat törlése” funkciót.

9. Jogaid (EGT / hasonló)
A vonatkozó jog szerint kérheted a hozzáférést, helyesbítést, törlést, korlátozást, tiltakozást és az adathordozhatóságot. Mivel az adatok az eszközödön vannak, sok jogot közvetlenül az appban gyakorolhatsz. Egyéb kérések: ${SUPPORT_EMAIL}. Panaszt tehetsz a ${LEGAL_JURISDICTION}-i vagy a lakóhelyed szerinti felügyeleti hatóságnál.

10. Orvosi felelősségkizárás
A Sip & Pill nem orvostechnikai eszköz, és nem nyújt orvosi tanácsot, diagnózist vagy kezelést. Gyógyszereknél és egészségügyi döntéseknél kövesd a szakképzett egészségügyi szakember útmutatását.

11. Változások
A tájékoztatót az app vagy a jogi követelmények változásakor frissíthetjük. Az „Utolsó frissítés” dátuma ennek megfelelően változik.

12. Kapcsolat
${controllerLine}
${contactBlockHu}
Joghatóság: ${LEGAL_JURISDICTION}`;

export const TERMS_OF_USE_EN = `Terms of Use — Sip & Pill

Last updated: 10 August 2026

1. Provider
Sip & Pill is provided by ${controllerLine}, ${LEGAL_JURISDICTION}.
${contactBlock}
Website: ${WEBSITE_URL}

2. Acceptance
By downloading or using Sip & Pill you agree to these Terms and our Privacy Policy. If you do not agree, do not use the app.

3. License
We grant you a personal, non-exclusive, non-transferable, revocable license to use Sip & Pill for your own private, non-commercial wellness tracking on devices you own or control.

4. Not a medical device
Sip & Pill is a consumer wellness / reminder tool only. It is not a medical device under applicable law, is not intended for clinical decision-making, and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional regarding medications and health conditions. Do not delay seeking care because of information in the app.

5. Your responsibilities
You are responsible for the accuracy of information you enter (including medication names and schedules) and for following your clinician’s instructions. Keep the app and your device reasonably secure. Do not misuse the app (e.g. reverse engineering beyond permitted law, unlawful content, or interference with others).

6. Offline nature
Core tracking features are designed to work offline on your device. Availability of optional features (mail, share sheet, store rating) depends on your device, OS, and network.

7. Intellectual property
Sip & Pill, including name, branding, mascots, and software, is protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works except as allowed by mandatory law or with prior written permission.

8. Free service / no warranty
The app is provided free of charge, “as is” and “as available,” without warranties of any kind to the fullest extent permitted by law, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant uninterrupted or error-free operation.

9. Limitation of liability
To the fullest extent permitted by applicable law, ${LEGAL_CONTROLLER_NAME} / ${LEGAL_CONTROLLER_TRADE} shall not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of data, arising from use of the app. Mandatory consumer rights in ${LEGAL_JURISDICTION} or your country of residence remain unaffected. Nothing in these Terms excludes liability for intent, gross negligence, or injury to life, body, or health where such exclusion is prohibited.

10. Third-party services
Opening Mail, Share, or App Store / Play review interfaces uses Apple, Google, or other third-party services under their terms. We are not responsible for those services.

11. Termination
You may stop using the app at any time and delete local data via Settings or by uninstalling. We may discontinue or change the app. Provisions that by nature should survive (IP, disclaimers, liability limits) survive termination.

12. Governing law
These Terms are governed by the laws of ${LEGAL_JURISDICTION}, excluding conflict-of-law rules, without prejudice to mandatory consumer protection rules of your habitual residence in the EU/EEA.

13. Changes
We may update these Terms. The “Last updated” date will change. Material changes may be communicated in-app or on the website where appropriate. Continued use after the effective date constitutes acceptance where permitted by law.

14. Contact
${controllerLine}
${contactBlock}`;

export const TERMS_OF_USE_HU = `Felhasználási feltételek — Sip & Pill

Utolsó frissítés: 2026. augusztus 10.

1. Szolgáltató
A Sip & Pill szolgáltatója: ${controllerLine}, ${LEGAL_JURISDICTION}.
${contactBlockHu}
Weboldal: ${WEBSITE_URL}

2. Elfogadás
A Sip & Pill letöltésével vagy használatával elfogadod ezeket a Feltételeket és az Adatvédelmi tájékoztatót. Ha nem értesz egyet, ne használd az appot.

3. Licenc
Személyes, nem kizárólagos, nem átruházható, visszavonható licencet adunk a Sip & Pill saját, nem kereskedelmi wellness követésére, az általad birtokolt vagy ellenőrzött eszközökön.

4. Nem orvostechnikai eszköz
A Sip & Pill fogyasztói wellness / emlékeztető eszköz. Nem orvostechnikai eszköz, nem klinikai döntéstámogatásra készült, és nem helyettesíti a szakmai orvosi tanácsot, diagnózist vagy kezelést. Gyógyszereknél és egészségügyi kérdéseknél fordulj szakképzett egészségügyi szakemberhez.

5. A te felelősséged
Te felelsz a bevitt adatok pontosságáért (gyógyszernevek, ütemezés) és az orvosod utasításainak betartásáért. Tartsd ésszerűen biztonságban az appot és az eszközöd. Ne miszd az appot (pl. jogellenes másolás, beavatkozás).

6. Offline jelleg
Az alapkövetés offline működik. Az opcionális funkciók (levelezés, megosztás, áruházi értékelés) a készülékedtől, rendszertől és hálózattól függnek.

7. Szellemi tulajdon
A Sip & Pill neve, arculata, mascotjai és szoftvere szellemi tulajdonjogi védelem alatt áll. Másolás, módosítás, terjesztés csak a kötelező jog vagy előzetes írásbeli engedély szerint lehetséges.

8. Ingyenes szolgáltatás / jótállás kizárása
Az app ingyenesen, „ahogy van” és „ahogy elérhető” alapon kerül átadásra, a törvény által megengedett legnagyobb mértékben kizárva a szavatosságot. Nem garantáljuk a zavartalan vagy hibamentes működést.

9. Felelősségkorlátozás
A vonatkozó jog által megengedett legnagyobb mértékben ${LEGAL_CONTROLLER_NAME} / ${LEGAL_CONTROLLER_TRADE} nem felel közvetett, járulékos, különleges vagy következményi károkért, illetve adatvesztésért. A ${LEGAL_JURISDICTION}-i vagy a lakóhelyed szerinti kötelező fogyasztói jogok érintetlenek. Szándék, súlyos gondatlanság, illetve élet/testi épség sérelme esetén a felelősség nem zárható ki, ahol ezt a jog tiltja.

10. Harmadik felek
A Mail, Megosztás vagy áruházi értékelés Apple, Google vagy más szolgáltató feltételei szerint működik.

11. Megszűnés
Bármikor abbahagyhatod a használatot, és törölheted a helyi adatokat. Az appot megszüntethetjük vagy módosíthatjuk. A természetüknél fogva fennmaradó rendelkezések hatályban maradnak.

12. Irányadó jog
A Feltételekre ${LEGAL_JURISDICTION} joga az irányadó, a kollíziós szabályok kizárásával, az EU/EGT kötelező fogyasztóvédelmi szabályainak sérelme nélkül.

13. Változások
A Feltételeket frissíthetjük; az „Utolsó frissítés” dátuma változik. A további használat — ahol a jog engedi — az elfogadást jelenti.

14. Kapcsolat
${controllerLine}
${contactBlockHu}`;

export function getPrivacyPolicy(language: LanguageCode): string {
  return language === "hu" ? PRIVACY_POLICY_HU : PRIVACY_POLICY_EN;
}

export function getTermsOfUse(language: LanguageCode): string {
  return language === "hu" ? TERMS_OF_USE_HU : TERMS_OF_USE_EN;
}
