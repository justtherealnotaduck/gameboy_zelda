/* Zwei Aufgaben in einer Datei, beide im Netzweg der Seite.
 *
 * 1. OFFLINE. Damit die App ohne Verbindung startet, muessen ihre eigenen
 *    Dateien und die kleinen Dateien des Emulator-CDN aus einem
 *    Zwischenspeicher kommen koennen. Die grosse Kerndatei gehoert
 *    ausdruecklich NICHT dazu: EmulatorJS legt sie selbst in der Datenbank
 *    ab (storage.core), und sie wird in Teilstuecken geholt - eine neu
 *    zusammengebaute Antwort kann das nicht mehr, genau das war frueher der
 *    'Network Error'. Gebraucht wird von uns nur cores/reports/<kern>.json:
 *    daraus liest EmulatorJS die Version, mit der es seinen gespeicherten
 *    Kern wiedererkennt. Fehlt sie, verwirft es ihn und laedt neu - also
 *    gar nicht.
 *
 * 2. ABSCHOTTUNG. PSP und DS brauchen Threads, dafuer SharedArrayBuffer,
 *    dafuer zwei Kopfzeilen, die GitHub Pages nicht setzen kann. Die ruecken
 *    wir nach - aber nur, wenn die Seite den Worker mit ?coep=1 angemeldet
 *    hat. Game Boy und N64 laufen ohne, und was sie nicht brauchen, sollen
 *    sie auch nicht bekommen.
 *
 * Geholt wird immer zuerst aus dem Netz, der Zwischenspeicher ist nur der
 * Rueckfall. Andersherum wuerde die App auf einem alten Stand einfrieren,
 * und veroeffentlicht wird hier oefter als geflogen.
 */

const BEHAELTER = "gameboy-zelda-1";
const CDN = "https://cdn.emulatorjs.org";

if (typeof window === "undefined") {
  // ---- Teil 1: hier laeuft die Datei als Service Worker -------------------
  const COEP = new URL(self.location.href).searchParams.has("coep");

  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", ev => ev.waitUntil(self.clients.claim()));

  self.addEventListener("fetch", ev => {
    const anfrage = ev.request;
    if (anfrage.method !== "GET") return;
    const url = new URL(anfrage.url);

    // Teilstueck-Anfragen und die Kerndatei bleiben unberuehrt - siehe oben.
    if (anfrage.headers.has("range") || url.pathname.endsWith("-wasm.data")) return;
    if (anfrage.cache === "only-if-cached" && anfrage.mode !== "same-origin") return;

    const eigen = url.origin === self.location.origin;
    if (!eigen && url.origin !== CDN) return;      // sonst nichts anfassen

    ev.respondWith(netzZuerst(anfrage, eigen && COEP));
  });

  async function netzZuerst(anfrage, kopfzeilen) {
    try {
      const antwort = await fetch(anfrage);
      if (antwort && antwort.status === 200 && antwort.type !== "opaque") {
        const kopie = antwort.clone();
        caches.open(BEHAELTER)
          .then(b => b.put(anfrage, kopie))
          .catch(() => {});                        // voller Speicher: egal
        return kopfzeilen ? mitKopfzeilen(antwort) : antwort;
      }
      return antwort;
    } catch (e) {
      const treffer = await caches.match(anfrage);
      if (!treffer) throw e;                       // wirklich nichts da
      return kopfzeilen ? mitKopfzeilen(treffer) : treffer;
    }
  }

  function mitKopfzeilen(antwort) {
    const kopf = new Headers(antwort.headers);
    kopf.set("Cross-Origin-Embedder-Policy", "require-corp");
    kopf.set("Cross-Origin-Opener-Policy", "same-origin");
    return new Response(antwort.body, {
      status: antwort.status, statusText: antwort.statusText, headers: kopf });
  }
} else {
  // ---- Teil 2: hier laeuft die Datei im Fenster ---------------------------
  // Fuer den Zwischenspeicher wird der Worker immer angemeldet. Die
  // Abschottung kommt erst dazu, wenn ein PSP- oder DS-Spiel startet: dann
  // wird derselbe Worker unter ?coep=1 neu angemeldet und die Seite laedt
  // einmal neu, damit er auch das Dokument ausliefert.
  window.abschottungAnmelden = async function (coep) {
    if (!("serviceWorker" in navigator)) return "Browser kann keine Service Worker";
    if (!window.isSecureContext) return "nur ueber https moeglich";
    if (coep && window.crossOriginIsolated) return "schon abgeschottet";
    const reg = await navigator.serviceWorker.register(
      new URL("abschottung.js" + (coep ? "?coep=1" : ""), location), { scope: "./" });
    await navigator.serviceWorker.ready;
    return reg.active ? "angemeldet" : "wird eingerichtet";
  };
}
