.. _configjson:

#################################################################
Kørselskonfiguration (configs)
#################################################################

.. topic:: Overview

    :Date: |today|
    :Vidi-version: 2020.11.0
    :Forfattere: `giovanniborella <https://github.com/giovanniborella>`_ | `mapcentia <https://github.com/mapcentia>`_

.. contents:: 
    :depth: 4

Når vidi startes i browseren læses værdier ind fra :ref:`configjs`. I flere tilfælde kan denne konfiguration ændres til eksempelvis at inkludere bestemte extensions, eller print-templates.

Vidi startes med en URL som denne (uden fragments [#fragment]_):

``https://vidi.dk/app/mindb/?config=minconfig.json``

Som kan læses sådan:

``https://<host>/app/<database>/?config=<kørselskonfiguration>.json``

.. _configjs_schemata:

schemata
*****************************************************************

Her angives hvilke lag, der skal hente ind i lagtræet. Der er tre måder at angive på:

* *Schema*. Alle lag i schemaet.
* *Lag*. Et enkelt lag.
* *Tag*. Alle lag med taggen.

De tre måder kan kombineres.

.. code-block:: json

    "schemata": [
        "my_schema",
        "my_schema.my_layer",
        "tag:my_tag_1",
        "tag:my_tag_2"
    ],

.. note::
    Lag skal være placeret i en laggruppe for at kunne hentes ind. Dette gøres i GC2 Admin.


.. _configjs_enabledextensions:

enabledExtensions
*****************************************************************

Her angives hvilke extensions, som skal aktiveres.

.. code-block:: json

    "enabledExtensions": [
        "conflictSearch",
        "streetView",
        "session",
        "coordinates",
        "offlineMap",
        "editor",
        "configSwitcher",
        "embed"
    ],

.. _configjs_extensionconfig:

extensionConfig
*****************************************************************

Her kan opsætningen af de enkelte extensions laves. Det er ikke alle extensions, som har sine egne indstillinger.

Opsætningen sker efter følgende princip:

.. code-block:: json

    "extensionConfig": {
        "extensionNavn1": {},
        "extensionNavn2": {}
    }

Her følger hvordan de enkelte extensions kan opsættes (Pt. omfatter denne del af dokumentationen ikke alle extensions)

.. code-block:: json

    "extensionConfig": {
        "streetView": {
            "cowi": "https://cmv.cowi.com/?...",
            "mapillary": "https://mapillary.com/app/?..."
        "embed": {
            "slideOutLayerTree": true,
            "expandFirstInLayerTree": true
        },
        "symbols": {
            "files": [
                {"file": "symbolset1.json", "title": "Symbolsæt 1"},
                {"file": "symbolset2.json", "title": "Symbolsæt 2"}
            ],
            "options": {
                "scale": true,
                "rotate": true,
                "delete": true,
                "callback": "function(file, state, operation){alert('Et symbol placeret')}",
                "validate": "function(file, group, state){return true}"
            },
            "symbolOptions": {
                "symbol34.svg": {
                    "onlyOne": true,
                    "rotate": false,
                    "callback": "function(file, state, operation){alert('Symbol 34 placeret')}"
                }
            }
        }
    }



.. _configjs_enabledprints:

enabledPrints
*****************************************************************

Her angives hvilke print-templates der skal være adgang til. Angives flere end én kan brugeren vælge mellem dem i print-dialogen.

.. code-block:: json

    "enabledPrints": ["print", "print_sagsbehandler"],

.. _configjs_enabledsearch:

enabledSearch
*****************************************************************

Her angives hvilket søgemodul, der skal være aktiveret. Pt. er der to standard moduler:

* ``danish`` Søgning på danske adresser, jordstykker og ejendomme
* ``google`` Google's Place Search (kræver Google API Key. Se :ref:`configjs_searchconfig`)

.. code-block:: json

    "enabledSearch": "danish",

.. _configjs_searchconfig:

searchConfig
*****************************************************************

Her kan det valgte søgemodul konfigureres.

* ``size`` Hvor mange forslag skal der vises.
* ``komkode`` Hvilket eller hvilke kommunekoder skal søgningen omfatte. Angives enten som "851", ["851", "727"] eller "*"
* ``esrSearchActive`` Aktiver søgning på esr ejendomsnummer
* ``sfeSearchActive`` Aktiver søgning på sfe ejendomsnummer
* ``placeholderText`` Udskift standard-teksten med en anden
* ``google`` Google API key.

.. code-block:: json

    "searchConfig": {
        "size": 10,
        "komkode": "851",
        "esrSearchActive": true,
        "sfeSearchActive": true,
        "placeholderText": "Søg på et eller andet",
        "google": {"apiKey": "abc123"}
    },

.. note::
    Indstillerne har kun indflydelse på "danish" søgemodulet Kun "google" vedrører Google Place Search og behøver ikke udfyldes, hvis det ikke bruges. Google API kan også sættes i GC2.

.. _configjs_template:

template
*****************************************************************

Her angives hvilken template, som skal bruges. Angives det ikke, bruges standard-templaten ``default.tmpl``.
Egne Templates kan placeres på egen server ved angivelse af :ref:`configUrl<configjs_configurl>` indstillingen.

.. code-block:: json

    "template": "default.tmpl",

.. _configjs_brandname:

brandName
*****************************************************************

Her kan sættes en tekst som placeres vha. en placeholder i templates.

.. code-block:: json

    "brandName": "Mit brandnavn",

.. _configjs_baselayers:

baseLayers
*****************************************************************

Opsætning af tilgængelige base layers kan ske på fire forskellige metoder:

* Indbyggede lag
* WMS lag
* XYZ lag
* GC2 lag

.. code-block:: json

    "baseLayers": [
        {"id": "osm", "name": "Open Street Map"},
        {"id": "stamenToner", "name": "Stamen Toner"},
        {"id": "stamenTonerLite", "name": "Stamen Toner Light"},
        {"id": "bingRoad", "name": "Bing Road"},
        {"id": "bingAerial", "name": "Bing Aerial"},
        {"id": "hereNormalDay", "name": "HERE Normal Day"},
        {"id": "hereNormalDayGrey", "name": "HERE Normal Day Grey"},
        {"id": "hereNormalNightGrey", "name": "HERE Normal Night Grey"},
        {"id": "hereSatelliteDay", "name": "HERE Satellite Day"},
        {"id": "hereHybridDay", "name": "HERE Hybrid Day"},
        {"id": "googleStreets", "name": "Google Streets"},
        {"id": "googleHybrid", "name": "Google Hybrid"},
        {"id": "googleSatellite", "name": "Google Satellite"},
        {"id": "googleTerrain", "name": "Google Terrain"},
        {
            "type": "wms",
            "url": "https://services.kortforsyningen.dk/service?SERVICENAME=forvaltning2&token=abc123&",
            "layers": ["Basis_kort", "Navne_basis_kort", "Husnummer"],
            "id": "Basis_kort",
            "name": "Forvaltningskort",
            "description": "Basis_kort",
            "attribution": "Styrelsen for Dataforsyning og Effektivisering",
            "minZoom": 8,
            "maxZoom": 22,
            "maxNativeZoom": 22
        },
        {
            "type": "XYZ",
            "url": "https://m3.mapserver.mapy.cz/base-m/{z}-{x}-{y}?s=0.3&dm=Luminosity",
            "id": "mapy",
            "name": "Mapy",
            "description": "Kort fra Mapy",
            "attribution": "Mapy",
            "minZoom": 8,
            "maxZoom": 20,
            "maxNativeZoom": 19
        },
        {
            "type": "gc2",
            "id": "geodk.bright-01052019",
            "name": "GeoDanmark kort",
            "db": "baselayers",
            "host": "https://dk.gc2.io",
            "config": {
                "minZoom": 8,
                "maxZoom": 30,
                "maxNativeZoom": 26,
                "attribution": "&copy; SDFE & MapCentia ApS"
            }
        }
    ],

Til WMS baggrundskort fra Datafordeler og Dataforsyningen kan der anvendes en proxy, som til dels fixer et problem med Datafordeler og til dels kan forsyne kaldene med brugernavn/kodeord eller token, så disse ikke bliver eksponeret til Vidi brugerne.

Se hvordan bruger-information opsættes i Systemkonfigurationen :ref:`configjs_df`

Derefter kan WMS'er opsættes således. Fx hvis man ønsker at anvende:

``https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/WMS``

skal "url" angives til:

``/api/datafordeler/GeoDanmarkOrto/orto_foraar/1.0.0/WMS``

Vidi sørger så for at tilføje bruger-infomationen og tilrette URL.

.. code-block:: json

    "baseLayers": [
        {
            "type": "wms",
            "url": "/api/datafordeler/GeoDanmarkOrto/orto_foraar/1.0.0/WMS",
            "layers": ["geodanmark_2020_12_5cm"],
            "id": "geodanmark_2020_12_5cm",
            "name": "TEST geodanmark_2020_12_5cm",
            "description": "geodanmark_2020_12_5cm",
            "attribution": "Styrelsen for Dataforsyning og Effektivisering",
            "minZoom": 8,
            "maxZoom": 22,
            "maxNativeZoom": 22,
            "transparent": true
        },
        {
            "type": "wms",
            "url": "/api/dataforsyningen/topo_skaermkort_DAF",
            "layers": ["topo_skaermkort"],
            "id": "topo_skaermkort",
            "name": "TEST topo_skaermkort",
            "description": "geodanmark_2020_12_5cm",
            "attribution": "Styrelsen for Dataforsyning og Effektivisering",
            "minZoom": 8,
            "maxZoom": 22,
            "maxNativeZoom": 22,
            "transparent": true
        }
    ]

.. note::
    HERE, Bing og Google Maps kræver API nøgle opsat i GC2. Google Maps fungerer på en anden måde end andre lag og langt fra optimalt. Fx kan man ikke printe Google Maps.

.. _configjs_aboutbox:

aboutBox
*****************************************************************

Her kan sættes en tekst eller HTML som vises i About Box.

.. code-block:: json

    "aboutBox": "<p>Her kan der indsættes HTML</p>",

.. _configjs_startupmodal:

startUpModal
*****************************************************************

Hvis angivet, vil et modal-vindue vises ved opstart med tekst eller HTML. Vinduet kan skjules en gang eller for altid (indtil cookies nulstilles eller indeholdet ændres).

.. code-block:: json

    "startUpModal": "<p>Her kan der indsættes HTML</p>",

.. _configjs_startupmodalsupressiontemplates:

startupModalSupressionTemplates
*****************************************************************

:ref:`startUpModal <configjs_startupmodal>` kan undertrykkes ved udvalgte templates. Templates kan angives ved navn eller regular expression.

.. code-block:: json

    "startupModalSupressionTemplates": ["print.tmpl", "blank.tmpl", {
        "regularExpression": true,
        "name": "print_[\\w]+\\.tmpl"
    }],

.. _configjs_featureinfoonmap:

featureInfoTableOnMap
*****************************************************************

Når denne er sat til ``true`` vises feature-info tabellerne i en popup på kortet i stedet for i sidepanelet. Det gør indstillingen veleget til embed template.
Ved brug af "avanceret forespørgelse" vises tabellerne dog stadig i sidepanelet.

.. code-block:: json

    "featureInfoTableOnMap": true,

.. figure:: ../../../_media/feature-info-table-on-map.png
    :width: 400px
    :align: center
    :name: feature-info-table-on-map
    :figclass: align-center
|

.. note::
    Kan ikke anvendes i sammenhæng med :ref:`configjs_crossmultiselect`

.. _configjs_crossmultiselect:

crossMultiSelect
*****************************************************************

Når denne er sat til ``true`` vil feature info klik fange både raster- og vektor-lag og opstille de enkelte resultater i en "harmonika". Derved inddeles resultatet ikke efter hvilke lag de tilhører.
Overskrifterne har to dele:

* ``Accordion summery prefix`` En fritekst efter eget valg.
* ``Accordion summery`` En celle værdi, angivet med kolonnenavn.

Ovenstående sættes i GC2 Meta.

.. code-block:: json

    "crossMultiSelect": true,

.. figure:: ../../../_media/cross-multi-select.png
    :width: 400px
    :align: center
    :name: cross-multi-select
    :figclass: align-center
|

.. note::
    Hvis extension ``editor`` er aktiv vil ``crossMultiSelect`` bliver sat til ``false``.

.. _configjs_activatemaintab:

activateMainTab
*****************************************************************

Sæt hvilket modul, som skal være aktivt fra starten. Mulighederne er:

* search
* info
* layer
* baselayer
* legend
* draw
* state-snapshot
* print
* conflict
* streetView
* coordinates

.. code-block:: json

    "activateMainTab": "info"

.. _configjs_cssfiles:

cssFiles
*****************************************************************

Load eksterne CSS filer. Filerne skal placeres på en HTTP server, som forbindes til vha. :ref:`configUrl<configjs_configurl>`

.. code-block:: json

  "cssFiles": [
       "myStyles1.css",
       "myStyles2.css"
  ]

.. _configjs_dontuseadvancedbaselayerswitcher:

dontUseAdvancedBaseLayerSwitcher
*****************************************************************

Deaktiver dobbeltgrundskort funktionen.

.. code-block:: json

    "dontUseAdvancedBaseLayerSwitcher": true

.. _configjs_infoclickcursorstyle:

infoClickCursorStyle
*****************************************************************

Sæt hvilken CSS cursor style markøren skal have når feature-info modulet er aktivt. Default er "crosshair".

Andre muligheder kan ses `her <https://developer.mozilla.org/en-US/docs/Web/CSS/cursor>`_.

.. code-block:: json

    "infoClickCursorStyle": "crosshair"

.. _configjs_showlayergroupcheckboxes:

showLayerGroupCheckbox
*****************************************************************

Viser en tjekboks i hver lag-gruppe og under-gruppe, som tænder/slukker alle lag i den pågældende gruppe.

.. code-block:: json

    "showLayerGroupCheckbox": true

.. _configjs_activelayers:

activeLayers
*****************************************************************

Liste over lag, som skal tændes fra starten. Lag angives schema qualified og med evt. type præfiks (v:, mvt:, w:). De angivne lag behøver ikke at være includeret i :ref:`schemata<configjs_schemata>`. Hvis Vidi startes med et projekt link, vil denne konfiguration blive ignoreret.

.. code-block:: json

    "activeLayers": [
        "schema.lag1",
        "v:schema.lag2"
    ]


.. _configjs_removedisabledlayersfromLegend:

removeDisabledLayersFromLegend
*****************************************************************

Hvis sættes til true, så fjernes lag fra signaturforklaringen, når laget slukkes. Ellers forbliver det på signaturen, men tjekboksen bliver tom. Default er "false".

.. code-block:: json

    "removeDisabledLayersFromLegend": true

.. _configjs_autoPanPopup:

autoPanPopup
*****************************************************************

Denne indstilling bevirker, at når en pop-up åbnes, så panoreres kort således, at pop-up'en kommer indenfor kortets udsnit. Bemærk, at indstillingen helst skal sættes til "false", hvis der anvendes vektor-lag med dynamisk loading af data, fordi panoreringen evt. kan bevirke reload af data og derefter lukkes pop-up'en Default er "false".

.. code-block:: json

    "autoPanPopup": true

.. _configjs_vectorTable:

vectorTable
*****************************************************************

Denne indstilling styrer om :ref:`vektorlag tabellen<gc2mata_vectorsettings>` skal vises til højre for eller i bunden af kortet. Endvidere kan højde/bredde styres. Hvis positionen er sat til ``right``
vil kun ``width`` have effekt og tabellen vil altid fylde højden ud. Hvis position er sat til ``bottom`` vil kun ``height`` have effekt og bredden bliver den samme som kortet.
``width`` kan både være relativ ``%`` og absolute ``px`` mens ``height`` kun kan angives som absolute ``px``. Hvis ikke denne indstilling sættes bruges default værdier som vist nedenunder.

.. code-block:: json

    "vectorTable": {
        "position": "bottom",
        "width": "30%",
        "height": "250px"
    }

.. _configjs_initFunction:

initFunction
*****************************************************************

Her kan angives en JavaScript funktion, som bliver kørt når Vidi er klar. Funktionen skal skrives som en linje tekst startende med `function()` og den efterfølgende blok er den, som bliver eksekveret:

.. code-block:: json

    "initFunction": "function(){alert('Hello world')}"

.. _configjs_initZoomCenter:

initZoomCenter
*****************************************************************

Hvis sat vil Vidi starte op på det angivet zoom/center. Denne indstilling vil have forrang over zoom/center sat i URL og projekt-link. Kan fx anvendes til at sikre, at alle indlejrede kort starter med samme zoom/center.

Angives således `/z/x/y`. Dette svarer til det, der vises i Vidi URL'en.

.. code-block:: json

    "initZoomCenter": "/16/9.875/56.142"

.. rubric:: Fodnoter

.. _configjs_popupdraggable:

popupDraggable
*****************************************************************

Hvis sat til `true` kan man flytte feature-info pop-up'en på kortet.

.. code-block:: json

    "popupDraggable": false


.. [#fragment] Et fragment er den del af en URL der kommer efter `#`.
