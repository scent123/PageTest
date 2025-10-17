document.addEventListener('DOMContentLoaded', () => {
    const calcWindow = document.querySelector('.window.calculator');
    if (!calcWindow) return;

    const formulaDisplay = calcWindow.querySelector('.formula');
    const currentDisplay = calcWindow.querySelector('.current');
    const buttons = calcWindow.querySelectorAll('.btn');
    const acBtn = calcWindow.querySelector('[data-value="AC"]');

    let currentInput = '';
    let previousInput = '';
    let operator = '';
    let isCalculated = false;

    /** -------------------------
     *  디스플레이 업데이트
     *  ------------------------- */
    function updateDisplays() {
        currentDisplay.textContent = currentInput || '0';
        updateACButton();
    }

    function updateACButton() {
        acBtn.textContent = currentInput ? 'C' : 'AC';
    }

    /** -------------------------
     *  연산 처리
     *  ------------------------- */
    function clearAll() {
        currentInput = '';
        previousInput = '';
        operator = '';
        formulaDisplay.textContent = '';
        isCalculated = false;
        updateDisplays();
    }

    function backspace() {
        if (currentInput && !isCalculated) {
            currentInput = currentInput.slice(0, -1);
            updateDisplays();
        }
    }

    function chooseOperator(op) {
        if (currentInput === '' && previousInput === '') return;

        if (previousInput && currentInput) {
            calculate(); // 이전 수식 계산 후 누적
        }

        operator = op;
        previousInput = currentInput || previousInput;
        currentInput = '';
        isCalculated = false;
    }

    function calculate() {
        if (!operator || previousInput === '' || currentInput === '') return;

        const prev = parseFloat(previousInput);
        const curr = parseFloat(currentInput);
        let result = 0;

        switch (operator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '*': result = prev * curr; break;
            case '/': result = curr === 0 ? 'Error' : prev / curr; break;
            default: return;
        }

        formulaDisplay.textContent = `${previousInput} ${operator} ${currentInput} =`;
        currentInput = result.toString();
        previousInput = '';
        operator = '';
        isCalculated = true;
        updateDisplays();
    }

    /** -------------------------
     *  부호 전환 & 백분율 기능
     *  ------------------------- */
    function toggleSign() {
        if (!currentInput) return;
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplays();
    }

    function percentage() {
        if (!currentInput) return;
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplays();
    }

    /** -------------------------
     *  입력 처리
     *  ------------------------- */
    function handleButtonInput(value) {
        if (!isNaN(value) || value === '.') {
            if (isCalculated) {
                currentInput = '';
                formulaDisplay.textContent = '';
                isCalculated = false;
            }
            if (value === '.' && currentInput.includes('.')) return;
            currentInput += value;
            updateDisplays();
        }
        else if (['+', '-', '*', '/'].includes(value)) {
            chooseOperator(value);
        }
        else if (value === '=') {
            calculate();
        }
        else if (value === 'AC' || value === 'C') {
            clearAll();
        }
        else if (value === 'back') {
            backspace();
        }
        else if (value === '+/-') {
            toggleSign();
        }
        else if (value === '%') {
            percentage();
        }
    }

    /** -------------------------
     *  버튼 클릭
     *  ------------------------- */
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value || btn.textContent.trim();
            handleButtonInput(value);
        });
    });

    /** -------------------------
     *  키보드 입력
     *  ------------------------- */
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const code = e.code;

        if (key >= '0' && key <= '9') {
            handleButtonInput(key);
        }
        else if (key === '.' || key === ',') {
            handleButtonInput('.');
        }
        else if (key === '+' || (code === 'Equal' && e.shiftKey)) {
            handleButtonInput('+');
        }
        else if (key === '-' || code === 'Minus') {
            handleButtonInput('-');
        }
        else if (key === '*' || (code === 'Digit8' && e.shiftKey)) {
            handleButtonInput('*');
        }
        else if (key === '/' || code === 'Slash') {
            handleButtonInput('/');
        }
        else if (key === 'Enter' || key === '=') {
            handleButtonInput('=');
        }
        else if (key === 'Backspace') {
            handleButtonInput('back');
        }
        else if (key === 'Escape') {
            handleButtonInput('AC');
        }
        else if (key === '%') {
            handleButtonInput('%');
        }
        else if (key === '_') { // 혹시 다른 환경용 백업
            handleButtonInput('-');
        }
    });

    /** 초기화 */
    clearAll();
});