.. _non_standard_extensions:

#################################################################
Ikke-standard extensions
#################################################################

.. topic:: Overview

    :Date: |today|
    :Author: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 3

*****************************************************************
Introduktion
*****************************************************************

Herunder findes dokumentation på nogle af de extensions, som ikke følger med Vidi som standard. Skal en af disse anvendes kræves det, at den bliver installeret.

*****************************************************************
Rejsetid (otp)
*****************************************************************

Rejsetid extensionen opsættes i en kørselskonfiguration (config) under :ref:`configjs_extensionconfig`

``routes`` er en liste med de grafer, som brugeren skal kunne vælge imellem i Vidi.

``default`` angiver start-værdier for de forskellige indstillinger i Vidi. Alle behøves ikke udfyldes. Hvis der undlades indstillinger, bliver der anvendt værdier, som svarer til de nedenunser viste.

``parameters`` angiver ekstra URL parametre, som skal sendes med til OTP serveren. Default bliver ingen parametre sat.

``helpText`` angiver den tekst, som skal vises i modulets hjælpefunktion. Default er en tom tekst.

.. code-block:: json

    {
        "extensionConfig": {
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
        }
    }
