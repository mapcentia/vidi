.. _standardquerystring:

#################################################################
Standard query string
#################################################################

.. topic:: Overview

    :Date: |today|
    :Vidi-version: 2020.11.0
    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 4

Når Vidi starter kan man indsætte parametre i url'en som styre en række egenskaber.

initialFilter
*****************************************************************


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
