# Sample python script showing how to:
#   1. receive dates and messages from node server
#   2. send json arrays to node server
#   3. exit script with an exit code detectable on node server
#   4. program crash detectable on node server (e.g. division by zero)

import sys
import json

# valid single object
monkey = {}
monkey["name"] = "Banana"
monkey["age"] = 3
monkeyArr = []
monkeyArr.append(monkey) # must be wrapped with array

# valid multiple object
person1 = {}
person1["name"] = "Joey Zap"
person1["age"] = 5
person2 = {}
person2["name"] = "Ren"
person2["age"] = 22
personArr = []
personArr.append(person1) # must be wrapped with array
personArr.append(person2) # must be wrapped with array

# first line sent from node
fromdate = sys.stdin.readline().strip()

# 1 = spit out valid json objects
if fromdate == "2018-01-01" :
    print(json.dumps(monkeyArr))
    print(json.dumps(personArr))

# 2. send arrays to node server
elif fromdate == "2018-01-02" :
    print(["fail", "bail"])

# 3. exit script with an exit code detectable on node server
elif fromdate == "2018-01-03" :
    sys.exit(10)

# 4. program crash detectable on node server (e.g. division by zero)
elif fromdate == "2018-01-04" :
    print(1/0)