import CryptoJS from 'crypto-js';

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update buttons
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // JSON Parser Logic
    const jsonInput = document.getElementById('json-input');
    const jsonError = document.getElementById('json-error');
    const btnFormat = document.getElementById('json-format');
    const btnMinify = document.getElementById('json-minify');
    const btnClear = document.getElementById('json-clear');

    const updateJson = (format = true) => {
        const val = jsonInput.value.trim();
        if (!val) {
            jsonError.textContent = '';
            return;
        }
        try {
            const parsed = JSON.parse(val);
            jsonInput.value = format ? JSON.stringify(parsed, null, 4) : JSON.stringify(parsed);
            jsonError.textContent = '';
        } catch (e) {
            jsonError.textContent = 'Invalid JSON: ' + e.message;
        }
    };

    btnFormat.addEventListener('click', () => updateJson(true));
    btnMinify.addEventListener('click', () => updateJson(false));
    btnClear.addEventListener('click', () => {
        jsonInput.value = '';
        jsonError.textContent = '';
    });

    // Crypto Logic (MD5)
    const cryptoInput = document.getElementById('crypto-input');
    const cryptoOutput = document.getElementById('crypto-output');

    cryptoInput.addEventListener('input', () => {
        const val = cryptoInput.value;
        if (!val) {
            cryptoOutput.value = '';
            return;
        }
        const hash = CryptoJS.MD5(val).toString();
        cryptoOutput.value = hash;
    });

    // Base Converter Logic
    const baseInputs = {
        10: document.getElementById('base-10'),
        16: document.getElementById('base-16'),
        2: document.getElementById('base-2'),
        8: document.getElementById('base-8')
    };

    Object.entries(baseInputs).forEach(([base, input]) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (!val) {
                Object.values(baseInputs).forEach(inp => { if (inp !== input) inp.value = ''; });
                return;
            }

            try {
                const decimalValue = parseInt(val, parseInt(base));
                if (isNaN(decimalValue)) return;

                Object.entries(baseInputs).forEach(([targetBase, targetInput]) => {
                    if (targetBase !== base) {
                        targetInput.value = decimalValue.toString(parseInt(targetBase));
                    }
                });
            } catch (err) {
                console.error('Conversion error', err);
            }
        });
    });

    // Copy to Clipboard
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.select();
                document.execCommand('copy');
                
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                btn.classList.add('success');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('success');
                }, 2000);
            }
        });
    });
});
