# Queue → IndexedDB Memory Verification

After the Queue → IndexedDB refactor, verify no base64 bytea payload lives in
the JS heap when no editor form is mounted.

## Steps

1. Load Vidi in Chrome. Open DevTools → Memory tab.
2. Open the editor, attach a file (e.g. JPEG) to a bytea[] field, submit.
   The queue should now have one pending item.
3. Close the editor form (Cancel) — Fix F should unmount the React tree.
4. Take a heap snapshot. Filter by `data:image`.
   - Expected: 0 results. The full item lives in IndexedDB only.
5. Toggle the vector layer off and on. Take another snapshot.
   - Expected: 0 `data:image` strings. transformResponseHandler injects from
     IndexedDB only when needed for display, and the isolated copy is GC'd
     after the layer load completes.
6. Open the editor on the pending feature. FileUploadWidget will fetch the
   bytea URL → blob URL for display.
   - Expected: 1 base64 string in `formData` (RJSF form state). 0 in the
     queue's memory representation.
7. Submit successfully (online). Queue empties.
   - Expected: 0 `data:image` strings in heap.

## What "1 base64 in form state" means

RJSF's `FileBlock.formData` holds the dataUrl while the form is mounted. This
is the single allowed copy per the original spec ("kun en kopi, når filen er
loaded i formularen").

## Acceptance

If any step shows more `data:image` strings than expected, capture the
retainer chain of the unexpected string(s) and re-open the planning thread.
