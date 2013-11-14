from datetime import timedelta, datetime
from hashlib import md5
from base_encoder import base_encode as short

from redis import Redis

redis = Redis('localhost')


def image_path(raw_image, prefix=''):
    path = datetime.now().strftime("%y/%m/%d")
    parts =  path.split("/")
    parts = map(lambda x: short(int(x)), parts)
    image_name = md5(raw_image).hexdigest()[:8]
    return  "%s/%s/%s.png" % (prefix, "/".join(parts), image_name, )

def short_to_path(short_id):
    path = redis.get(_key(short_id))
    return path

def view_count(id):
    key = _key("%s:views" % id)
    return redis.get(key) or 0

def inc_view_count(id):
    key = _key("%s:views" % id)
    redis.incr(key)

def path_to_long(path):
    redis.incr(_key("TOTAL_ID"))
    long_id = md5(path).hexdigest()
    redis.set(_key(long_id), path)
    return long_id

def path_to_short(path):
    id = redis.incr(_key("ID"))
    short_id = short(id)
    redis.set(_key(short_id), path)
    return short_id


def _key(string):
    return "cropme:%s" % string
