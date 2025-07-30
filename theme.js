// theme.js - 테마 관련 기능 구현

// 페이지 로드 후 캔버스 크기 자동 조정
window.addEventListener('load', function() {
    setTimeout(resizeCanvas, 100); // 약간의 지연을 주어 정확한 크기 계산
    
    // 테마 스위칭 기능 초기화
    initThemeSwitch();
});

// 테마 변경 기능
function initThemeSwitch() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const savedTheme = localStorage.getItem('graphWebTheme');
    
    // 저장된 테마가 있으면 적용
    if (savedTheme) {
        document.body.className = savedTheme + '-theme';
        themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === savedTheme);
        });
    }
    
    // 테마 변경 이벤트 리스너 추가
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            
            // active 클래스 변경
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 테마 클래스 적용
            document.body.className = theme + '-theme';
            
            // 로컬 스토리지에 저장
            localStorage.setItem('graphWebTheme', theme);
            
            // 그래프 다시 그리기 (테마 색상 반영)
            draw();
        });
    });
}
