.. _draw:

#################################################################
Tegn
#################################################################

.. topic:: Overview

    :Date: |today|
    :Vidi-version: 2020.11.0
    :Forfatter: `giovanniborella <https://github.com/giovanniborella>`_

.. contents:: 
    :depth: 3


*****************************************************************
Tegn-værktøjet
***************************************************************** 

.. include:: ../../_subs/NOTE_GETTINGSTARTED.rst

Elementer vil også fremgå på PDF-print.

Typer
=================================================================

Når værktøjet er tændt er det muligt at tegne elementer ind på kortet. Elementerne er bundet op på den geografiske placering, så de vil blive selv om man panorerer i kortet.

.. figure:: ../../../_media/draw-on.png
    :width: 400px
    :align: center
    :name: draw-on
    :figclass: align-center

    Værktøjet er tændt, og klar til at lave elementer.

Tegn elementer
-----------------------------------------------------------------

For at tegne elementer, gøres følgende:

* Linjer: 
    * Klik for at starte linje
    * Tilføj mellempunkter
    * (Slet sidste punkt ved at bruge ``Slet sidste punkt``)
    * Klik på ``Afslut``, eller klik på det sidst tilføjede mellempunkt.

.. figure:: ../../../_media/draw-create-line.png
    :width: 400px
    :align: center
    :name: draw-create-line
    :figclass: align-center


* Arealer/Flader:
    * Klik for at starte flade
    * Tilføj mellempunkter
    * (Slet sidste punkt ved at bruge ``Slet sidste punkt``)
    * Klik på det første punkt for at afslutte

.. figure:: ../../../_media/draw-create-polygon.png
    :width: 400px
    :align: center
    :name: draw-create-polygon
    :figclass: align-center

* Rektangel:
    * Klik og træk for at tegne et rektangel

* Cirkel:
    * Klik og træk for at slå cirkel

* Punkt:
    * Klik for placere punkt.

* Annotation:
    * Klik for at placere
    * Indtast notat

Ændre elementer
-----------------------------------------------------------------

Når værktøjet aktiveres er det muligt at ændre knudepunkter mm. for de tegnede elementer. 

.. figure:: ../../../_media/draw-edit.png
    :width: 400px
    :align: center
    :name: draw-edit
    :figclass: align-center

    Ændre elementerne ved at klikke og trække knudepunkterne (Hvide kasser)

Klik for ``Gem`` for at gemme, ``Fortryd`` for at annulere alle ændringer.

Slet elementer
-----------------------------------------------------------------

Når værktøjet aktiveres er det muligt at fjerne elementer enkeltvis, eller alle på én gang.

Udvælg et mål der skal fjernes.

Klik for ``Gem`` for at gemme, ``Fortryd`` for at annulere alle ændringer.

.. warning:: Klikker man på ``Slet alle`` kan handlingen ikke fortrydes

Stilart
=================================================================

TBD

Linjer
-----------------------------------------------------------------

Det er muligt at definere en ende på hver linje. Denne indstilling sættes inden man tegner sin linje. 

Der er også mulighed for at få vist mål på linjer, samt totalmål.

.. figure:: ../../../_media/draw-linestyle.png
    :width: 400px
    :align: center
    :name: draw-linestyle
    :figclass: align-center

    Fra venstre mod højre: Pilehoved, Stop, firkant, punkt. Den sidste linje er sat op som vist i billedet. 

Oversigt
-----------------------------------------------------------------

Nederst vil der være en tabel over de tegnede geometrier. Ved at klikke på en række vil kortet flyve over til den relevante geometri.

.. figure:: ../../../_media/draw-list.png
    :width: 400px
    :align: center
    :name: draw-list
    :figclass: align-center

    Fra venstre mod højre: Pilehoved, Stop, firkant, punkt. Den sidste linje er sat op som vist i billedet.