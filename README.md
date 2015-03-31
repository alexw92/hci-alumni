# HCI - Alumni Portal Prototype Webseite

Prototypische Umsetzung des Alumni Portal der Universität Würzburg. Der Prototyp legt den Fokus auf die folgenden Use Cases:
> 1. Ein Besucher landet auf dem Alumni Portal und schaut sich zu Beginn um, welche Funktionalität und welchen Mehrwehrt ihm die Webseite bringt. (Use Case 1)
2. Aufgrund des Mehrwerts entscheidet er sich für eine Anmeldung auf dem Portal (Use Case 2)
3. Die Registrierung auf der Website beinhaltet eine notwendige Freischaltung des Accounts mittels E-Mail (Use Case 3)
4. Der Nutzer vergisst über die Zeit hinweg sein Passwort und möchte dieses via "Passwort zurücksetzen" zurück erlangen (Use Case 4)
5. Abschließend möchte der neu angemeldete Nutzer einen alten Kommilitonen auf dem Portal finden, um eventuell mit ihm in Kontakt zu treten (Use Case 5)

## Installationshinweise

* Stelle sicher, dass [node](https://nodejs.org/) mit [npm](https://www.npmjs.com/) installiert ist (NodeJS beinhaltet bereits den Paketmanager npm).
* Überprüfunge dazu, ob die Befehle `node` sowie `npm` in der Konsole ausführbar sind.
* Falls noch nicht geschehen, öffne ein Konsolenfenster.
* Führe den Befehl `npm install -g grunt-cli` aus.
* Wechsle in das Verzeichnis `Website` des Git Repository.
* Führe dort den Befehl `npm install` aus, so dass alle notwendigen Pakete installiert werden.
* Öffne ein zweites Konsolenfenster und wechsel in das Verzeichnis `Server` des Repository.
* Führe dort den Befehl `npm install` aus, um die notwendigen Pakete zu installieren.

Die Entwicklungs- und Build-Umgebung ist nun vollständig eingerichtet. Starte im Ordner `Website` mit `grunt serve` einen lokalen Webserver, der den aktuellen Prototypen des Alumni-Portals ausliefert. Nutze das zweite Konsolenfenster, um im Verzeichnis `Server` mit dem Befehl `node backend.js` das Backend mit Datenbank zu starten. Die Webseite ist nun unter [localhost:3000](http://localhost:3000) erreichbar.

## Verwendete Frameworks / Technologien

* `Grunt`: dient als Build System und bringt zudem einen lokalen Webserver inklusive Livereload mit sich
* `HTML5Boilerplate`: HTML5 Front-End Framework, welches die grundlegende Ordnerstruktur und derzeitige 'Best Practices' der Webentwicklung vereinheitlicht
* `Bootstrap`: Empfehlenswertes HTML, CSS und JavaScript Framework für Responsive Webdesign und Mobile First
* `identity-generator`: JavaScript-Modul zum Generieren von zufälligen Testnutzern als Basispopulation der Datenbank
* `Node.js`: Ermöglicht serverseitige Entwicklung in JavaScript
* Erweiterungen/Module für Node.js:
	- `body-parser`: Parst den Body von HTTP-Requests in ein JavaScript-Objekt
	- `chance`: Zufallsgenerator für Zahlen und Strings
	- `emailjs`: JavaScript-Framework zum Versenden von Mails
	- `express`: Erlaubt den Aufbau von Website-Backends in JavaScript
	- `jssha`: Modul für SHA-Hashes in JavaScript
	- `sql.js`: SQLite Datenbank auf Basis von JavaScript