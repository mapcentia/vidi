.. _extensions:

.. |gc2| raw:: html

  <abbr title="MapCentia Geocloud2">GC2</abbr>

*****************************************************************
Extensions
*****************************************************************

.. topic:: Overview

    :Date: |today|
    :Vidi-version: UNRELEASED
    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 3

.. _extensions_directions:

Rutevejledning
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``directions`` er en udvidelse til vidi der giver mulighed for at lave rutevejledning i kortet. Der laves en rutevejledning fra brugerens position til et punkt på kortet. Det er i øjeblikket kun muligt at lave rutevejledning med Google Maps.

Intallation
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Funktionen skal medtages i :ref:`configjs_extensions`

.. code-block:: js

    extensions: {
        browser: [
            {"directions": ["index"]},
        ],
    },


Brug
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

.. figure:: ../../_media/extensions-directions-icon.png
    :align: center
    :figclass: align-center

    ikon i :ref:`gettingstarted_controls`

Start med at aktivere geolokation i :ref:`gettingstarted_controls` og klik på ikonet. Derefter klik på kortet for at vælge destinationen. Rutevejledningen vil åbne i et nyt vindue.

Konfliktsøgeren
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Intallation
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Extensionen er med som standard.

Brug
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Aktiveres i config:

.. code-block:: json

    "enabledExtensions": [
        "conflictSearch"
    ]

Opsætning
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Mulige værdier og deres defaults:

.. code-block:: json

    "extensionConfig": {
        "conflictSearch": {
            "startBuffer": 0,
            "getProperty": false,
            "searchString": "",
            "searchLoadedLayers": true
        }
    },

