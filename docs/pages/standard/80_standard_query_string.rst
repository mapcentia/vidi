.. _standardquerystring:

#################################################################
Standard URL parametre
#################################################################

.. topic:: Overview

    :Date: |today|
    :Vidi-version: 2025.8.2
    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 4

Når Vidi starter kan man indsætte parametre i url'en som styre en række egenskaber.


En URL består er opbygget således:

.. code-block:: text

    <skema>://<værtsnavn>/<sti>[?<query>][#<fragment>]


* ``skema``: f.eks. http, https
* ``værtsnavn``: f.eks. vidi.gc2.io
* ``sti``: database/schema, f.eks. /app/mydb/public
* ``query``: nøgle=værdi-par adskilt af & (f.eks. a=1&b=2)
* ``fragment``: anker i dokumentet (f.eks. osm/10/55.6/57.9)

Skjul elementer
*****************************************************************

Alle elementer (dialoger, værktøjer mv.) kan skjules ved at sætte følgende parametre i URLen.4

Nedenfor ses de mulige parametre. For at skjule et sættes dets paramter til "none". Flere paramtre adskildes med ``&``:

.. code-block:: text

    &bra=none&leg=none&sea=none&his=none&sig=none&lay=none&bac=none&ful=none&abo=none&loc=none&sig=none&tog=none&box=none&res=none&cle=none&scr=none&mea=none

List over elementer, som kan skjules. Dem markeret med ``*`` har kun virking, når embed templaten anvendes:

* Brandnavn: ``bra`` *
* Søgeboksen: ``sea``
* Forrige/næste udsnit knapperne: ``his``
* Signatur-knappen: ``sig``
* Lag-knappen: ``lay``
* Baggrund-knappen: ``bac``
* Fuldskærms-knappen: ``ful``
* Om-knappen: ``abo``
* Find-mig-knappen: ``loc``
* Login-knappen: ``sig``
* Navbar toggle-knappen, som vises i på smal skærm: ``tog`` *
* Måleværktøjet: ``mea``
* "Elastik"-zoom-knappen: ``box``
* Reset-knappen: ``res``
* Ryd-kort-knappen: ``cle``
* Screenshot-knappen: ``scr``


Deaktiver anker
*****************************************************************

Ankeret angiver hvilket baggrundskort der skal vælges, kortets position/zoom samt hvilke lag, der skal aktiveres.
Ankeret er dynamisk og ændres som brugeren ændrer Vidi tilstand.

Ankeret kan deaktiveres, så det ikke bliver sat af Vidis dynamisk. Det gøres ved at indsættes denne parameter:

.. code-block:: text

    &dps=1

.. note::

    ``&dps=1`` bliver sat automatisk, når Vidi :ref:`indlejres på en anden hjemmeside<embed>`

Config
*****************************************************************

``config`` parameteren angiver hvilken "config" Vidi skal startes med.

.. code-block:: text

    &config=/api/v2/configuration/mydb/configuration_test_67d945edb7875977855218.json

Projekt
*****************************************************************

``state`` parameteren angiver hvilket "projekt" Vidi skal startes med.

.. code-block:: text

    &state=state_snapshot_95851700-8731-11f0-8ba3-2feeaf482b7d

Filtrer lag
*****************************************************************

``initialFilter`` parameteren kan sætte filtre på lag således, at de er filtreret fra startet. Der kan sættes flere filtre på det samme lag og flere lag kan filtreres. Filtrede lag bliver aktiveret i vektor-udgave og der zoomes til filtrerede features på det sidst færdig-loadede lag.
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

    &initialFilter=ewogICJ0ZXN0Lm11bHRpcG9seWdvbiI6IHsKICAgICJtYXRjaCI6ICJhbn...

.. note::

    Base64URL er en afart af Base64, som ikke kan indeholde tegnene +=/ og er derfor "url sikker". https://www.npmjs.com/package/base64url

Start session
*****************************************************************

``session`` parameteren kan logge en bruger ind, når Vidi startes. Værdien skal være et session id på en allerede aktiv session.

 .. note::

    Af sikkerhedmæssige årsager fjernes denne parameter automatisk efter opstart af Vidi.

