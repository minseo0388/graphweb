// language.js - 다국어 지원 관련 기능

// 언어 데이터
const languages = {
    'en': {
        'formula': 'Formula',
        'color': 'Color',
        'grid': 'Grid',
        'zoomIn': 'Zoom In',
        'zoomOut': 'Zoom Out',
        'reset': 'Reset',
        'helpText': 'Use <b>arrow keys</b> to pan, <b>+/-</b> to zoom, <b>0</b> to reset. Enter formula using <code>x</code> and <code>y</code> variables.',
        'slope': 'Slope'
    },
    'ko': {
        'formula': '수식',
        'color': '색상',
        'grid': '격자',
        'zoomIn': '확대',
        'zoomOut': '축소',
        'reset': '초기화',
        'helpText': '<b>방향키</b>로 이동하고, <b>+/-</b>로 확대/축소하며, <b>0</b>으로 초기화합니다. <code>x</code>와 <code>y</code> 변수를 사용하여 수식을 입력하세요.',
        'slope': '기울기'
    }
};

// 페이지 로드 시 언어 전환 기능 초기화
window.addEventListener('load', function() {
    initLanguageSwitch();
});

// 언어 전환 기능 초기화
function initLanguageSwitch() {
    const langOptions = document.querySelectorAll('.lang-option');
    const savedLang = localStorage.getItem('graphWebLang') || 'en';
    
    // HTML lang 속성 설정
    document.documentElement.lang = savedLang;
    
    // 저장된 언어가 있으면 적용
    if (savedLang) {
        updateLanguage(savedLang);
        langOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.langCode === savedLang);
        });
    }
    
    // 언어 변경 이벤트 리스너 추가
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const langCode = this.dataset.langCode;
            
            // active 클래스 변경
            langOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // HTML lang 속성 변경
            document.documentElement.lang = langCode;
            
            // 언어 텍스트 업데이트
            updateLanguage(langCode);
            
            // 로컬 스토리지에 저장
            localStorage.setItem('graphWebLang', langCode);
            
            // 툴팁의 기울기 텍스트도 업데이트
            updateTooltipLanguage();
        });
    });
}

// 언어 텍스트 업데이트 함수
function updateLanguage(langCode) {
    if (!languages[langCode]) return;
    
    const langData = languages[langCode];
    const elements = document.querySelectorAll('[data-lang]');
    
    elements.forEach(element => {
        const key = element.dataset.lang;
        if (langData[key]) {
            element.innerHTML = langData[key];
        }
    });
}

// 툴팁 언어 업데이트 함수
function updateTooltipLanguage() {
    const tooltip = document.getElementById('graph-tooltip');
    if (!tooltip) return;
    
    // 기존 텍스트 형식 유지하면서 기울기 텍스트만 변경
    const langCode = localStorage.getItem('graphWebLang') || 'en';
    const slopeText = languages[langCode]['slope'] || 'Slope';
    
    const html = tooltip.innerHTML;
    if (html.includes('기울기:') || html.includes('Slope:')) {
        tooltip.innerHTML = html.replace(/(?:기울기|Slope):/, `${slopeText}:`);
    }
}
