
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const chooseBtn = document.getElementById('choose-file');

// Open file picker on button click
chooseBtn.addEventListener('click', () => fileInput.click());

// When a file is selected via file picker
fileInput.addEventListener('change', e => {
  if (!e.target.files.length) return;
  handleFile(e.target.files[0]);
});

// Prevent defaults on drag events
['dragenter','dragover','dragleave','drop'].forEach(evt =>
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
  })
);

// Style on drag over
['dragenter','dragover'].forEach(evt =>
  dropZone.addEventListener(evt, () => dropZone.classList.add('dragover'))
);
['dragleave','drop'].forEach(evt =>
  dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover'))
);

// Handle drop
dropZone.addEventListener('drop', e => {
  // Check for files
  const files = e.dataTransfer.files;
  if (files && files.length) {
    const imgFile = Array.from(files).find(f => f.type.startsWith('image/'));
    if (imgFile) {
      handleFile(imgFile);
      return;
    }
  }
  // Check for URL (text/uri-list or text/plain)
  const urlData = e.dataTransfer.getData('text/uri-list') 
                || e.dataTransfer.getData('text/plain');
  if (urlData && isImageUrl(urlData)) {
    handleUrl(urlData);
  }
});

function isImageUrl(url) {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
}

function clearDropZone() {
  dropZone.innerHTML = '<strong></strong>';
}

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    showImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function handleUrl(url) {
  showImage(url);
}

function showImage(src) {
  clearDropZone();
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Dropped image';
  dropZone.appendChild(img);
  
  fetch(src)
  .then(res => res.blob())
  .then(blob => {
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');

    return fetch('/get-palette', {
      method: 'POST',
      body: formData,
    });
  })
  .then(response => response.json())
  .then(palette => {
    renderPalette(palette);
  })
  .catch(error => {
    console.error('Error:', error);
  });

}

function renderPalette(palette) {
  const container = document.getElementById('palette-container');
  container.innerHTML = ''; // Clear previous content

  palette.forEach(({ color, percentage }) => {
    const item = document.createElement('div');
    item.className = 'color-item';

    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;

    const code = document.createElement('span');
    code.className = 'color-code';
    code.textContent = color;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-button btn btn-sm btn-outline-secondary';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(color).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 1500);
      });
    });

    item.appendChild(swatch);
    item.appendChild(code);
    item.appendChild(copyBtn);
    container.appendChild(item);
  });
}

// Dark mode toggle
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved user preference, if any, on load of the website
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
}

// Toggle dark mode on button click
toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  // Save the user's preference in localStorage
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Apply system preference if no user preference is set
if (!localStorage.getItem('theme')) {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
  }
}