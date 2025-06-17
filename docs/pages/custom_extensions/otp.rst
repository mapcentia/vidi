
.. _extensions_otp:

Rutevejledning (otp)
===========================================================================

.. topic:: Overview

    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 3

Installation
---------------------------------------------------------------------------

Denne extension kræver yderligere installation som ikke er beskrevet her.

Funktionen skal medtages i :ref:`configjs_extensions`

.. code-block:: js

    extensions: {
        browser: [
            {"otp": ["index"]},
        ],
    },

Konfiguration
---------------------------------------------------------------------------

Der er ikke nogen konfiguration for denne extension. Den vil automatisk blive tilføjet til værktøjslinjen.

Følgende parametre kan anvendes i :ref:`configjs_extensionconfig`:

.. list-table::
   :widths: 30 20 50
   :header-rows: 1

   * - Parameter
     - Default value
     - Description
   * - ``routes``
     - ``["default"]``
     - En liste med de grafer, som brugeren skal kunne vælge imellem i Vidi.
   * - ``defaults``
     - 
     - Angiver start-værdier for de forskellige indstillinger i Vidi.
   * - ``defaults.startTime``
     - ``30``
     - Angiver start-tidspunktet i minutter fra nu.
   * - ``defaults.endTime``
     - ``50``
     - Angiver slut-tidspunktet i minutter fra nu.
   * - ``defaults.intervals``
     - ``[600, 1200, 1800]``
     - Tidsintervaller i sekunder.
   * - ``defaults.startColor``
     - ``"#ff0000"``
     - Farve for startpunkt.
   * - ``defaults.endColor``
     - ``"#00ff00"``
     - Farve for slutpunkt.
   * - ``defaults.opacity``
     - ``0.7``
     - Gennemsigtighed for ruter.
   * - ``defaults.arriveBy``
     - ``false``
     - Hvis sat til ``true``, beregnes rejsen baglæns fra ankomsttidspunktet.
   * - ``defaults.route``
     - ``"default"``
     - Standard-grafen, som skal anvendes.
   * - ``defaults.maxWalkDistance``
     - ``500``
     - Maksimal gåafstand i meter.
   * - ``parameters``
     - ``{}``
     - Ekstra URL parametre, som skal sendes med til OTP serveren.
   * - ``helpText``
     - ``""``
     - Tekst, som skal vises i modulets hjælpefunktion.

Eksempel på konfiguration:

.. code-block:: json
  
    "otp": {
        "routes": ["default", "nt", "midttrafik", "sydtrafik"],
        "defaults": {
            "startTime": 30,
            "endTime": 50,
            "intervals": [600, 1200, 1800],
            "startColor": "#ff0000",
            "endColor": "#00ff00",
            "opacity": 0.7,
            "arriveBy": false,
            "route": "default",
            "maxWalkDistance": 500
        },
        "parameters": {
            "offRoadDistanceMeters": "75",
            "precisionMeters": "100"
        },
        "helpText": "Hjælp til OTP"
    }

Brug
---------------------------------------------------------------------------

Brugen beskrives her.