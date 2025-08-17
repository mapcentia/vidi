.. _serviceworker:

Serviceworker
===========================================================================

.. topic:: Overview

    :Forfattere: `mapcentia <https://github.com/mapcentia>`_

.. contents::
    :depth: 4

Vidi benytter en serviceworker til at cache data og til at håndtere offline-tilstand. Dette gøres for at forbedre hastigheden ved indlæsning af Vidi og for at sikre, at Vidi kan bruges offline.

Caching
---------------------------------------------------------------------------

For at forbedre hastigheden ved indlæsning af Vidi, caches mange eksterne kald. Dette gælder blandt andet for kald til bagggrundskort, så disse kommer hurtigere frem i kortet efterfølgende.

Det er dog ikke altid ønskeligt, og det er derfor muligt at slå caching fra på enkelte adresser. Herunder er et script hvor man kan bruge i dev-tool for at teste:

.. code-block:: js

    /**
    * Talking to the service worker in test purposes
    */
    setTimeout(() => {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                action: `addUrlIgnoredForCaching`,
                payload: `jsonplaceholder.typicode`
            });

            setTimeout(() => {
                fetch('https://jsonplaceholder.typicode.com/todos/1').then(() => {}).then(() => {});
            }, 3000);
        } else {
            throw new Error(`Unable to invoke the service worker controller`);
        }
    }, 3000);

For at gemme indstillingen globalt, kan man tilføje den ønskede payload til :ref:`configjs_urlsIgnoredForCaching`

