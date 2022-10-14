from xml.dom import minidom
import sys
import json
from os import listdir
from os.path import isfile, join

walk_dir = sys.argv[1]
symbols = {}

only_files = [f for f in sorted(listdir(walk_dir)) if isfile(join(walk_dir, f))]

for file in only_files:
    try:
        full_path = walk_dir + "/" + file
        doc = minidom.parse(full_path)
        # Remove width and height
        for c in doc.childNodes:
            try:
                c.removeAttribute("width")
                c.removeAttribute("height")
            except Exception as e:
                pass
                # print(e)
        output_xml = ''.join([line.strip() for line in doc.toxml().splitlines()])
        symbols[file] = {"svg": output_xml}
        doc.unlink()
    except:
        pass

print(json.dumps(symbols))
exit(0)
