.. _api:

#################################################################
Vidi API
#################################################################

.. topic:: Overview

    :Date: |today|
    :Vidi-version: MASTER
    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 4

*****************************************************************
Brug
*****************************************************************

APIet kan bruges i de forskellige templates og funktioner, der kan defineres forskellige steder i en Vidi opsætning. Fx i :ref:`gc2mata_infopopup` templates og funktioner.

.. note::
    APIet kan ikke bruges til indlejrede Vidi kort - dvs. på den webside som Vidi er indlejret på. Her henvises til :ref:`embed_api`

Tænd lag (turnOn)
=================================================================

Med denne metode kan man tænde for et lag. Den tager et argument som er et fuldt lagnavn med evt. type præfiks:

.. code-block:: javascript

    api.turnOn("schema.lag");

Sæt filter på lag (filter)
=================================================================

Med denne metode kan der sættes et filter på et givnet lag. Første argument er et fuldt lagnavn (uden type præfiks) og andet argument er filter objektet:

.. code-block:: javascript

    api.filter("schema.lag", {
     "match": "any",
     "columns": [
       {
         "fieldname": "gid",
         "expression": "=",
         "value": "1",
         "restriction": false
       }
     ]
   })
