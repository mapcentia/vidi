
.. _extensions_directions:

=================
Rutevejledning (directions)
=================

.. topic:: Overview

    :Vidi-version: UNRELEASED
    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 3

``directions`` er en udvidelse til vidi der giver mulighed for at lave rutevejledning i kortet. Der laves en rutevejledning fra brugerens position til et punkt på kortet. Det er i øjeblikket kun muligt at lave rutevejledning med Google Maps.

Installation
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""" 
 
Funktionen skal medtages i :ref:`configjs_extensions`

.. code-block:: js

    extensions: {
        browser: [
            {"directions": ["index"]},
        ],
    },

Konfiguration
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Der er ikke nogen konfiguration for denne extension. Den vil automatisk blive tilføjet til værktøjslinjen.

Brug
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""" 

.. figure:: ../../_media/extensions-directions-icon.png
    :align: center
    :figclass: align-center

    ikon i :ref:`gettingstarted_controls`

Start med at aktivere geolokation i :ref:`gettingstarted_controls` og klik på ikonet. Derefter klik på kortet for at vælge destinationen. Rutevejledningen vil åbne i et nyt vindue.