export function initCalculator() {
    const calcWindow = document.querySelector('.window.calculator');
    if (!calcWindow) return;

    const formulaDisplay = calcWindow.querySelector('.formula');
    const currentDisplay = calcWindow.querySelector('.current');
    const displayInner = calcWindow.querySelector('.display-inner');
    const display = calcWindow.querySelector('.display');

    // display-inner의 우측 고정
    const observer = new ResizeObserver(() => {
        display.scrollLeft = display.scrollWidth;
    });
    observer.observe(displayInner);


    let currentInput = '';       // 표시 & 내부 저장 (숫자와 연산기호를 섞어 둠, 쉼표는 절대 저장하지 않음)
    let previousInput = null;    // 계산 결과 저장
    let operator = null;
    let resetAfterResult = false;

    /* ----- 숫자 포맷: 숫자 토큰마다 3자리 콤마 적용 (표시용) ----- */
    function formatNumericToken(token) {
        // token: "12345" 또는 "12345.67"
        if (!token) return token;
        if (/[eE]/.test(token)) return token; // 지수 표기 유지
        const parts = token.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    function formatExpressionForDisplay(expr) {
        if (!expr) return '';
        // 숫자(소수 포함) 토큰만 찾아 포맷, 다른 문자는 그대로 (연산기호, 공백, × 등)
        return expr.replace(/\d+(\.\d+)?/g, (m) => formatNumericToken(m));
    }

    /* ----- 렌더링 ----- */
    function renderDisplay(isResult = false) {
        // 표시: 숫자 토큰만 포맷해서 보여준다.
        currentDisplay.textContent = formatExpressionForDisplay(currentInput || '0');

        // formula는 결과가 있을 때만 표시(요구사항에 맞게 조정 가능)
        if (!isResult) {
            formulaDisplay.textContent = '';
        }
    }

    /* ----- 입력 핸들러들 ----- */
    function onNumber(value) {
        // 결과 직후 숫자 입력이면 새로운 수식 시작
        if (resetAfterResult) {
            currentInput = '';
            resetAfterResult = false;
        }
        // value는 '0'~'9' 또는 '.'
        currentInput += value;
        renderDisplay();
    }

    function onOperator(value) {
        // value: '+','-','*','/','%'
        const displaySymbol = value === '*' ? '×' : value;

        // 결과 직후 연산자 입력이면 이전 결과로 이어서 연산
        if (resetAfterResult && previousInput != null) {
            currentInput = previousInput.toString();
            resetAfterResult = false;
        }

        // 공백/연산자 처리: 마지막 문자가 이미 연산자이면 교체
        // trim 하지 않고 끝문자를 검사 (연산기호는 공백과 함께 들어가므로 뒤에서 공백 제거)
        const trimmed = currentInput.trimEnd();
        if (/[+\-×/*%]$/.test(trimmed)) {
            // 마지막 연산기호를 교체: 현재 문자열 끝에서 마지막 non-space 문자 교체
            // 안전하게 공백 제거 후 교체하고 뒤에 한 칸의 공백을 둠
            currentInput = trimmed.slice(0, -1) + displaySymbol + ' ';
        } else {
            // 정상적으로 연산자 추가 (앞뒤 공백 포함)
            currentInput += (currentInput && !currentInput.endsWith(' ')) ? ` ${displaySymbol} ` : `${displaySymbol} `;
        }

        operator = value;
        renderDisplay();
    }

    function onBackspace() {
        if (resetAfterResult) return;
        // 그냥 마지막 문자 하나 지움 (공백 포함)
        currentInput = currentInput.slice(0, -1);
        renderDisplay();
    }

    function onClear() {
        currentInput = '';
        previousInput = null;
        operator = null;
        resetAfterResult = false;
        formulaDisplay.textContent = '';
        renderDisplay();
    }

    function onToggleSign() {
        // 부호 전환: 마지막 숫자 토큰을 찾아서 부호 토글
        const tokens = currentInput.split(/(\s+)/); // 공백도 토큰으로 유지
        // find last numeric token index
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (/^\d+(\.\d+)?$/.test(tokens[i])) {
                const val = parseFloat(tokens[i]);
                tokens[i] = (val * -1).toString();
                currentInput = tokens.join('');
                renderDisplay();
                return;
            }
        }
    }

    function onEquals() {
        if (!currentInput) return;

        try {
            // 계산 전 원본 수식 저장
            const expressionForFormula = currentInput;

            // 쉼표, 곱셈기호, 공백 정리
            let sanitized = currentInput.replace(/×/g, '*').replace(/,/g, '').replace(/\s+/g, '');

            // 이항 계산 기준 백분율 정리
            sanitized = sanitized.replace(/(.+?)([+\-*/])(\d+(?:\.\d+)?)%$/, (match, a, op, b) => {
                const numB = parseFloat(b);
                if (isNaN(numB)) return match;
                
                switch (op) {
                    case '+':
                        return `(${a}) + ((${a}) * ${numB} / 100)`;
                    case '-':
                        return `(${a}) - ((${a}) * ${numB} / 100)`;
                    case '*':
                        return `(${a}) * (${numB} / 100)`;
                    case '/':
                        return `(${a}) / (${numB} / 100)`;
                    default:
                        return match;
                }
            });

            sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%/g, (_, num) => `(${num}/100)`);

            // 나머지 연산 처리
            sanitized = sanitized.replace(/[^0-9+\-*/.() ]/g, '');

            // 안전한 계산: Function 사용 (eval 대체). 입력 자체가 UI에서만 오므로 여기선 허용.
            const result = Function(`"use strict"; return (${sanitized});`)();

            previousInput = result;
            formulaDisplay.textContent = formatExpressionForDisplay(expressionForFormula) + ' =';
            currentInput = result.toString(); // 결과는 내부 문자열(쉼표 없음)
            resetAfterResult = true;
            renderDisplay(true);
        } catch (err) {
            console.log('Calc Error: ', err);
            currentDisplay.textContent = 'Error';
        }
    }



    /* ----- 버튼 바인딩 ----- */
    calcWindow.querySelectorAll('.btn').forEach((btn) => {
        const val = btn.dataset.value || btn.textContent.trim();
        if (!val) return;

        btn.addEventListener('click', () => {
            // 숫자 처리: '0'..'9' 또는 '.'
            if (!isNaN(val) || val === '.') return onNumber(val);

            switch (val) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    return onOperator(val);
                case '=':
                    return onEquals();
                case 'AC':
                    return onClear();
                case 'back':
                    return onBackspace();
                case '+/-':
                    return onToggleSign();
            }
        });
    });

    /* ----- 키보드 바인딩 ----- */
    document.addEventListener('keydown', (e) => {

        const active = document.activeElement;
        if (active && active.closest('.dock-menu')) return;

        // 숫자
        if (e.key >= '0' && e.key <= '9') { onNumber(e.key); return; }
        if (e.key === '.') { onNumber('.'); return; }

        // 연산자
        if (['+', '-', '*', '/', '%'].includes(e.key)) { onOperator(e.key); return; }

        // 실행 / 삭제 / 취소
        if (e.key === 'Enter' || e.key === '=') { onEquals(); return; }
        if (e.key === 'Backspace') { onBackspace(); return; }
        if (e.key === 'Escape') { onClear(); return; }
    });

    window.Calculator = {
        reset() {
            currentInput = '';
            previousInput = null;
            operator = null;
            resetAfterResult = false;
        }
    }
    // 초기 렌더
    renderDisplay();
}