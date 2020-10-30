import sys
import re

def rename_dir(html):
    return re.sub('/_next', '/Znext', html)

for name in sys.argv[1:]:
    file_name = 'chrome_extension/' + name + '.html'
    with open(file_name) as f:
        data_lines = f.read()

    data_lines = rename_dir(data_lines)

    with open(file_name, mode='w') as f:
        f.write(data_lines)
