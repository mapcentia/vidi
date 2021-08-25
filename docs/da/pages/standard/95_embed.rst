.. _embed:

#################################################################
Indlejring af Vidi på andre hjemmesider
#################################################################

.. topic:: Overview

    :Date: |today|
    :Vidi-version: UNRELEASED
    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 4

.. _embed_script:

*****************************************************************
Embed.js script
*****************************************************************

Vidi kan indlejres på en hjemmeside vha. embed.js scriptet. Dette script skal loades på hjemmesiden, hvor Vidi skal indlejres.

Scriptet skal ikke nødvendigvis hentes fra samme server, hvor Vidi findes. Man kan fx selv hoste scriptet eller placere det inline på sin hjemmeside.

.. code-block:: html

    <script src="https://vidi.swarm.gc2.io/js/embed.js"></script>

Scriptet kan både placeres i toppen og bunden af hjemmesiden.

.. _embed_div:

*****************************************************************
Indlejring af Vidi
*****************************************************************

Indlejring af Vidi sker ved at placere et ``div`` element på hjemmeside, hvor Vidi ønskes placeret. En række ``data`` attributer styrer hvordan kortet vises.

.. code-block:: html

    <div data-vidi-token="eyJ0aXRsZSI......" data-vidi-width="800px" data-vidi-height="600px"></div>

Der en række data attributer, som skal/kan sættes:

* **data-vidi-token (obligatorisk)**
 * Projektets "token" som indeholder state-id, host, database mv. Skal angives.
* **data-vidi-width (valgfri)**
 * Bredde på kort. Standard 100%
* **data-vidi-height (valgfri)**
 * Højde på kort. standard 100%
* **data-vidi-tmpl (valgfri)**
 * Hvilken template kortet skal bruge. Standard embed.tmpl, som er en template beregnet til indlejring.
* **data-vidi-search (valgfri)**
 * Kan sættes til "none" hvis søgeboksen skal skjules. Standard ikke sat.
* **data-vidi-history (valgfri)**
 * Kan sættes til "none" hvis forrige/næste udsnit kanpperne skal skjules. Standard ikke sat.
* **data-vidi-use-config (valgfri)**
 * Kan sættes til "true" og derved bruges config'en fra token, hvis den indeholder en config.
* **data-vidi-use-schema (valgfri)**
 * Kan sættes til "true" og derved bruges schemaet fra token, hvis den indeholder et schema.
* **data-vidi-host (valgfri)**
 * Kan sættes til en host (fx "https://example.com") som bruges i stedet for host angivet i token.
* **data-vidi-frame-name (valgfri)**
 * Navn på det indsatte kort. Dette er nødvendig hvis :ref:`embed_api` skal anvendes.


.. _embed_api:

*****************************************************************
Embed API
*****************************************************************

Embed scriptet udstiller et API, så det er muligt at ændre Vidi's tilstand og definere callback funtioner fra den hjemmeside det er indlejret på.

Pt. er der to funktioner udstillet gennem API'et:

.. role:: raw-html(raw)
    :format: html

.. csv-table:: Embed API
   :header: "Funktion", "Beskrivelse"

   "embedApi.switchLayer(<string> *layername*, <bool> *on*, <string> *frame*)", "Tænder/slukker et lag. :raw-html:`<br />`  :raw-html:`<br />` Fx ``embedApi.switchLayer('planer.lokalplan', true, 'plankort')``"
   "embedApi.allOff(<string> *frame*)", "Slukker alle tændte lag :raw-html:`<br />`  :raw-html:`<br />` Fx ``embedApi.allOff('plankort')``"

**Callbacks**

Der muligt at definere callback funktioner for 1) når Vidi er loaded og klar og 2) når aktive lag fra projektet er loaded [#readyOrder]_. Callbacks kan anvendes til at automatisk at kalde API metoder, efter Vidi og lag er færdig-loaded.

Hvis et kort er indlejret med ``data-vidi-frame-name="kort1"`` kan callbacks defineres på følgende måde:

.. code-block:: JavaScript

    window.embedApi.vidiReady["kort1"] = () => {
        console.log("Vidi er klar")
    }

.. code-block:: JavaScript

    window.embedApi.activeLayersReady["kort1"] = () => {
        console.log("Aktive lag er klar")
    }

.. [#readyOrder] Et projekts aktive lag loades først efter Vidi har meldt loaded og klar.
