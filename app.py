from base64 import b64decode as decode
from hashlib import md5
import os
import urllib, urllib2

from flask import Flask, request, render_template
app = Flask(__name__)

current_dir = os.getcwd()
dest_dir = '%s/storage' % current_dir
url_mask = 'http://cropme.ru/%s.png'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pencil')
def pencil():
    return render_template('pencil.html')

@app.route('/upload', methods=['POST'])
def upload():
    image = request.form.get('image', None)
    if image is not None:
        raw_image = decode(image)
        image_name = md5(raw_image).hexdigest()
        f = open('%s/%s.png' % (dest_dir, image_name, ), 'w')
        f.write(raw_image)
        f.close()        
        return url_mask % image_name
    return 'error'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')