/* Schottet die Seite ab, damit SharedArrayBuffer zur Verfuegung steht.
 *
 * Warum: die Emulatorkerne fuer PSP und Nintendo DS brauchen Threads. Threads
 * gibt es im Browser nur ueber SharedArrayBuffer, und den gibt der Browser nur
 * frei, wenn die Seite mit zwei Kopfzeilen ausgeliefert wird:
 *
 *     Cross-Origin-Opener-Policy: same-origin
 *     Cross-Origin-Embedder-Policy: require-corp
 *
 * GitHub Pages kann keine eigenen Kopfzeilen setzen. Ein Service Worker schon:
 * er sitzt zwischen Seite und Netz, holt jede Antwort selbst und reicht sie mit
 * den fehlenden Kopfzeilen weiter. Fremde Adressen - hier das CDN mit den
 * Emulatorkernen - bekommen zusaetzlich Cross-Origin-Resource-Policy, sonst
 * wuerde die Abschottung sie blockieren.
 *
 * Dieselbe Datei ist beides: im Browserfenster meldet sie den Worker an, im
 * Worker selbst faengt sie die Anfragen ab.
 */

if (typeof window === "undefined") {
  // ---- Teil 1: hier laeuft die Datei als Service Worker -------------------
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", ev => ev.waitUntil(self.clients.claim()));

  self.addEventListener("fetch", ev => {
    const anfrage = ev.request;
    // Reine Cache-Abfragen nicht anfassen, sonst wirft der Browser.
    if (anfrage.cache === "only-if-cached" && anfrage.mode !== "same-origin") return;

    ev.respondWith(
      fetch(anfrage)
        .then(antwort => {
          if (antwort.status === 0) return antwort;      // undurchsichtig, unveraendert
          const kopf = new Headers(antwort.headers);
          kopf.set("Cross-Origin-Embedder-Policy", "require-corp");
          kopf.set("Cross-Origin-Opener-Policy", "same-origin");
          kopf.set("Cross-Origin-Resource-Policy", "cross-origin");
          return new Response(antwort.body, {
            status: antwort.status,
            statusText: antwort.statusText,
            headers: kopf,
          });
        })
        .catch(fehler => {
          console.error("Abschottung:", fehler);
          return new Response("", { status: 502 });
        })
    );
  });
} else {
  // ---- Teil 2: hier laeuft die Datei im Fenster ---------------------------
  // Bewusst nicht von selbst: der Worker wird erst angemeldet, wenn wirklich
  // ein Spiel mit Threads gestartet wird. Game Boy und N64 laufen ohne ihn -
  // die sollen von einem Zwischenstueck im Netzweg gar nicht erst beruehrt
  // werden.
  window.abschottungAnmelden = async function () {
    if (window.crossOriginIsolated) return "schon abgeschottet";
    if (!window.isSecureContext) return "nur ueber https moeglich";
    if (!("serviceWorker" in navigator)) return "Browser kann keine Service Worker";
    const reg = await navigator.serviceWorker.register(
      new URL("abschottung.js", location), { scope: "./" });
    await navigator.serviceWorker.ready;
    return reg.active ? "angemeldet" : "wird eingerichtet";
  };
}
