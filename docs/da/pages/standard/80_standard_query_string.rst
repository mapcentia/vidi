.. _standardquerystring:

#################################################################
Standard query string
#################################################################

.. topic:: Overview

    :Date: |today|
    :Vidi-version: 2022.8.4
    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 4

Når Vidi starter kan man indsætte parametre i url'en som styre en række egenskaber.

initialFilter
*****************************************************************

Denne parameter kan sætte filtre på lag således, at de er filtreret fra startet. Der kan sættes flere filtre på det samme lag og flere lag kan filtreres. Filtrede lag bliver aktiveret i vektor-udgave og der zoomes til filtrerede features på det sidst færdig-loadede lag.
Hvis laget ikke er udgivet i vektor-udgave, vil tile-udgaven tænde og der zoomes ikke.

Et filter objekt ser sådeles ud:

.. code-block:: json

    {
      "kommuneplan_2017.k_plan_rammer": {
        "match": "any",
        "columns": [
          {
            "fieldname": "id",
            "expression": "=",
            "value": "699737",
            "restriction": false
          }
        ]
      }
    }

Når det skal bruges i URL'en skal filter objektet Base64URL kodes. Det ligner dette:

.. code-block:: text

    ?initialFilter=ewogICJ0ZXN0Lm11bHRpcG9seWdvbiI6IHsKICAgICJtYXRjaCI6ICJhbn...

.. note::
    Base64URL er en afart af Base64, som ikke kan indeholde tegnene +=/ og er derfor "url sikker". https://www.npmjs.com/package/base64url
