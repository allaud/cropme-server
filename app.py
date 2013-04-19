from base64 import b64decode as decode
import urllib, urllib2
import Image

from flask import Flask, request, redirect, render_template

from shorten import image_path, path_to_short, path_to_long, short_to_path
import local

app = Flask(__name__)

dest_dir = local.dest_dir
url_mask = local.url_mask

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mobile')
def mobile():
    return render_template('mobile.html')

@app.route('/pencil/<short_id>')
def pencil(short_id):
    path = short_to_path(short_id)
    if path is None:
        return ""
    return render_template('pencil.html', **{'path': path})

@app.route('/shorten/<long_id>')
def shorten(long_id):
    path = short_to_path(long_id)
    if not path:
        return
    short_id = path_to_short(path)
    return redirect(url_mask % short_id)

@app.route('/upload', methods=['POST'])
def upload(content=None):
    if request.form.get('image', None) is None:
        return "error"
    image = request.form.get('image', None)
    raw_image = decode(image)
    path = image_path(raw_image, local.pref_dir)
    short_id = path_to_long(path)
    _write('%s/%s' % (dest_dir, path, ), raw_image)
    return url_mask % short_id

@app.route('/manualupload', methods=['POST'])
def manualupload():
    image = request.files.get('image', None)
    im = Image.open(image)
    path = image_path(im.tostring(), local.pref_dir)
    short_id = path_to_long(path)
    im.save('%s/%s' % (dest_dir, path, ), "PNG")
    return redirect(url_mask % short_id)


@app.route('/<short_id>')
def view(short_id):
    path = short_to_path(short_id)
    if path is None:
        return ""
    return render_template('view.html', **{'path': path, "short_id": short_id})

def _write(path, content):
    f = open(path, 'w')
    f.write(content)
    f.close()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')