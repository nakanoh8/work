import sys
import pathlib
parent_dir = str(pathlib.Path(__file__).parent.parent.resolve())
# = /Users/hayato/work/201013/python_import_parent_dir/parent
sys.path.append(parent_dir)
sys.path.append("/Users/hayato/work/201013/python_import_parent_dir/parent/child2")

import parent
import ch2

parent.hello()
ch2.hello()

# print(testtest)