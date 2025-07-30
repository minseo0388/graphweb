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
  
  // 캔버스 크기가 설정되지 않았으면 자동 조정
  if (graph.width === 0 || graph.height === 0) {
    resizeCanvas();
  }
  
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
  
  // 수식이 y에 대한 방정식인지 확인 (예: x^2 + y^2 = 1)
  const isImplicitEquation = formula.includes('y') && formula.includes('=');
  
  if (isImplicitEquation) {
    // 암시적 방정식 처리 (예: x^2 + y^2 = 1)
    const parts = formula.split('=');
    if (parts.length === 2) {
      const leftSide = parts[0].trim();
      const rightSide = parts[1].trim();
      // F(x,y) = leftSide - rightSide = 0 형태로 변환
      const implicitFormula = `(${leftSide}) - (${rightSide})`;
      eval("function F(x, y) { return " + implicitFormula + "; }");
    } else {
      return; // 잘못된 방정식 형태
    }
  } else {
    // 기존 함수형 방정식 처리 (y = f(x))
    eval("function f(x) { return " + formula + "; }");
  }

  // 전체 캔버스를 사용하되 격자는 정사각형 유지
  const xRange = xmax - xmin;
  const yRange = ymax - ymin;
  const canvasAspectRatio = width / height; // 캔버스 비율 (2:1)
  const coordAspectRatio = xRange / yRange; // 좌표계 비율
  
  // 캔버스 전체를 사용하도록 좌표계 범위 조정
  let adjustedXMin = xmin, adjustedXMax = xmax;
  let adjustedYMin = ymin, adjustedYMax = ymax;
  
  if (canvasAspectRatio > coordAspectRatio) {
    // 캔버스가 더 넓은 경우: x 범위를 확장
    const targetXRange = yRange * canvasAspectRatio;
    const centerX = (xmin + xmax) / 2;
    adjustedXMin = centerX - targetXRange / 2;
    adjustedXMax = centerX + targetXRange / 2;
  } else {
    // 캔버스가 더 높은 경우: y 범위를 확장
    const targetYRange = xRange / canvasAspectRatio;
    const centerY = (ymin + ymax) / 2;
    adjustedYMin = centerY - targetYRange / 2;
    adjustedYMax = centerY + targetYRange / 2;
  }
  
  // 여백 추가 (각 방향으로 5% 추가 확장)
  const extraMarginX = (adjustedXMax - adjustedXMin) * 0.05;
  const extraMarginY = (adjustedYMax - adjustedYMin) * 0.05;
  adjustedXMin -= extraMarginX;
  adjustedXMax += extraMarginX;
  adjustedYMin -= extraMarginY;
  adjustedYMax += extraMarginY;
  
  function gx(x) { 
    return (x - adjustedXMin) / (adjustedXMax - adjustedXMin) * width;
  }
  function gy(y) { 
    return height - (y - adjustedYMin) / (adjustedYMax - adjustedYMin) * height;
  }

  if (showGrid) drawAxis();
  drawGraph();

  // 마우스 이벤트 리스너 추가 (한 번만 추가)
  if (!graph.hasMouseListener) {
    graph.hasMouseListener = true;
    graph.addEventListener('mousemove', function(e) {
      const rect = graph.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 캔버스 좌표를 수학 좌표로 변환 (전체 캔버스 사용)
      const x = adjustedXMin + (mouseX / width) * (adjustedXMax - adjustedXMin);
      const y = adjustedYMax - (mouseY / height) * (adjustedYMax - adjustedYMin);
      
      // 함수값과 기울기 계산
      let fx, slope, showTooltipFlag = false;
      try {
        if (typeof F === 'function') {
          // 암시적 방정식의 경우 F(x,y) = 0 값 표시
          fx = F(x, y);
          slope = 'N/A';
          // F(x,y) = 0에 가까운 곳에서만 툴팁 표시
          showTooltipFlag = Math.abs(fx) < 1.0;
        } else {
          // 기존 함수형 방정식
          fx = f(x);
          // 기울기 계산 (미분 근사)
          const h = (xmax - xmin) / 10000; // 작은 증분
          const fx_plus_h = f(x + h);
          const fx_minus_h = f(x - h);
          slope = (fx_plus_h - fx_minus_h) / (2 * h);
          
          // 마우스 위치의 y값과 함수값이 가까운 곳에서만 툴팁 표시
          const tolerance = (ymax - ymin) * 0.05; // 화면 높이의 5% 이내
          showTooltipFlag = Math.abs(y - fx) < tolerance && isFinite(fx);
        }
      } catch {
        fx = NaN;
        slope = NaN;
        showTooltipFlag = false;
      }
      
      // 툴팁 표시/숨기기
      if (showTooltipFlag) {
        showTooltip(mouseX, mouseY, x, fx, slope);
      } else {
        hideTooltip();
      }
    });
    
    graph.addEventListener('mouseleave', function() {
      hideTooltip();
    });
  }

  function drawAxis() {
    g.save();
    
    // Use theme variables for grid and axis colors
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--grid-color').trim() || "#eee";
    const axisColor = getComputedStyle(document.documentElement).getPropertyValue('--axis-color').trim() || "#333";
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || "#888";
    
    g.strokeStyle = gridColor;
    g.font = "13px Segoe UI, Arial";
    g.fillStyle = textColor;
    
    // 격자 간격의 수치값을 동일하게 맞춤
    let xRange = xmax - xmin;
    let yRange = ymax - ymin;
    let xStepCandidate = Math.pow(10, Math.floor(Math.log10(xRange/10)));
    let yStepCandidate = Math.pow(10, Math.floor(Math.log10(yRange/10)));
    if (xRange/xStepCandidate > 20) xStepCandidate *= 2;
    if (yRange/yStepCandidate > 20) yStepCandidate *= 2;
    
    // 두 축에 동일한 수치 간격 적용 (더 세밀한 것 선택)
    let step = Math.min(xStepCandidate, yStepCandidate);
    let xStep = step;
    let yStep = step;
    // Draw vertical grid lines and x labels
    for(let x = Math.ceil(adjustedXMin/xStep)*xStep; x < adjustedXMax; x += xStep) {
      // 격자선은 전체 캔버스에 그리기
      g.beginPath();
      g.moveTo(gx(x), gy(adjustedYMin)); g.lineTo(gx(x), gy(adjustedYMax));
      g.stroke();
      // Draw x axis numbers if axis is visible and not zero
      if (Math.abs(x) > 1e-8 && gy(0) >= 0 && gy(0) <= height) {
        g.fillText(x.toFixed(Math.max(0, -Math.floor(Math.log10(xStep)))), gx(x)+2, gy(0)-4);
      }
    }
    // Draw horizontal grid lines and y labels
    for(let y = Math.ceil(adjustedYMin/yStep)*yStep; y < adjustedYMax; y += yStep) {
      // 격자선은 전체 캔버스에 그리기
      g.beginPath();
      g.moveTo(gx(adjustedXMin), gy(y)); g.lineTo(gx(adjustedXMax), gy(y));
      g.stroke();
      // Draw y axis numbers if axis is visible and not zero
      if (Math.abs(y) > 1e-8 && gx(0) >= 0 && gx(0) <= width) {
        g.fillText(y.toFixed(Math.max(0, -Math.floor(Math.log10(yStep)))), gx(0)+4, gy(y)-2);
      }
    }
    // Draw main axes
    g.strokeStyle = axisColor;
    g.beginPath();
    g.moveTo(gx(adjustedXMin), gy(0)); g.lineTo(gx(adjustedXMax), gy(0));
    g.stroke();
    g.beginPath();
    g.moveTo(gx(0), gy(adjustedYMin)); g.lineTo(gx(0), gy(adjustedYMax));
    g.stroke();
    // Draw 0 label at origin if visible
    if (gx(0) >= 0 && gx(0) <= width && gy(0) >= 0 && gy(0) <= height) {
      g.fillText("0", gx(0)+4, gy(0)-4);
    }
    g.restore();
  }

  function drawGraph() {
    g.save();
    g.strokeStyle = color;
    g.lineWidth = 2;
    
    if (typeof F === 'function') {
      // 암시적 방정식 그리기 (등고선 방법)
      drawImplicitGraph();
    } else {
      // 기존 함수형 그래프 그리기
      drawExplicitGraph();
    }
    
    g.restore();
  }
  
  function drawExplicitGraph() {
    // 해상도를 화면 크기와 줌 레벨 모두 고려하여 동적 조정
    let baseResolution = Math.sqrt(width*width+height*height);
    let zoomFactor = Math.max(1, (xmax-xmin)/200); // 기본 범위(200) 대비 줌 비율
    let n = baseResolution * Math.sqrt(zoomFactor); // 축소시 더 많은 샘플링 포인트
    
    // 조정된 범위 사용 (전체 캔버스를 커버)
    let dx = (adjustedXMax-adjustedXMin)/n;
    g.beginPath();
    let first = true;
    // 조정된 x 범위를 사용하여 그래프 그리기
    for(let x=adjustedXMin; x<=adjustedXMax; x+=dx) {
      let y;
      try { y = f(x); } catch { y = NaN; }
      // 클리핑: y가 너무 크면 경계선에 맞춰서 그리기
      let clipped = false;
      if (isNaN(y) || !isFinite(y)) {
        first = true;
        continue;
      }
      if (y < adjustedYMin) {
        y = adjustedYMin;
        clipped = true;
      } else if (y > adjustedYMax) {
        y = adjustedYMax;
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
  }
  
  function drawImplicitGraph() {
    // Marching Squares 알고리즘을 사용한 암시적 방정식 그리기
    // 줌 레벨에 따라 해상도 동적 조정
    let baseResolution = 80;
    let zoomFactor = Math.max(1, Math.max(adjustedXMax-adjustedXMin, adjustedYMax-adjustedYMin)/200);
    const resolution = Math.round(baseResolution * Math.sqrt(zoomFactor)); // 축소시 더 높은 해상도
    
    // 가로/세로 격자 길이를 동일하게 맞춤 (정사각형 격자)
    const xRange = adjustedXMax - adjustedXMin;
    const yRange = adjustedYMax - adjustedYMin;
    const minRange = Math.min(xRange, yRange);
    const stepSize = minRange / resolution;
    
    const stepX = stepSize;
    const stepY = stepSize;
    
    // 실제 격자 개수 계산
    const resolutionX = Math.ceil(xRange / stepX);
    const resolutionY = Math.ceil(yRange / stepY);
    
    g.strokeStyle = color;
    g.lineWidth = 2;
    
    // 각 격자점에서 함수값 계산
    const grid = [];
    for (let i = 0; i <= resolutionX; i++) {
      grid[i] = [];
      for (let j = 0; j <= resolutionY; j++) {
        const x = adjustedXMin + i * stepX;
        const y = adjustedYMin + j * stepY;
        try {
          grid[i][j] = F(x, y);
        } catch {
          grid[i][j] = NaN;
        }
      }
    }
    
    // 각 셀에서 등고선 그리기
    for (let i = 0; i < resolutionX; i++) {
      for (let j = 0; j < resolutionY; j++) {
        const x0 = adjustedXMin + i * stepX;
        const y0 = adjustedYMin + j * stepY;
        const x1 = x0 + stepX;
        const y1 = y0 + stepY;
        
        const f00 = grid[i][j];     // 좌하
        const f10 = grid[i+1] ? grid[i+1][j] : NaN;   // 우하
        const f01 = grid[i][j+1];   // 좌상
        const f11 = grid[i+1] ? grid[i+1][j+1] : NaN; // 우상
        
        if (isNaN(f00) || isNaN(f10) || isNaN(f01) || isNaN(f11)) continue;
        
        // 각 모서리에서 부호 변화 확인
        const edges = [];
        
        // 하단 모서리 (f00 -> f10)
        if (f00 * f10 < 0) {
          const t = Math.abs(f00) / (Math.abs(f00) + Math.abs(f10));
          edges.push([x0 + t * stepX, y0]);
        }
        
        // 우측 모서리 (f10 -> f11)  
        if (f10 * f11 < 0) {
          const t = Math.abs(f10) / (Math.abs(f10) + Math.abs(f11));
          edges.push([x1, y0 + t * stepY]);
        }
        
        // 상단 모서리 (f11 -> f01)
        if (f11 * f01 < 0) {
          const t = Math.abs(f11) / (Math.abs(f11) + Math.abs(f01));
          edges.push([x1 - t * stepX, y1]);
        }
        
        // 좌측 모서리 (f01 -> f00)
        if (f01 * f00 < 0) {
          const t = Math.abs(f01) / (Math.abs(f01) + Math.abs(f00));
          edges.push([x0, y1 - t * stepY]);
        }
        
        // 교점들을 선으로 연결
        if (edges.length >= 2) {
          g.beginPath();
          g.moveTo(gx(edges[0][0]), gy(edges[0][1]));
          for (let k = 1; k < edges.length; k++) {
            g.lineTo(gx(edges[k][0]), gy(edges[k][1]));
          }
          g.stroke();
        }
      }
    }
  }
}

// 툴팁 표시 함수
function showTooltip(mouseX, mouseY, x, y, slope) {
  let tooltip = document.getElementById('graph-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'graph-tooltip';
    
    // Get theme variables for tooltip
    const tooltipBg = getComputedStyle(document.documentElement).getPropertyValue('--tooltip-bg').trim() || "rgba(0,0,0,0.8)";
    const tooltipText = getComputedStyle(document.documentElement).getPropertyValue('--tooltip-text').trim() || "white";
    
    tooltip.style.cssText = `
      position: absolute;
      background: ${tooltipBg};
      color: ${tooltipText};
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
      transition: background 0.3s;
    `;
    document.body.appendChild(tooltip);
  } else {
    // Update tooltip colors when theme changes
    const tooltipBg = getComputedStyle(document.documentElement).getPropertyValue('--tooltip-bg').trim() || "rgba(0,0,0,0.8)";
    const tooltipText = getComputedStyle(document.documentElement).getPropertyValue('--tooltip-text').trim() || "white";
    tooltip.style.background = tooltipBg;
    tooltip.style.color = tooltipText;
  }
  
  // 값 포맷팅
  const xStr = isFinite(x) ? x.toFixed(3) : 'N/A';
  const yStr = isFinite(y) ? y.toFixed(3) : 'N/A';
  const slopeStr = isFinite(slope) ? slope.toFixed(3) : 'N/A';
  
  tooltip.innerHTML = `
    x: ${xStr}<br>
    y: ${yStr}<br>
    기울기: ${slopeStr}
  `;
  
  // 툴팁 위치 조정 (화면 밖으로 나가지 않도록)
  const rect = document.getElementById('graph').getBoundingClientRect();
  let left = rect.left + mouseX + 10;
  let top = rect.top + mouseY - 10;
  
  if (left + tooltip.offsetWidth > window.innerWidth) {
    left = rect.left + mouseX - tooltip.offsetWidth - 10;
  }
  if (top < 0) {
    top = rect.top + mouseY + 20;
  }
  
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  tooltip.style.display = 'block';
}

// 툴팁 숨기기 함수
function hideTooltip() {
  const tooltip = document.getElementById('graph-tooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

function isProperFormula(formula) {
  let s = formula;
  const mathTokens = [
    "\\+", "\\-", "\\*", "\\/", "\\%", "\\(", "\\)", "\\,", " ", "\\=", "y", "Math\\.sqrt", "Math\\.pow", "Math\\.log", "Math\\.abs",
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
  resizeCanvas();
  draw();
}

// 캔버스 크기 자동 조정 함수
function resizeCanvas() {
  const graph = document.getElementById("graph");
  const container = document.querySelector(".graph-container");
  if (!graph || !container) return;
  
  // 컨테이너 크기에 맞게 캔버스 크기 조정 (패딩 고려)
  const rect = container.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(container);
  const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
  const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
  
  graph.width = rect.width;
  graph.height = Math.max(rect.height - paddingTop - paddingBottom, 100);
}

// 창 크기 변경시 캔버스 크기 자동 조정
window.addEventListener('resize', function() {
  resizeCanvas();
  draw();
});

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
