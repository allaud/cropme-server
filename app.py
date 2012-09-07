from base64 import b64decode as decode
import urllib, urllib2

from flask import Flask, request, render_template

from shorten import image_path, path_to_short, short_to_path
import local

app = Flask(__name__)

dest_dir = local.dest_dir
url_mask = local.url_mask

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pencil/<short_id>')
def pencil(short_id):
    path = short_to_path(short_id)
    if path is None:
        return ""
    return render_template('pencil.html')

@app.route('/upload', methods=['POST'])
def upload():
    image = request.form.get('image', None)
    if image is not None:
        raw_image = decode(image)
        path = image_path(raw_image, local.pref_dir)
        short_id = path_to_short(path)
        _write('%s/%s' % (dest_dir, path, ), raw_image)

        return url_mask % short_id
    return 'error'

@app.route('/<short_id>')
def view(short_id):
    path = short_to_path(short_id)
    if path is None:
        return ""
    return render_template('view.html', **{'path': path})


def _write(path, content):
    f = open(path, 'w')
    f.write(content)
    f.close()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')