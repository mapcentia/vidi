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

Funktionen skal medtages i :ref:`configjs_extensions`

.. code-block:: js

    extensions: {
        browser: [
           {conflictSearch: ["index", "reportRender", "infoClick", "controller"]}
        ],
        server: [
            {conflictSearch: ["index"]}
        ]
    },

Brug
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Aktiveres i config:

.. code-block:: json

    "enabledExtensions": [
        "conflictSearch"
    ]

Opsætning
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Mulige værdier og deres defaults i config:
-----------------------------------------------------------------

.. code-block:: json

    "extensionConfig": {
        "conflictSearch": {
            "startBuffer": 0,
            "getProperty": false,
            "searchString": "",
            "searchLoadedLayers": true
        }
    }

* ``startBuffer`` Størelse på bufferen fra starten (m)
* ``getProperty`` Skal adresse/matrikel-søgning foretages med den samlede ejendom?
* ``searchString`` Hvilke lag skal der søges på? Kan være schema, tag eller lag (fx ``"tag:konflikt"``)
* ``searchLoadedLayers`` Skal lag i lagtræet altid medtages?


Opsætning med GC2 Meta data
-----------------------------------------------------------------

**Short description**

Kort beskrivelse til "Data fra konflikter" og PDF rapport.

**Long description**

Lang beskrivelse til "Data fra konflikter" og PDF rapport.

**Buffer**

Individuel buffer på laget.

**Analyse**

Ekstra analyse af som køres på laget indenfor konfliktområdet. Dette angives som en SQL, der returnerer et "2D" JSON objekt.

Her er et eksempel på en SQL, som finder det totale, største og míndste areal i et pylogon lag.
Der bliver dannet en række (row). Man kan selvfølgelig "group" over et felt i tabellen, så der bliver dannet flere rækker:

.. code-block:: sql

    SELECT json_object_agg(row, json_build_object(
            'Total areal (m2)', round(total_areal),
            'Mindste (m2)',  round(min_areal),
            'Største (m2)',  round(max_areal)
                                      ))
    FROM (
             SELECT sum(st_area(the_geom)) AS total_areal,
                    min(st_area(the_geom)) as min_areal,
                    max(st_area(the_geom)) as max_areal,
                    1 as row
             FROM data.bygning
             WHERE @WHERE@
             GROUP BY row
         ) AS sub

**Analyse header**

Tekst til analyse tabellen.
