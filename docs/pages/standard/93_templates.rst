.. _templates:

#################################################################
Templates
#################################################################

.. topic:: Overview

    :Date: |today|
    :Vidi-version: 2025.2.1
    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 4


Indledning
*****************************************************************

Vidi anvender såkaldte templates til styrings af layouts. Helt overordnet styres Vidis layout af en template, men også mindre dele styres af templates.

Det er indholdet i feature-info pop-ups og visning af enkelte datafelter i fx konfliktsøgeren.

Vidi anvender template-systemet `Handlebars <https://handlebarsjs.com/>`_

Helt enkelt er en template blot noget tekst typisk med en eller flere `placeholders` i. Disse `placeholders` bliver udskiftet med værdier når fx feature-info anvendes:

.. code-block:: handlebars

    Lokalplan nr: {{plannr}} <br>
    Vedtaget den: {{vedtagetdato}}

I ovenstående template bliver ``{{plannr}}`` og ``{{vedtagetdato}}`` skiftet ud med felterne "plannr" og "vedtagetdato", når der klikkes på en lokalplan.

.. note::
    Der kan anvendes HTML i templates.

Indbyggede hjælpefunktioner
*****************************************************************

I Vidi er der defineret nogle hjælpefunktioner, som kan anvendes i templates. En hjælpefunktion tager selve værdien og evt. nogle argumenter som input og returnere typisk en ændret værdi.

En hjælpefunktion anvendes således:

I stedet for at bruge en placeholder på sædvanlig vis:

.. code-block:: handlebars

    {{felt}}

Anvendes den således:

.. code-block:: handlebars

    {{funktion felt "arg1" "arg2"}}

Hvor ``funktion`` er hjælpefunktionens navn, ``felt`` er den felt-værdi, der skal inputtes og ``arg1``, ``arg2`` er yderligere argumenter til funktionen.

**formatDate**

Denne funktion kan formatere en dato til et andet format. Som første argument skal det ønskede format angives:

.. code-block:: handlebars

    {{formatDate vedtagetdato "D. MMM YYYY"}}

Her vil datofeltet ``vedtagetdato`` blive omdannet til formatet `4. feb. 2025`.

Hvis feltet ikke har en egentlig dato-type, men er et tal eller tekst i et ikke-standard format, kan man angive input-formatet i det andet argument.

F.eks. anvender Plandata et talfelt med formatet `YYYYMMDD` ~ f.eks. `20250204`. Her skal man anvende et inputformat:

.. code-block:: handlebars

    {{formatDate vedtagetdato "D. MMMM YYYY" "YYYYMMDD"}}

Som vil resultere i "4. februar 2025".

.. note::
    Se `mulige datoformateringer <https://day.js.org/docs/en/display/format>`_

    Læs om prædefinerede datoformater i configs her :ref:`configjs_dateformats`.

**replaceNull**

Denne funktion tjekker om værdien er `null` og i så fald udskifter den med en valgt tekst:

.. code-block:: handlebars

    {{replaceNull vedtagetdato "Ingen dato"}}

Hvis værdien `IKKE` er `null` returner funktionen `INGEN` værdi. Derfor skal den typisk anvendes med en opfølgende placeholder:

.. code-block:: handlebars

    {{replaceNull vedtagetdato "Ingen dato"}}{{vedtagetdato}}

Det gør det muligt at anvende en funktion i den opfølgende placeholder:

.. code-block:: handlebars

    {{replaceNull vedtagetdato "Ingen dato"}}{{formatDate vedtagetdato "D. MMMM YYYY" "YYYYMMDD"}}

Her bliver i tilfældet `null` udskrevet "Ingen dato" ellers bliver værdien formateret til det ønskede datoformat.

**breakLines**

Denne funktion udskifter linjeskrift med HTML `breaks` ~ <br>. Den kan anvendes, hvis et felt indeholder tekst med linjeskrift, som man gerne også vil se i feature-info pop-up:

.. code-block:: handlebars

    {{breakLines beskrivelse}}

Her bliver linjeskrift i den længere tekst ``beskrivelse`` udskiftet med <br> tags.

**formatDecimalNumber**

Denne funktion formaterer et decimaltal til det satte sprogs decimal-separator. Hvis dansk er valgt, vil punktum (.) blive erstattet med komma (,) :

.. code-block:: handlebars

    {{formatDecimalNumber tal}}

Her bliver decimal-separatoren i ``tal`` udskiftet med ',', hvis sproget dansk er valgt.
