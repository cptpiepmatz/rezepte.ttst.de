use crate::ext::{Ingredient, Recipe};
use crate::gen_recipe_pdf_impl;
use indexmap::IndexMap;
use std::fs;
use std::fs::File;
use std::path::PathBuf;

static PREPARATION: &str = r#"Mehl, Kristallsalz und Zucker in eine Rührschüssel geben.
Die Hefe mit 150 ml Wasser in einem Shaker auflösen und hinzufügen.
Auf diese Art hat man keine Hefeklumpen, die nachher zu dicken Blasen auf dem
Boden führen.
Die restlichen 100 ml Wasser und das Olivenöl hinzufügen.
Den Esslöffel kann man dann gleich zum ersten Verrühren verwenden.
Den Teig gut 10 Minuten kräftig durchkneten, dass ein gleichmäßiger Teig
entsteht.
Die Rührschlüssel mit einem Geschirrtuch abdecken und den Teig 30 Minuten
gehen lassen.
![noch nicht aufgegangener Teig](_REZEPTE_/img/Pizza/Pizza1.jpg)
Die Zeit des Gehenlassens kann man gut für die Soße verwenden.
Die passierten Tomaten in eine Schüssel geben und nach Belieben mit
Kristallsalz, Pfeffer, Zucker, Basilikum und Oregano würzen.
Ich empfehle hier eine kräftige Würzung, Boden und Belag nehmen Geschmack auf.
Den Ofen ggf. schon mal auf 250°C Ober- und Unterhitze vorheizen.
![aufgegangener Teig](_REZEPTE_/img/Pizza/Pizza2.jpg)
Der Teig wiegt etwa 800 Gramm.
Den in vier Teile á ca. 200 Gramm portionieren.
Auf einer gut bemehlten Fläche den Teig so groß ausrollen, dass er auf einen
einfachen Teller passt.
4 EL Soße verteilen:
![Pizza auf einem Teller](_REZEPTE_/img/Pizza/Pizza3.jpg)
Pizza belegen und mit Käse bestreuen, fertig.
Die Pizza bei 250°C Ober- und Unterhitze für ca. 10 Minuten in den
**vorgeheizten** Backofen schieben.

Da wir selten mit alle Mann Pizza essen, ist der Teig etwas viel.
Ich rolle die Pizzen auf die Größe eines flachen Tellers aus, packe sie darauf,
verteile die Soße und friere sie dann so ein.
Nach 2 – 3 Stunden nehme ich die Pizzen wieder raus, verpacke sie in
Gefrierbeutel und stelle sie mit dem Teller wieder in die Truhe.
Am nächsten Morgen kann man die Teller wegnehmen, da passiert mit dem Boden
nichts mehr.
Wenn man die Pizza wieder auftaut, muss sie voll aufgetaut sein, sonst geht sie
nicht richtig auf.
Bei Raumtemperatur dauert es zwei Stunden, im Warmwasserbad nur eine ¾ Stunde.
Für das Wasserbad nehme ich ein kleines Backblech, lege die Pizza drauf und
lasse das Blech in einer großen Schüssel Wasser schwimmen. Die Pizza nicht im
Beutel auftauen, sie klebt dort sonst fest."#;

fn recipe() -> Recipe {
    Recipe {
        name: Some("Pizza".to_string()),
        result_image: Some("/_REZEPTE_/img/Pizza/Pizza3.jpg".to_string()),
        ingredients: Some(IndexMap::from([
            (
                "Boden".to_string(),
                vec![
                    Ingredient {
                        amount: Some(500.0),
                        unit: Some("g".to_string()),
                        description: Some("Dinkelmehl 630".to_string()),
                    },
                    Ingredient {
                        amount: Some(1.0),
                        unit: Some("Würfel".to_string()),
                        description: Some("Hefe".to_string()),
                    },
                    Ingredient {
                        amount: Some(250.0),
                        unit: Some("ml".to_string()),
                        description: Some("Wasser".to_string()),
                    },
                    Ingredient {
                        amount: Some(15.0),
                        unit: Some("g".to_string()),
                        description: Some("Kristallsalz".to_string()),
                    },
                    Ingredient {
                        amount: Some(1.0),
                        unit: Some("kleine Prise".to_string()),
                        description: Some("Zucker".to_string()),
                    },
                    Ingredient {
                        amount: Some(1.0),
                        unit: Some("EL".to_string()),
                        description: Some("Olivenöl".to_string()),
                    },
                ],
            ),
            (
                "Soße".to_string(),
                vec![
                    Ingredient {
                        amount: Some(500.0),
                        unit: Some("g".to_string()),
                        description: Some("passierte Tomaten".to_string()),
                    },
                    Ingredient {
                        amount: Some(1.0),
                        unit: Some("kleine Prise".to_string()),
                        description: Some("Zucker".to_string()),
                    },
                    Ingredient {
                        amount: None,
                        unit: None,
                        description: Some("Kristallsalz".to_string()),
                    },
                    Ingredient {
                        amount: None,
                        unit: None,
                        description: Some("Pfeffer".to_string()),
                    },
                    Ingredient {
                        amount: None,
                        unit: None,
                        description: Some("Basilikum, gerebelt".to_string()),
                    },
                    Ingredient {
                        amount: None,
                        unit: None,
                        description: Some("Oregano, gerebelt".to_string()),
                    },
                ],
            ),
        ])),
        preparation: Some(PREPARATION.to_string()),
        pdf: Some("/_REZEPTE_/pdf/Pizza.pdf".to_string()),
        inspiration: None,
    }
}

#[test]
fn gen_pizza_recipe_pdf() {
    let recipe = recipe();
    let test_dir = PathBuf::from("target/test");
    fs::create_dir_all(&test_dir).unwrap();

    let file_path = test_dir.join("Pizza.pdf");
    let file = File::create(file_path).unwrap();

    gen_recipe_pdf_impl(recipe, file).unwrap();
}
