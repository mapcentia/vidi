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

Der er flere dele i opsætningen af denne extension. Da den både skal håndtere credentials og databaseafhængigheder, er det vigtigt at følge nedenstående punkter.

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
      profileid: 3793,
      lukkeliste: true,
      ventil_layer: "ledningsplan_fjv.ventil",
      ventil_layer_key: "ventilid",
      udpeg_layer: "ledningsplan_fjv.vw_centerlinje",
    },
  },
};
```

| Property | Type    | Description                                       |
| -------- | ------- | ------------------------------------------------- |
| debug    | boolean | styrer om beskeder i blueidea sættes som testmode |
| hostname | string  | blueidea hostname                                 |
| users    | object  | bruger konfiguration, se herunder                 |

| Property         | Type    | Description                                                    |
| ---------------- | ------- | -------------------------------------------------------------- |
| username         | string  | blueidea brugernavn                                            |
| password         | string  | blueidea adgangskode                                           |
| lukkeliste       | boolean | om brugeren skal have adgang til lukkeliste-værktøjerne        |
| profileid        | int     | blueidea profil id                                             |
| ventil_layer     | string  | navnet på layeret hvor ventil-lukkeliste skal findes           |
| ventil_layer_key | string  | navnet på kolonnen som skal filtreres på                       |
| udpeg_layer      | string  | navnet på lag som skal tændes når man vil udpegde i lukkeliste |

Der skal ligeledes laves en opsætning af extension i kørselsmiljøet. Se nedenfor.

Denne extension afhænger af `session` extensionen, så den skal også være loaded.

```json
{
  "brandName": "Lukkeliste",
  "enabledExtensions": ["session", "blueidea"],
  "extensionConfig": {
    "blueidea": {
      "userid": "d7a12844-5fc9-4316-9af7-b841fcc3d399"
    }
  }
}
```

Det noteres at `userid` er en reference til en bruger i `users` konfigurationen.

### GC2

Den bruger der tænkes at bruge lukkeliste-værktøjerne skal have en rolle med læse- og skriveadgang til tabellerne `lukkeliste.beregn_ventiler` og `lukkeliste.beregn_afskaaretmatrikler`.
