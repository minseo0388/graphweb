// graph.js
// Main graph drawing logic and UI controls

function draw() {
  let formula = document.getElementById('formula').value;
  // Replace common math functions with Math.* and ^ with Math.pow
  // e 앞뒤로 곱셈(*) 자동 추가 (숫자/변수/괄호 등)
  formula = formula
    // 숫자, 변수, ) 뒤에 e가 오면 *e
    .replace(/([0-9a-zA-Z_)])e\b/g, '$1*e')
    // e 뒤에 숫자, 변수, (이 오면 e*
    .replace(/\be([0-9a-zA-Z_(])/g, 'e*$1')
    // hyperbolic
    .replace(/([\W^]|^)sinh\s*\(/g, '$1Math.sinh(')
    .replace(/([\W^]|^)cosh\s*\(/g, '$1Math.cosh(')
    .replace(/([\W^]|^)tanh\s*\(/g, '$1Math.tanh(')
    .replace(/([\W^]|^)asinh\s*\(/g, '$1Math.asinh(')
    .replace(/([\W^]|^)acosh\s*\(/g, '$1Math.acosh(')
    .replace(/([\W^]|^)atanh\s*\(/g, '$1Math.atanh(')
    .replace(/([\W^]|^)sech\s*\(/g, '$1(1/Math.cosh(')
    .replace(/([\W^]|^)cosech\s*\(/g, '$1(1/Math.sinh(')
    .replace(/([\W^]|^)csch\s*\(/g, '$1(1/Math.sinh(')
    .replace(/([\W^]|^)cotanh\s*\(/g, '$1(1/Math.tanh(')
    .replace(/([\W^]|^)coth\s*\(/g, '$1(1/Math.tanh(')
    // inverse trig
    .replace(/([\W^]|^)arcsin\s*\(/g, '$1Math.asin(')
    .replace(/([\W^]|^)arccos\s*\(/g, '$1Math.acos(')
    .replace(/([\W^]|^)arctan\s*\(/g, '$1Math.atan(')
    .replace(/([\W^]|^)asin\s*\(/g, '$1Math.asin(')
    .replace(/([\W^]|^)acos\s*\(/g, '$1Math.acos(')
    .replace(/([\W^]|^)atan\s*\(/g, '$1Math.atan(')
    // regular trig
    .replace(/([\W^]|^)sin\s*\(/g, '$1Math.sin(')
    .replace(/([\W^]|^)cos\s*\(/g, '$1Math.cos(')
    .replace(/([\W^]|^)tan\s*\(/g, '$1Math.tan(')
    .replace(/([\W^]|^)sec\s*\(/g, '$1(1/Math.cos(')
    .replace(/([\W^]|^)secant\s*\(/g, '$1(1/Math.cos(')
    .replace(/([\W^]|^)csc\s*\(/g, '$1(1/Math.sin(')
    .replace(/([\W^]|^)cosec\s*\(/g, '$1(1/Math.sin(')
    .replace(/([\W^]|^)cosecant\s*\(/g, '$1(1/Math.sin(')
    .replace(/([\W^]|^)cot\s*\(/g, '$1(1/Math.tan(')
    .replace(/([\W^]|^)cotan\s*\(/g, '$1(1/Math.tan(')
    .replace(/([\W^]|^)cotangent\s*\(/g, '$1(1/Math.tan(')
    // other
    .replace(/([\W^]|^)log\s*\(/g, '$1Math.log(')
    .replace(/([\W^]|^)sqrt\s*\(/g, '$1Math.sqrt(')
    .replace(/([\W^]|^)abs\s*\(/g, '$1Math.abs(')
    .replace(/([\W^]|^)exp\s*\(/g, '$1Math.exp(')
    .replace(/([\W^]|^)floor\s*\(/g, '$1Math.floor(')
    .replace(/([\W^]|^)ceil\s*\(/g, '$1Math.ceil(')
    .replace(/([\W^]|^)round\s*\(/g, '$1Math.round(')
    .replace(/([\W^]|^)min\s*\(/g, '$1Math.min(')
    .replace(/([\W^]|^)max\s*\(/g, '$1Math.max(')
    // constants
    .replace(/\bPI\b/g, 'Math.PI')
    .replace(/\bE\b/g, 'Math.E')
    // 단독 e만 Math.E로 변환 (단어 경계)
    .replace(/\be\b/g, 'Math.E')
    // degree/radian conversion
    .replace(/([\W^]|^)deg2rad\s*\(/g, '$1((Math.PI/180)*')
    .replace(/([\W^]|^)rad2deg\s*\(/g, '$1((180/Math.PI)*');
  // Only replace pow( if not already Math.pow(
  formula = formula.replace(/([^\w]|^)pow\s*\(/g, function(match, p1) {
    // If already Math.pow, skip
    if (p1 && p1.endsWith('Math.')) return match;
    return (p1 || '') + 'Math.pow(';
  });
  // Replace ^ with Math.pow for all valid JS subexpressions, including sin(x)^2, e^sin(x), etc.
  // This regex matches the rightmost ^ operator not inside parentheses, recursively.
  function replacePowers(str) {
    // 함수 호출 전체(중첩 괄호 포함) 또는 괄호, 숫자, 변수까지 모두 인식
    // 좌변/우변: Math.xxx(...), ( ... ), 변수, 숫자
    let re = /((?:Math\.[a-zA-Z0-9_]+\((?:[^()]*|\([^()]*\))*\))|\((?:[^()]*|\([^()]*\))*\)|[a-zA-Z0-9_.]+)\s*\^\s*((?:Math\.[a-zA-Z0-9_]+\((?:[^()]*|\([^()]*\))*\))|\((?:[^()]*|\([^()]*\))*\)|[a-zA-Z0-9_.]+)/g;
    while (re.test(str)) {
      str = str.replace(re, 'Math.pow($1,$2)');
    }
    return str;
  }
  formula = replacePowers(formula);
  
  // 디버깅: 변환된 수식 출력
  console.log("Original formula:", document.getElementById('formula').value);
  console.log("Transformed formula:", formula);
  
  const graph = document.getElementById("graph");
  graph.width = graph.width; // clear canvas
  if (!isProperFormula(formula)) {
    console.log("Formula validation failed");
    return;
  }
  const width = graph.width;
  const height = graph.height;
  const g = graph.getContext("2d");
  const xmin = window.xmin ?? -100, xmax = window.xmax ?? 100, ymin = window.ymin ?? -100, ymax = window.ymax ?? 100;
  const color = document.getElementById('color').value;
  const showGrid = document.getElementById('showGrid').checked;
  eval("function f(x) { return " + formula + "; }");

  function gx(x) { return (x-xmin)/(xmax-xmin)*width; }
  function gy(y) { return height - (y-ymin)/(ymax-ymin)*height; }

  if (showGrid) drawAxis();
  drawGraph();

  function drawAxis() {
    g.save();
    g.strokeStyle = "#eee";
    g.font = "13px Segoe UI, Arial";
    g.fillStyle = "#888";
    // Calculate step size for grid/labels based on zoom
    let xRange = xmax - xmin;
    let yRange = ymax - ymin;
    let xStep = Math.pow(10, Math.floor(Math.log10(xRange/10)));
    let yStep = Math.pow(10, Math.floor(Math.log10(yRange/10)));
    if (xRange/xStep > 20) xStep *= 2;
    if (yRange/yStep > 20) yStep *= 2;
    // Draw vertical grid lines and x labels
    for(let x = Math.ceil(xmin/xStep)*xStep; x < xmax; x += xStep) {
      g.beginPath();
      g.moveTo(gx(x), gy(ymin)); g.lineTo(gx(x), gy(ymax));
      g.stroke();
      // Draw x axis numbers, skip 0 (will be drawn on y axis)
      if (Math.abs(x) > 1e-8) {
        g.fillText(x.toFixed(Math.max(0, -Math.floor(Math.log10(xStep)))), gx(x)+2, gy(0)-4);
      }
    }
    // Draw horizontal grid lines and y labels
    for(let y = Math.ceil(ymin/yStep)*yStep; y < ymax; y += yStep) {
      g.beginPath();
      g.moveTo(gx(xmin), gy(y)); g.lineTo(gx(xmax), gy(y));
      g.stroke();
      // Draw y axis numbers, skip 0 (will be drawn on x axis)
      if (Math.abs(y) > 1e-8) {
        g.fillText(y.toFixed(Math.max(0, -Math.floor(Math.log10(yStep)))), gx(0)+4, gy(y)-2);
      }
    }
    // Draw main axes
    g.strokeStyle = "#333";
    g.beginPath();
    g.moveTo(gx(xmin), gy(0)); g.lineTo(gx(xmax), gy(0));
    g.stroke();
    g.beginPath();
    g.moveTo(gx(0), gy(ymin)); g.lineTo(gx(0), gy(ymax));
    g.stroke();
    // Draw 0 label at origin
    g.fillText("0", gx(0)+4, gy(0)-4);
    g.restore();
  }

  function drawGraph() {
    g.save();
    g.strokeStyle = color;
    g.lineWidth = 2;
    let n = Math.sqrt(width*width+height*height);
    let dx = (xmax-xmin)/n;
    g.beginPath();
    let first = true;
    for(let x=xmin; x<=xmax; x+=dx) {
      let y;
      try { y = f(x); } catch { y = NaN; }
      // 클리핑: y가 너무 크면 경계선에 맞춰서 그리기
      let clipped = false;
      if (isNaN(y) || !isFinite(y)) {
        first = true;
        continue;
      }
      if (y < ymin) {
        y = ymin;
        clipped = true;
      } else if (y > ymax) {
        y = ymax;
        clipped = true;
      }
      if (first) {
        g.moveTo(gx(x), gy(y));
        first = false;
      } else {
        g.lineTo(gx(x), gy(y));
        // 발산점에서 선을 끊고 다시 시작 (클리핑된 점에서만)
        if (clipped) {
          g.stroke();
          g.beginPath();
          first = true;
        }
      }
    }
    g.stroke();
    g.restore();
  }
}

function isProperFormula(formula) {
  let s = formula;
  const mathTokens = [
    "\\+", "\\-", "\\*", "\\/", "\\%", "\\(", "\\)", "\\,", " ", "Math\\.sqrt", "Math\\.pow", "Math\\.log", "Math\\.abs",
    "Math\\.cos", "Math\\.sin", "Math\\.tan", "Math\\.csc", "Math\\.sec", "Math\\.cot", "Math\\.exp", "x", "\\d",
    "Math\\.E", "Math\\.PI", "Math\\.sinh", "Math\\.cosh", "Math\\.tanh", "Math\\.asin", "Math\\.acos", "Math\\.atan",
    "Math\\.asinh", "Math\\.acosh", "Math\\.atanh", "Math\\.floor", "Math\\.ceil", "Math\\.round", "Math\\.min", "Math\\.max", "\\."
  ];
  mathTokens.forEach(function(el) {
    s = s.replace(new RegExp(el, "g"), "");
  });
  return s.length === 0;
}

function zoom(factor) {
  const cx = (window.xmin + window.xmax) / 2;
  const cy = (window.ymin + window.ymax) / 2;
  const rx = (window.xmax - window.xmin) / 2 * factor;
  const ry = (window.ymax - window.ymin) / 2 * factor;
  window.xmin = cx - rx;
  window.xmax = cx + rx;
  window.ymin = cy - ry;
  window.ymax = cy + ry;
  draw();
}
function pan(dx, dy) {
  window.xmin += dx;
  window.xmax += dx;
  window.ymin += dy;
  window.ymax += dy;
  draw();
}
function resetView() {
  window.xmin = -100; window.xmax = 100; window.ymin = -100; window.ymax = 100;
  draw();
}

document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === '+') zoom(0.8);
  if (e.key === '-') zoom(1.25);
  if (e.key === 'ArrowLeft') pan(-10, 0);
  if (e.key === 'ArrowRight') pan(10, 0);
  if (e.key === 'ArrowUp') pan(0, 10);
  if (e.key === 'ArrowDown') pan(0, -10);
  if (e.key === '0') resetView();
});
