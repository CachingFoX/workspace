import pandas as pd
import json
import sys
from pathlib import Path

def xlsx_to_json(input_path, output_path=None, exclude=None, rename=None):
    """
    Liest eine Excel-Datei ein und schreibt sie als JSON.

    Args:
        input_path (str): Pfad zur Excel-Datei (.xlsx)
        output_path (str): Pfad zur Ausgabedatei (.json); wenn None, wird <input>.json verwendet
        exclude (list[str]): Spaltennamen, die nicht im JSON erscheinen sollen
        rename (dict[str, str]): Mapping alter → neuer Spaltennamen
    """

    input_path = Path(input_path)
    output_path = Path(output_path) if output_path else input_path.with_suffix(".json")

    # Excel einlesen (erste Tabelle)
    df = pd.read_excel(input_path, dtype=str)  # alles als String, um JSON konsistent zu halten

    # Spalten ausschließen
    if exclude:
        df = df.drop(columns=[col for col in exclude if col in df.columns])

    df = df.dropna(subset=["Public Code"])
    
    # df = df.drop(columns=[col for col in ["Public Code", "TBCode", "Freischaltcode"] if col in df.columns])

    

    # Spalten umbenennen
    if rename:
        df = df.rename(columns=rename)

    # NaN durch leere Strings ersetzen
    df = df.fillna("")

    # JSON exportieren
    json_str = df.to_json(orient="records", force_ascii=False, indent=2)
    json_str = "const trackables = " + json_str + ";\nexport { trackables };\n\n"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(json_str)

    print(f"✅ JSON gespeichert unter: {output_path}")

if __name__ == "__main__":
    # Beispielaufruf:
    # python xlsx_to_json.py myfile.xlsx
    #
    # Du kannst auch direkt im Code unten konfigurieren:
    input_file = sys.argv[1] if len(sys.argv) > 1 else "geocoins-neu.xlsm"

    exclude_cols = ["Icon","Type Id","Aktiviert","Form allgemein","Form spezifisch",
    "XXX","Farben","Designer","Ablaeg intern","Preis"]
    
    rename_cols = {
        "Name": "name",
        "Ursprünglicher Name": "originName",
        "Datum": "updated",
        "IconUrl": "iconURL",
        "Tags": "tagsString",
        "Sammlungen": "collectionsString",
        "Notiz": "note",
        "Public Code": "publicCode",
        "TBCode": "privateCode",
        "Freischaltcode": "activateCode",
        "Besitzer": "owner",
        "Besitzer2": "owner2",
        "Hauptbild": "mainPicture",
        "Type": "type",
        "Material": "material",
        "Edition": "edition",
        "PIN": "pin"
    }
    
    xlsx_to_json(input_file, output_path="./src/trackables.js", exclude=exclude_cols, rename=rename_cols)
