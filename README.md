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

## PlayStation-Controller

iOS koppelt DualShock 4 und DualSense selbst (Einstellungen → Bluetooth;
am Controller **Share + PS** gedrückt halten, bis die Leiste blinkt). Safari
meldet ihn im Standard-Layout, auch in der App vom Home-Bildschirm.

Die eingebaute Controller-Belegung von EmulatorJS wird dabei gelöst, sonst
kämen doppelte und widersprüchliche Eingaben an.

| Controller | Nintendo 64 | Game Boy / GBC / GBA |
|---|---|---|
| **Linker Stick** | Analogstick | Steuerkreuz |
| **Steuerkreuz** | Digitalkreuz (quer) bzw. Analogstick (hochkant) | Steuerkreuz |
| **Rechter Stick** | C-Kreuz | – |
| **Kreuz ✕** | A | A |
| **Kreis ○** | B | B |
| **Viereck □** | B | B |
| **Dreieck △** | C-oben (Ego-Sicht in Zelda) | A |
| **L1** | L | L |
| **R1** | R | R |
| **L2 / R2** | Z | L / R |
| **Options** | Start | Start |
| **Share** | – (N64 hat kein Select) | Select |
| **L3 / PS** | Menü öffnen und schließen | Menü |
| **Touchpad-Klick** | zurück zur Spielauswahl | zurück zur Spielauswahl |

Im Auswahlbildschirm bewegen Steuerkreuz und linker Stick die Auswahl,
**Kreuz ✕** oder **Options** startet.

## Tastatur (am Rechner)

Pfeiltasten = Steuerkreuz, **X** = A, **Y**/**Z** = B, **Enter** = Start.

## Aufbau

Das Gehäuse und die Knopf-Geometrie werden aus `shell.py` der zugehörigen
Fenster-App erzeugt (`python webapp.py`) – gezeichnet und getroffen wird aus
denselben Zahlen, damit beides nicht auseinanderläuft. Die Emulation kommt von
[EmulatorJS](https://emulatorjs.org).
