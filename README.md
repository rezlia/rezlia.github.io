# Xiyu Studio — Clarity for Health

A production-ready website built from Figma prototypes with interactive components, scroll-linked spine animation, and service diagnostic quiz.

## Project Structure

```
xiyu-studio/
├── index.html                          # Main HTML file (entry point)
├── style.css                           # Styles (Plus Jakarta Sans font)
├── script.js                           # Interactive behavior & animations
├── README.md                           # This file
│
├── Assets (Images)
├── Frame_15_image0_695_36.png          # Xiyu logo/mark
├── Home_page_TEST_image2_157_371.jpeg  # Portfolio image 1
├── Home_page_TEST_image3_157_371.png   # Portfolio image 2
├── Home_page_TEST_Alpha_image1_157_178.png  # Portfolio image 3
│
└── Reference Files (for development)
    ├── bg-gradient.svg                 # Background gradient pattern
    ├── spine-path.svg                  # Full page spine connector
    ├── xiyu-studio-final.html          # All-in-one version (CSS inline)
    └── Home_page_TEST*.svg             # Figma prototype exports
```

## Getting Started

1. **Simple Setup**: Open `index.html` in a web browser. All files must be in the same directory.

2. **Deployment**: Upload all files to your web server, maintaining the folder structure.

3. **Font**: The page loads Plus Jakarta Sans from Google Fonts (no installation needed).

## Features

### Interactive Elements
- **Scroll-linked spine**: The connector lines draw progressively as you scroll through each section
- **Portfolio preview**: Hover/click project rows to animate the stack of portfolio images
- **Service accordion**: Click service pills to expand detailed service descriptions
- **Diagnostic quiz**: Answer questions to get a personalized service recommendation
- **Scroll-spy nav**: The navigation dots highlight which section is in view

### Accessibility
- Respects `prefers-reduced-motion` for animations
- Semantic HTML structure
- Keyboard-navigable forms and interactive elements
- Proper focus states

### Responsive
- Mobile-first design
- Breakpoints at 880px and 600px
- Touch-friendly touch targets

## Color Palette

```css
--ink: #181a1e          (text)
--mint: #2EE5B8         (accent 1)
--blue: #5B8AF7         (accent 2)
--violet: #9B6CF0       (accent 3)
--pink: #EF5DA8         (accent 4)
--coral: #FF6F5E        (accent 5)
```

## Customization

### Contact Information
Edit footer contact details in `index.html`:
- Email: `hello@xiyu.studio`
- Phone: Update phone links in footer
- Address: Update footer address

### Portfolio Images
Replace portfolio image filenames in the `.stack-card` divs:
- Line ~108: `Home_page_TEST_image2_157_371.jpeg`
- Line ~109: `Home_page_TEST_Alpha_image1_157_178.png`
- Line ~110: `Home_page_TEST_image3_157_371.png`

### Service Details
Edit service copy in the `.service-detail` sections (starting around line ~150).

### Navigation Links
Social media and footer links are in the footer section. Add actual URLs for:
- Instagram, Twitter, Behance
- "About Us" page link
- Email links

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Sizes

- index.html: ~35 KB
- style.css: ~15 KB
- script.js: ~6 KB
- Logo image: ~320 KB
- Portfolio images: ~300-800 KB each
- Total: ~1.5 MB (without compressing images)

## Performance Tips

1. **Compress images**: Use WebP format for portfolio images for 30-40% size reduction
2. **Lazy load**: Add `loading="lazy"` to portfolio images if you add more
3. **Cache headers**: Set appropriate browser cache expiry on your server
4. **Minify**: Minify CSS/JS for production (currently readable for development)

## Development Notes

- No build process required — pure HTML/CSS/JS
- No external dependencies (except Google Fonts)
- SVG paths for animations are procedurally drawn in JavaScript
- All animations use CSS transforms for 60fps performance

## Support & Updates

For questions or to request updates:
- Email: hello@xiyu.studio
- Documentation: See inline comments in CSS and JS files

---

**Built with**: HTML5, CSS3, Vanilla JavaScript
**Fonts**: Plus Jakarta Sans (Google Fonts)
**Compatible**: All modern browsers
