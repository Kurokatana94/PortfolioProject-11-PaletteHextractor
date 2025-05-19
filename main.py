from flask import Flask, render_template, jsonify, request
from flask_bootstrap import Bootstrap5
from sklearn.cluster import MiniBatchKMeans
from PIL import Image
import datetime as dt
import numpy as np
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
Bootstrap5(app)

@app.route('/')
def home():
    return render_template('index.html', year=dt.datetime.now().year)

# Route to handle the image upload and color palette generation
@app.route('/get-palette', methods=['POST'])
def get_palette():
    img = request.files.get('image')
    if not img:
        return jsonify({'error': 'No image provided'}), 400
    
    img = Image.open(img).convert('RGB')
    img.resize((100,100))
    img_array = np.array(img)
    img_array = img_array.reshape((-1,3))

    mbkmeans = MiniBatchKMeans(n_clusters=100, batch_size=1000)
    labels = mbkmeans.fit_predict(img_array)
    counts = np.bincount(labels)
    colors = mbkmeans.cluster_centers_.astype(int)

    total_count = counts.sum()
    palette = []

    for _ in range(10):
        top_index = list(counts).index(max(counts))
        colors = list(colors)
        counts = list(counts)
        # Get the most common color
        color = colors[top_index]
        count = counts[top_index]
        counts.pop(top_index)
        colors.pop(top_index)
        # Convert color to hex
        hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
        percentage = round((count/total_count) * 100, 2)
        palette.append({
            'color': hex_color,
            'percentage': percentage
        })
    
    return jsonify(palette)

if __name__ == '__main__':
    app.run(debug=True)
