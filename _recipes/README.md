# Wie man Rezepte für _rezepte.ttst.de_ schreibt

Zunächst werden Rezepte dynamisch beim Seitenaufruf geladen, ist also ein Rezept
auf dem Server im **REZEPTE** Ordner, wird es sowohl in der Navigation links,
als auch beim Aufruf verfügbar sein.

Es werden automatisch alle Rezepte erkannt, die auf `.rezept.txt` enden. Diese
werden dann von einem PHP Skript gefunden und an den Client gesendet.

Die Seite bleibt stets auf der index Datei und wird lediglich durch den Query
Parameter gesteuert. Ist in der Query das Attribut `recipe` vertreten, wird das
erste hier von als Rezeptauswahl betrachtet. Das angezeigte Rezept ist dann aus
der Query der dekodierte Eintrag.

## How to .rezept.txt

Rezeptdateien folgen einem .ini-ähnlichen Format. Sie haben Segmente, aus denen
dann die einzelnen Informationen für das Rezept ausgelesen werden.

Zunächst aber repräsentiert der Dateiname auch den Rezeptnamen.
`Dinkelbrötchen.rezept.txt` ist dann das Rezept für Dinkelbrötchen.

In einer Rezeptdatei sind lediglich Zutaten und Zubereitung notwendig. Die
anderen Segmente sind optional.

### [Zutaten]

In Zutaten werden die Zutaten eines Rezepts aufgelistet. Eine Zutat hat folgende
Schema: `<Anzahl>;<Einheit>;<Name der Zutat>`. Der Name der Zutat ist notwendig,
die Anzahl und die Einheit optional. Ist aber eine Einheit angegeben, wird eine
Anzahl erwartet.

Beispiel gültiger Zutaten:

```
10;g;Zucker
2;Päckchen;Schokolade
1;;Karotte
1/4;Tüte;Backpulver
;;etwas Wasser
```

Zu dem können Zutaten zu Gruppen zugeordnet werden, dafür muss vor der Gruppe an
Zutaten ein Bezeichner für diese Gruppe alleine stehen. Zutaten, die unter
keiner Gruppe stehen, werden ohne Gruppe dargestellt.

Beispiel zu Gruppen:

```
1;;Karotte
1;;Apfel
Gewürze
1;Prise;Zucker
;;etwas Salz
Optional
;;Chilipulver
```

> 1 Karotte\
> 1 Apfel\
> <br> **Gewürze**\
> 1 Prise Zucker\
> etwas Salz\
> <br> **Optional**\
> Chilipulver

### [Zubereitung]

Das Segment der Zubereitung erwartet einen Markdown Text, der auch direkte HTML
Element beinhalten darf. Mehr zu
[Markdown hier](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

Bei Bildern gilt zusätzlich noch, dass der Pfad nur verkürzt angeben werden
muss. Also für Bilder der Form `![alt text](bild link)`, sollte bei dem Bild
Link lediglich der Name des Bildes angegeben werden. Der Pfad wird dann
automatisch ergänzt. So wird dann `Pizza.jpg` zu `.recipes/img/Pizza/Pizza.jpg`.

### [Resultatbild]

Hier wird nur der Name des Bildes erwartet. Das Resultatbild wird gesondert,
oben auf dem Rezept angezeigt.

Ähnlich wie in der Zubereitung wird der Bildname automatisch um den Restpfad
ergänzt.

### [Inspiration]

Hier wird eine Zeile erwartet, die einen vollständigen Link enthält. Dieser Link
wird dann als Ziel für den Inspirationsbutton gesetzt.

### [PDF]

Hier wird der Name der .pdf erwartet, die zu dem jeweiligen Rezept gehört. Die
PDF sollte dann im Ordner `.recipes/pdf` liegen.
