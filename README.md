# HCI - Alumni Portal Prototype Webseite

Prototypische Umsetzung des Alumni Portal der Universität Würzburg. Der Prototyp legt den Fokus auf die folgenden Use Cases:
> 1. Ein Besucher landet auf dem Alumni Portal und schaut sich zu Beginn um, welche Funktionalität und welchen Mehrwehrt ihm die Webseite bringt. (Use Case 1)
2. Aufgrund des Mehrwerts entscheidet er sich für eine Anmeldung auf dem Portal (Use Case 2)
3. Die Registrierung auf der Website beinhaltet eine notwendige Freischaltung des Accounts mittels E-Mail (Use Case 3)
4. Der Nutzer vergisst über die Zeit hinweg sein Passworrt und möchte dieses via "Passwort zurücksetzen" zurück erlangen (Use Case 4)
5. Abschließend möchte der neu angemeldete Nutzer einen alten Kommilitonen auf dem Portal finden, um eventuell mit ihm in Kontakt zu treten (Use Case 5)

## Installationshinweise

* Stelle sicher, dass du [node](https://nodejs.org/) mit [npm](https://www.npmjs.com/) installiert hast - NodeJS beinhaltet den Paketmanager npm
* Zur Überprüfung schau ob die Befehle `node` sowie `npm` in der Konsole ausführbar sind
* Falls noch nicht geschehen, öffne ein Konsolenfenster
* Führe den Befehle ```npm install -g grunt-cli``` aus
* Wechsel in das Verzeichnis `Webseite`des Git Repository
* Dort führst du den Befehl ```npm install``` aus, so dass alle notwendigen Pakete installiert werden

Die Entwicklungs- und Build-Umgebung ist nun vollständig eingerichtet. Mit `grunt serve` startest du einen lokalen Webserver der den aktuellen Prototypen des Alumni Portal ausliefert.

## Verwendete Frameworks / Technologien

* `Grunt`: dient als Build System und bringt zudem einen lokalen Webserver inklusive Livereload mit sich
* `HTML5Boilerplate`: HTML5 Front-End Framework, welches die grundlegende Ordnerstruktur und derzeitige 'Best Practices' der Webentwicklung vereinheitlicht
* `Bootstrap`: Empfehlenswertes HTML, CSS und JavaScript Framework für Responsive Webdesign und Mobile First
* `sql.js`: SQLite Datenbank auf Basis von JavaScript
