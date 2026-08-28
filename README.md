# Game Boy Advance SP – Zelda Edition (Web)

Eine Web-App, die Game-Boy- und Nintendo-64-Spiele in einem gezeichneten
Game Boy Advance SP der Zelda Edition spielt. Auf dem iPhone über
*Teilen → Zum Home-Bildschirm* wird daraus eine App mit eigenem Symbol,
im Vollbild und ohne Ablaufdatum.

## Spiele

Die App bringt **keine** Spiele mit. Über „Spiel hinzufügen" wählt man eigene
ROM-Dateien aus; sie werden in der Datenbank des Browsers auf dem Gerät
gespeichert und **nie hochgeladen**. Danach stehen sie im Auswahlbildschirm.

Unterstützt: `.gb`, `.gbc`, `.gba`, `.n64`, `.z64`, `.v64`, `.smc`, `.sfc`, `.nes`

## Bedienung

| | |
|---|---|
| Steuerkreuz | Auswahl bewegen; im Spiel Steuerkreuz, beim N64 der Analogstick |
| A | Spiel starten |
| Power-Schalter | zurück zur Auswahl |

## Aufbau

Das Gehäuse und die Knopf-Geometrie werden aus `shell.py` der zugehörigen
Fenster-App erzeugt (`python webapp.py`) – gezeichnet und getroffen wird aus
denselben Zahlen, damit beides nicht auseinanderläuft. Die Emulation kommt von
[EmulatorJS](https://emulatorjs.org).
