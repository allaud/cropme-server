import os
from datetime import timedelta, datetime
from base_encoder import base_encode as encode

day_count = 10000
start_date = datetime.now()
for single_date in (start_date + timedelta(n) for n in range(day_count)):
    path = single_date.strftime("%y/%m/%d")
    parts =  path.split("/")
    parts = map(lambda x: encode(int(x)), parts)
    os.system("mkdir -p s/%s" % "/".join(parts))
