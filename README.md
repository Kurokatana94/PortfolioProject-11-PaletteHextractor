# Palette Hextractor

A sleek and interactive web app built with Flask, JavaScript, and Bootstrap — drag and drop an image (or an its URL), and instantly extract its dominant colors as a beautiful palette with hex codes and percentage breakdowns.

## Live Demo
- Try it now: www.timotyravoni.com/palette-hextractor-demo

## Concept
- Simply drop an image or an URL, and Palette Hextractor will analyze it and extract a color palette.
- Each color is shown with its hex code and a percentage to represent how dominant it is in the image.
- Easily copy any color code with one click, and switch between light and dark themes!

![paletteHextractor](https://github.com/user-attachments/assets/321e7988-f591-4d68-872b-9d9b231c7670)

## Built With
- **Flask** – handles backend logic and serves frontend files
- **HTML/CSS** – responsive and clean UI
- **Bootstrap** – for layout and utility classes
- **JavaScript** – drag-and-drop logic, fetch requests, DOM rendering
- **scikit-learn / PIL** – used on the backend to extract dominant colors

## Features
- Drag & drop images directly or image URLs
- Smooth image preview
- Extracted colors displayed as swatches with:
  - Hex code
  - Percentage dominance
  - Copy-to-clipboard functionality
- Responsive layout using Bootstrap
- Dark mode toggle, saved in `localStorage`
- Loading spinner while palette is being fetched

## How It Works
1. User drops an image or URL
2. The image is previewed and sent to the backend
3. Flask processes the image and returns a color breakdown
4. Frontend displays each color in an interactive format

### Thanks for Checking It Out!
Feel free to **download**, **modify**, and **use** this project however you'd like. Feedback or suggestions are always welcome!
