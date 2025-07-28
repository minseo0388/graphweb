# GraphWeb - Interactive Mathematical Function Plotter

A powerful, interactive web-based graphing calculator that supports both explicit functions and implicit equations with advanced mathematical visualization capabilities.

## 👨‍💻 Author & Affiliation

**Choi Minseo**  
Department of Chemistry, College of Natural Science, Chungnam National University  
GitHub: [@minseo0388](https://github.com/minseo0388)  
Project: GraphWeb - Interactive Mathematical Function Plotter  
Year: 2025

## 🚀 Features

### Core Functionality
- **Explicit Functions**: Plot traditional y = f(x) functions
- **Implicit Equations**: Render complex equations like x² + y² = 25 using advanced Marching Squares algorithm
- **Real-time Rendering**: Interactive plotting with immediate visual feedback
- **Dynamic Resolution**: Automatic quality adjustment based on zoom level

### Mathematical Support
- **Comprehensive Function Library**: 
  - Trigonometric: sin, cos, tan, sec, csc, cot
  - Inverse Trig: asin, acos, atan, arcsin, arccos, arctan
  - Hyperbolic: sinh, cosh, tanh, sech, csch, coth
  - Logarithmic: log, exp, ln
  - Power & Root: sqrt, pow, ^
  - Utility: abs, floor, ceil, round, min, max
- **Mathematical Constants**: π (PI), e (E)
- **User-Friendly Syntax**: 
  - Natural math input (sin(x) instead of Math.sin(x))
  - Power operator support (x^2, sin(x)^2, e^sin(x))
  - Automatic operator insertion for constants

### Interactive Features
- **Mouse Hover Tooltips**: Display x, y coordinates and slope information
- **Zoom Controls**: In/out with dynamic grid adjustment
- **Pan Navigation**: Arrow key or button controls
- **Grid System**: Square grid cells for accurate geometric proportions
- **Dynamic Axis Labeling**: Smart number placement that adapts to zoom level

### Visual Enhancements
- **Modern UI**: Clean, responsive design
- **Color Customization**: Choose graph colors
- **Grid Toggle**: Show/hide coordinate grid
- **Divergence Handling**: Intelligent clipping for infinite/discontinuous functions
- **Full Canvas Utilization**: Optimized display area usage

## 🛠️ Technical Implementation

### Architecture
- **Modular Design**: Separated HTML (UI) and JavaScript (logic) files
- **Canvas-Based Rendering**: High-performance 2D graphics using HTML5 Canvas
- **Mathematical Parser**: Advanced regex-based formula preprocessing
- **Responsive Layout**: Mobile-friendly interface

### Algorithms
- **Marching Squares**: High-quality implicit equation rendering
- **Adaptive Sampling**: Dynamic resolution for smooth curves at all zoom levels
- **Numerical Differentiation**: Real-time slope calculation for tooltips
- **Coordinate Transformation**: Uniform grid spacing with full canvas utilization

## 📁 Project Structure

```
graphweb/
├── graph.html          # Main HTML interface
├── graph.js            # Core mathematical and rendering logic
├── README.md           # Project documentation
└── LICENSE            # MIT License
```

## 🎯 Usage Examples

### Explicit Functions
```
sin(x)
x^2 + 2*x + 1
e^x
log(x)
tan(x)/x
```

### Implicit Equations
```
x^2 + y^2 = 25          # Circle
x^2/9 + y^2/4 = 1       # Ellipse
x^3 + y^3 = 8           # Folium curve
sin(x) + cos(y) = 0     # Trigonometric implicit
```

### Advanced Expressions
```
sin(x)^2 + cos(x)^2     # Identity verification
e^sin(x)                # Exponential composition
(x^2 + y^2)^3 = x^2     # Complex implicit curve
```

## 🎮 Controls

### Keyboard Shortcuts
- `+` / `-`: Zoom in/out
- `Arrow Keys`: Pan in four directions
- `0`: Reset to default view

### Mouse Interaction
- **Hover**: View coordinates and slope information
- **Buttons**: Use UI controls for zoom and navigation

## 🔧 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/minseo0388/graphweb.git
   cd graphweb
   ```

2. **Open in browser**:
   - Simply open `graph.html` in any modern web browser
   - No build process or server required

3. **Start graphing**:
   - Enter a mathematical formula
   - Choose colors and settings
   - Explore with zoom and pan controls

## 🌟 Key Innovations

- **Unified Grid System**: Square grid cells ensure geometric accuracy
- **Smart Canvas Usage**: Full screen utilization while maintaining proportions
- **Advanced Math Parser**: Natural syntax with comprehensive function support
- **Tooltip Intelligence**: Context-aware information display
- **Performance Optimization**: Dynamic resolution and efficient rendering

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional mathematical functions
- 3D plotting capabilities
- Animation features
- Export functionality
- Mobile gesture support

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏗️ Built With

- **HTML5 Canvas**: High-performance 2D graphics
- **Vanilla JavaScript**: No external dependencies
- **CSS3**: Modern styling and responsive design
- **Mathematical Algorithms**: Custom implementation of plotting techniques

---

*GraphWeb provides an intuitive yet powerful platform for mathematical visualization, combining ease of use with advanced computational capabilities.*
