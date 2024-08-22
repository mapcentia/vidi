# BlueIdea / Lukkeliste

Dette modul gør det muligt at udpege adresser, og sende dem direkte til BlueIdea. Denne logik kan udbygges med at finde adresser på baggrund af eksisterende ledningsnet. Opsætningen af denne er dog mere omstændig, og kræver at der er en database med et sundt ledningsnet.

## Flow

Flowet er som følger:

1. Bruger starter modulet
   a. Er brugeren ikke logget ind i vidi, gives mulighed for login
2. Brugeren udpeger områder (sendes til `draw` modulet) eller brugeren udpeger et punkt i forhold til ledningsnettet.
   a. For at brugeren kan udpege punkter i forhold til ledningsnettet, skal brugeren være opsat som beskrevet herunder.
3. Når der er udpeget områder eller punkter, sendes de tilbage til `blueidea` modulet, hvor der søges på matrikler og de adresser der er koblet på dem.
4. Efter der er fundet adresser, kan brugeren vælge at

## Opsætning

Der er flere dele i opsætningen af denne extension. Da den både skal håndtere credentials og databaseafhængigheder, er det vigtigt at følge nedenstående punkter. Modulet kan opsættes i følgende konfigurationer:

- Kun BlueIdea
  - lukkeliste er `false`
  - blueidea er `true`, samt username + password
- Kun Lukkeliste
  - lukkeliste er `true`, samt `ventil_layer`, `ventil_layer_key` og `udpeg_layer`
  - blueidea er `false`
- BlueIdea og Lukkeliste
  - lukkeliste er `true`, samt `ventil_layer`, `ventil_layer_key` og `udpeg_layer`
  - blueidea er `true`, samt username + password

### Vidi

Der skal oprettes en configurationsfil som nedenunder. Denne skal placeres i `config/gp/config.blueidea.js`.

Filen indlæses ved load af vidi, så enhver ændring i filen kræver en genstart af servicen.

```js
module.exports = {
  debug: true,
  hostname: "https://api.sms-service.dk/",
  users: {
    "d7a12844-5fc9-4316-9af7-b841fcc3d399": {
      username: "superuser",
      password: "supersecret",
      profileid: {
        3793: "profilnavn i selection",
      },
      lukkeliste: true,
      blueidea: true,
      ventil_layer: "ledningsplan_fjv.ventil",
      ventil_layer_key: "ventilid",
      udpeg_layer: "ledningsplan_fjv.vw_centerlinje",
      alarmkabel: true,
    },
  },
};
```

| Property | Type   | Description                       |
| -------- | ------ | --------------------------------- |
| hostname | string | blueidea hostname                 |
| users    | object | bruger konfiguration, se herunder |

| Property         | Type    | Default | Description                                                                                                                |
| ---------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| debug            | boolean |         | styrer om beskeder i blueidea sættes som testmode                                                                          |
| username         | string  |         | blueidea brugernavn                                                                                                        |
| password         | string  |         | blueidea adgangskode                                                                                                       |
| blueidea         | boolean | `False` | om brugeren skal have adgang til blueidea-værktøjerne                                                                      |
| lukkeliste       | boolean | `False` | om brugeren skal have adgang til lukkeliste-værktøjerne                                                                    |
| profileid        | obj     |         | objekt med profilid & alias                                                                                                |
| ventil_layer     | string  |         | navnet på layeret hvor ventil-lukkeliste skal findes                                                                       |
| ventil_layer_key | string  |         | navnet på kolonnen som skal filtreres på                                                                                   |
| udpeg_layer      | string  |         | navnet på lag som skal tændes når man vil udpegde i lukkeliste                                                             |
| ventil_export    | obj     |         | objekt med opsætning af ventil-eksport. key er kolonnenavnet og value er hvilken kolonne der trækkes fra på `ventil_layer` |
| alarmkabel       | boolean | `False` | om brugeren skal have adgang til alarmkabel-værktøjerne                                                                    |
| alarm_skab       | obj     |         | objekt med opsætning af alarmskabe                                                                                         |

Alarm_skab:

| Property | Type   | Default | Description                                                                     |
| -------- | ------ | ------- | ------------------------------------------------------------------------------- |
| layer    | string |         | navnet på laget der benyttes til alarm-beregning hvor alarmkablerne skal findes |
| key      | string |         | kolonnenavn på `layer` som skal bruges til at finde alarmkablerne               |
| name     | string |         | SQL udtryk der bruges til at finde teksten til dropdown                         |
| geom     | string |         | kolonnenavn på `layer` som indeholder geometrien                                |

Der skal ligeledes laves en opsætning af extension i kørselsmiljøet. Se nedenfor.

Denne extension afhænger af `session` extensionen, så den skal også være loaded.

```json
{
  "brandName": "Lukkeliste",
  "enabledExtensions": ["session", "blueidea"],
  "extensionConfig": {
    "blueidea": {
      "userid": "d7a12844-5fc9-4316-9af7-b841fcc3d399",
      "alarmkabel_distance": 75
    }
  }
}
```

| Property            | Type | Default | Description                                        |
| ------------------- | ---- | ------- | -------------------------------------------------- |
| user                | guid |         | direkte reference til server-konfiguration         |
| alarmkabel_distance | int  | 100     | afstand i meter fra udpeget punkt til alarmvisning |

### GC2

Den bruger der tænkes at bruge lukkeliste-værktøjerne skal have en rolle med læse- og skriveadgang til tabellerne:

- `lukkeliste.beregn_ventiler`
- `lukkeliste.beregn_afskaaretmatrikler`
- `lukkeliste.beregn_afskaaretnet`
- `lukkeliste.beregnlog`
- `lukkeliste.lukkestatus`
- _*Lag der er defineret i `alarm_skab`_