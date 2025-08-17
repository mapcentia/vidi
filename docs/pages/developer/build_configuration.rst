.. _configjs:

Systemkonfiguration
===========================================================================

.. topic:: Overview

    :Forfattere: `giovanniborella <https://github.com/giovanniborella>`_ | `mapcentia <https://github.com/mapcentia>`_

.. contents:: 
    :depth: 4

Vidi skal konfigureres inden opstart. Denne konfiguration kan indeholde information om hvilke extensions, der skal indlæses, hvilke print-skabeloner der er tilgængelige med mere.

Laves der en ændring, skal vidi startes igen.

Vidi styres af ``config.js``. Denne fil vil være at finde i ``./vidi/config/``.

Herunder er alle de nøgler der kan anvendes i ``config.js`` beskrevet. Bemærk at der kan være nøgler der ikke er beskrevet her, da de ikke er blevet tilføjet endnu.

.. _configjs_puppeteerprocesses:

puppeteerProcesses
---------------------------------------------------------------------------

``puppeteerProcesses`` er en blok der indeholder opsætning af puppeteer-processer. 

``puppeteerProcesses`` indeholder to nøgler: ``min`` og ``max``.

``min`` angiver hvor mange puppeteer-processer der skal være tilgængelige ved opstart. ``max`` angiver det maksimale antal processer der kan være tilgængelige.

Denne blok styrer hvor mange arbejdere der kan være forbindet til print-køen. 

Hvis man sætter ``"min": 0`` vil der ikke køre processer i baggrunden, og der skal startes en puppeteer op fra bunden. Denn "cold-start" kan tage flere sekunder.

Antallet af varme puppeteer-instanser vil have en effekt på systemets RAM forbrug.

.. code-block:: json

    "puppeteerProcesses": {
        "min": 1,
        "max": 2
    },

.. _configjs_print:

print
---------------------------------------------------------------------------

Denne nøgle indeholder opsætningen af print. Den består af underdele som alle er obligatoriske. 


.. _configjs_scales:

scales
---------------------------------------------------------------------------

``scales`` er en array af heltal der definérer hvilke zoom-forhold det er muligt at lave print i.

Herunder er et eksempel på en opsætning der kun giver mulighed for print i ``1000``, ``2000`` og ``10000``

.. code-block:: json

    "scales": [1000, 2000, 10000]

.. _configjs_print_timeout:

timeout
---------------------------------------------------------------------------

``timeout`` er en integer der angiver hvor lang tid der må gå før print-processen stopper sig selv. Det kan være nødvendigt at øge denne værdi hvis man ønsker at printe i større formater som A1 eller over. 

``timeout`` er i ms og default er 60000.

.. _configjs_configurl:

configUrl
---------------------------------------------------------------------------

HTTP server hvor eksterne resourcer findes. Resourcer kan være:

* :ref:`Kørselskonfigurationer<configjson>`
* :ref:`Templates<configjs_template>`
* :ref:`CSS filer<configjs_cssfiles>`

.. code-block:: json

    "configUrl": "https://mapcentia.github.io/vidi_configs",

Der kan angives forskellige URLer til forskellige databaser. ``_default`` betyder alle andre.

.. code-block:: json

    "configUrl": {
        "mydb": "https://mapcentia.github.io/vidi_configs_for_mydb",
        "_default": "https://mdapcentia.github.io/vidi_configs_default"
    },

.. _configjs_leftslidewidths:

leftSlideWidths
---------------------------------------------------------------------------

Angivelse af bredder i det venstre slide-ud panel i default template.

Tallene angiver brededer i hhv. phone, tablet og desktop.

.. code-block:: json

    "leftSlideWidths": [300, 400, 550]

.. _configjs_df:

df
---------------------------------------------------------------------------

Til WMS baggrundskort fra Datafordeler og Dataforsyningen kan der anvendes en proxy, som til dels fixer et problem med Datafordeler og til dels kan forsyne kaldene med brugernavn/kodeord eller token, så disse ikke bliver eksponeret til Vidi brugerne.

* ``redirect`` Angiver om modulet skal omstille kaldene til Datafordeler og Dataforsyningen, eller klienten skal vente på svaret fra services. default er false.

Det er kun nødvendig at angive enten username/password eller token. Token har forrang hvis begge er angivet:

.. code-block:: json

    "df": {
        "datafordeler" : {
            "username": "....",
            "password": "....",
            "token": "...."
        },
        "dataforsyningen" : {
            "username": "....",
            "password": "....",
            "token": "...."
        },
        "redirect": false
    }

Se i Kørselskonfigurationen :ref:`configjs_baselayers` hvordan WMS'er fra Datafordeler og Dataforsyningen kan anvendes

.. _configjs_extensions:

extensions
---------------------------------------------------------------------------

For at tilføje en extension til Vidi, skal der tilføjes en blok i ``extensions``. Der skal angives hvilke filer der skal bygges ind i vidi.

Da alle extensions er forskellige i opbygning, kan det være nødvendigt at tilføje den til både ``browser`` og ``server``. Når den enkelte extension er bygget, kan den aktiveres i :ref:`configjs_enabledExtensions`. 

.. code-block:: json

    "extensions": {
        "browser": [
            {"directions": ["index"]},
        ],
        "server": [
            {"directions": ["index"]},
        ]
    },

.. _configjs_urlsIgnoredForCaching:

urlsIgnoredForCaching
---------------------------------------------------------------------------

For at tilføje en extension til Vidi, skal der tilføjes en blok i ``extensions``. Der skal angives hvilke filer der skal bygges ind i vidi.

Da alle extensions er forskellige i opbygning, kan det være nødvendigt at tilføje den til både ``browser`` og ``server``. Når den enkelte extension er bygget, kan den aktiveres i :ref:`configjs_enabledExtensions`. 

.. code-block:: json

      "urlsIgnoredForCaching": [
    {
      "regExp": true,
      "requested": "services.hxgncontent.com"
    },
    {
      "regExp": true,
      "requested": "socket\\.io"
    }
  ],

Komplet eksempel
---------------------------------------------------------------------------

For at se et komplet eksempel på en konfiguration henvises til default config i repo. `Den kan du finde her <https://github.com/mapcentia/vidi/blob/master/docker/stable/conf/vidi/config.js>`_
