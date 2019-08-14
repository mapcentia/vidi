# DocumentCreate

## Brug

Herunder er kort demo af grund-funktionaliteten.
![Flow demo](/extensions/documentCreate/doc/documentCreate_use.gif)

Vidi kan startes med `filterKey` som går direkte til indhold med filter på key. Eksempel: `/app/intranote/vmr/?config=dev_vmr.json&filterKey=Adelsvejen%202,%208930%20Randers%20NØ`

## Opsætning

### GC2

For at lagene bliver genkendt korrekt af extension skal lagene være sat op i GC2. Dette inkluderer nogle af valgmulighederne i drop-down mv. Herunder er de ting der skal være opsat.

* De aktive lag ska have det korrekte tag som også er sat i `config.json`
    ![GC2 meta](/extensions/documentCreate/doc/gc2_meta.png)

* Kolonner som skal have drop-down i klienten skal sættes op med mulighederne i dennes "Egenskaber". Eksempelvis `['Andet','Defekt dæksel','Stop i ledninger','Forurening','Vand i kælder eller hus','Huller i vej, fortov eller andet','Lugtgener','Grønt vedligehold','Skadedyr','Terrænoversvømmelse']`. Klienten vil overholde rækkefølgen af muligheder, og bruge den første streng som default-værdi.

* Skal klienten kunne zoome til de valgte skal søge-kolonnen vinges af i "Aktiver Filtrering"

* Tabeller bør være i EPSG:4326

### Server - config.js

Før Vidi kan genkende extension skal den bages. Der er oprettet et eksempel i `config/config.documentCreate.dev.js` - Her kan der også sættes client-værdier hvis man vil køre vidi uden config. Ændringer vil dog kræve at Vidi bliver builded.

* Extension skal loades i  `extensions`

    ```js
    "extensions": {
        "browser": [
            {"documentCreate":["index"]}
        ],
        "server": [
            {"documentCreate":["index"]}
        ]
    }
    ```

### Client - config.json

For at sikre at extension kan køre skal flg. egenskaber være sat i den aktive config-fil til klienten. Der er oprettet et eksempel i `public/api/intranote/dev_vmr.json`

* Extension skal slåes til i `enabledExtensions`

    ```json
    "enabledExtensions": [
      "documentCreate"
    ]
    ```

* Search skal opsættes for det aktive område

    ```json
    "enabledSearch": "danish",
    "searchConfig": {
      "komkode": [
        "730"
      ]
    }
    ```

* Hvis man ønsker at vidi skal starte op med extension aktiv:

    ```json
    "activateMainTab": "documentCreate"
    ```

* Extension skal konfigureres:

    ```json
    "extensionConfig": {
      "documentCreate": {
        "GC2key": "446be0f3af69b565ac769b78773fb892",                              \\ Bør fjernes og erstattes af session (sample)
        "GC2user": "vmr",                               \\ Bør fjernes og erstattes af session
        "maxZoom": 18,                                  \\ Zoom-niveau når der er fundet en adresse
        "metaTag": "documentCreate",                    \\ Lag med dette tag bliver brugt
        "tables": [                                     \\ Array med lag-opsætning
          {
            "table": "vand",                            \\ Lagnavn
            "optional": [],                             \\ Array kolonnenavne som er valgfrie (ikke implementeret)
            "defaults": {                               \\ Her sættes default-værdier pr. kolonne
              "henvendelsesdato": "_DATETIME",
              "sagsstatus": "Ny",
              "forsyningstype": "Vand",
              "adresse": "_SEARCH"
            },
            "hidden": [                                 \\ Array med navne som skal skjules
              "lat",
              "lng",
              "henvendelsesdato",
              "adresse",
              "forsyningstype",
              "sagsstatus"
            ],
            "geom_ext": {                               \\ Hvis denne findes bliver X/Y skrevet til kolonne
              "x": "lat",
              "y": "lng"
            },
            "filterCol": "adresse",                      \\ Kolonne der søges i med filter
            "filterExp": "="                             \\ Expression-type (for strenge '='|'<>'|'like')
          }
        ]
      }
    }
    ```

## Funktioner til default-værdier

Under defaults kan der sættes værdier som bliver erstatet når featuren bliver bygget. Disse værdier er *case-sensetive*. Funktionerne er beskrevet i `FeatureFormFactory`

| Værdi     | Eksempel                        | Beskrivelse                                                                |
|-----------|---------------------------------|----------------------------------------------------------------------------|
| _SEARCH   | `Adelsvejen 6, 8930 Randers NØ` | Her bliver værdien af feltet erstattet med indholdet i søgefeltet          |
| _DATETIME | `2019-08-14T06:58:19.904Z`      | Her bliver værdien af feltet erstattet med ISO-streng af den aktuelle tid. |
