import CryptoJS from 'crypto-js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Shared functionality (Copy to clipboard)
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                if (targetElement.tagName === 'TEXTAREA' || targetElement.tagName === 'INPUT') {
                    targetElement.select();
                }
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

    // 2. JSON Parser Logic
    const jsonInput = document.getElementById('json-input');
    if (jsonInput) {
        const jsonTreeContainer = document.getElementById('json-tree-container');
        const jsonSearchInput = document.getElementById('json-search');
        const searchCount = document.getElementById('search-count');
        const jsonError = document.getElementById('json-error');
        const btnFormat = document.getElementById('json-format');
        const btnMinify = document.getElementById('json-minify');
        const btnClear = document.getElementById('json-clear');

        let currentParsedData = null;

        const createTreeNode = (key, value, isLast) => {
            const node = document.createElement('div');
            node.className = 'json-node';
            const content = document.createElement('span');
            content.className = 'json-node-content';

            if (key !== null) {
                const keySpan = document.createElement('span');
                keySpan.className = 'json-key';
                keySpan.textContent = `"${key}": `;
                content.appendChild(keySpan);
            }

            if (typeof value === 'object' && value !== null) {
                const isArray = Array.isArray(value);
                const openBrace = isArray ? '[' : '{';
                const closeBrace = isArray ? ']' : '}';

                const toggle = document.createElement('span');
                toggle.className = 'json-toggle';
                node.appendChild(toggle);
                content.appendChild(document.createTextNode(openBrace));
                node.appendChild(content);

                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'json-children';
                const keys = Object.keys(value);
                keys.forEach((k, i) => {
                    childrenContainer.appendChild(createTreeNode(isArray ? null : k, value[k], i === keys.length - 1));
                });
                node.appendChild(childrenContainer);

                const footer = document.createElement('div');
                footer.className = 'json-footer';
                footer.textContent = closeBrace + (isLast ? '' : ',');
                node.appendChild(footer);

                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    node.classList.toggle('json-collapsed');
                });
            } else {
                const valueSpan = document.createElement('span');
                if (typeof value === 'string') {
                    valueSpan.className = 'json-string';
                    valueSpan.textContent = `"${value}"`;
                } else if (typeof value === 'number') {
                    valueSpan.className = 'json-number';
                    valueSpan.textContent = value;
                } else if (typeof value === 'boolean') {
                    valueSpan.className = 'json-boolean';
                    valueSpan.textContent = value;
                } else if (value === null) {
                    valueSpan.className = 'json-null';
                    valueSpan.textContent = 'null';
                }
                content.appendChild(valueSpan);
                if (!isLast) content.appendChild(document.createTextNode(','));
                node.appendChild(content);
            }
            return node;
        };

        const updateTreeView = () => {
            jsonTreeContainer.innerHTML = '';
            if (currentParsedData !== null) {
                jsonTreeContainer.appendChild(createTreeNode(null, currentParsedData, true));
                performSearch();
            }
        };

        const performSearch = () => {
            const term = jsonSearchInput.value.toLowerCase();
            const nodes = jsonTreeContainer.querySelectorAll('.json-node-content span');
            let matches = 0;

            nodes.forEach(node => {
                node.classList.remove('highlight');
                const text = node.textContent.toLowerCase();
                if (term && text.includes(term)) {
                    node.classList.add('highlight');
                    matches++;
                    let parent = node.closest('.json-node');
                    while (parent) {
                        parent.classList.remove('json-collapsed');
                        parent = parent.parentElement.closest('.json-node');
                    }
                }
            });
            searchCount.textContent = term ? `${matches} matches` : '0 matches';
        };

        jsonSearchInput.addEventListener('input', performSearch);

        jsonInput.addEventListener('input', () => {
            const val = jsonInput.value.trim();
            if (!val) {
                jsonError.textContent = '';
                currentParsedData = null;
                jsonTreeContainer.innerHTML = '';
                searchCount.textContent = '0 matches';
                return;
            }
            try {
                currentParsedData = JSON.parse(val);
                updateTreeView();
                jsonError.textContent = '';
            } catch (e) {
                jsonError.textContent = 'Invalid JSON: ' + e.message;
            }
        });

        btnFormat.addEventListener('click', () => {
            if (currentParsedData) jsonInput.value = JSON.stringify(currentParsedData, null, 4);
        });

        btnMinify.addEventListener('click', () => {
            if (currentParsedData) jsonInput.value = JSON.stringify(currentParsedData);
        });

        btnClear.addEventListener('click', () => {
            jsonInput.value = '';
            jsonError.textContent = '';
            currentParsedData = null;
            jsonTreeContainer.innerHTML = '';
            jsonSearchInput.value = '';
            searchCount.textContent = '0 matches';
        });
    }

    // 3. Crypto Logic
    const cryptoInputEncrypt = document.getElementById('crypto-input-encrypt');
    if (cryptoInputEncrypt) {
        const cryptoKeyEncrypt = document.getElementById('crypto-key-encrypt');
        const cryptoInputDecrypt = document.getElementById('crypto-input-decrypt');
        const cryptoSelectDecrypt = document.getElementById('crypto-select-decrypt');
        const cryptoKeyDecryptWrapper = document.getElementById('crypto-key-decrypt-wrapper');
        const cryptoKeyDecrypt = document.getElementById('crypto-key-decrypt');
        const cryptoOutputDecrypt = document.getElementById('crypto-output-decrypt');
        const cryptoDecryptError = document.getElementById('crypto-decrypt-error');

        const encryptOutputs = {
            aes: document.getElementById('crypto-aes-enc'),
            md5: document.getElementById('crypto-md5'),
            sha256: document.getElementById('crypto-sha256'),
            sha512: document.getElementById('crypto-sha512'),
            sha1: document.getElementById('crypto-sha1'),
            enc: document.getElementById('crypto-b64-enc')
        };

        const runEncrypt = () => {
            const val = cryptoInputEncrypt.value;
            const key = cryptoKeyEncrypt.value;
            if (!val) {
                Object.values(encryptOutputs).forEach(out => out.value = '');
                return;
            }
            try {
                encryptOutputs.md5.value = CryptoJS.MD5(val).toString();
                encryptOutputs.sha256.value = CryptoJS.SHA256(val).toString();
                encryptOutputs.sha512.value = CryptoJS.SHA512(val).toString();
                encryptOutputs.sha1.value = CryptoJS.SHA1(val).toString();
                const words = CryptoJS.enc.Utf8.parse(val);
                encryptOutputs.enc.value = CryptoJS.enc.Base64.stringify(words);
                if (key) {
                    encryptOutputs.aes.value = CryptoJS.AES.encrypt(val, key).toString();
                } else {
                    encryptOutputs.aes.value = '(Secret Key Required)';
                }
            } catch (e) { console.error('Encrypt error', e); }
        };

        const runDecrypt = () => {
            const val = cryptoInputDecrypt.value.trim();
            const algo = cryptoSelectDecrypt.value;
            const key = cryptoKeyDecrypt.value;
            if (!val) {
                cryptoOutputDecrypt.value = '';
                cryptoDecryptError.textContent = '';
                return;
            }
            try {
                let result = '';
                cryptoDecryptError.textContent = '';
                switch (algo) {
                    case 'base64':
                        const b64Words = CryptoJS.enc.Base64.parse(val);
                        result = CryptoJS.enc.Utf8.stringify(b64Words);
                        if (!result) throw new Error('Invalid Base64 or encoding');
                        break;
                    case 'hex':
                        const hexWords = CryptoJS.enc.Hex.parse(val);
                        result = CryptoJS.enc.Utf8.stringify(hexWords);
                        if (!result) throw new Error('Invalid Hex or encoding');
                        break;
                    case 'url':
                        result = decodeURIComponent(val);
                        break;
                    case 'aes':
                        if (!key) {
                            result = '';
                            cryptoDecryptError.textContent = 'Secret Key is required for AES Decrypt';
                            break;
                        }
                        const decrypted = CryptoJS.AES.decrypt(val, key);
                        result = decrypted.toString(CryptoJS.enc.Utf8);
                        if (!result) throw new Error('Decryption failed (Wrong key or invalid data)');
                        break;
                }
                cryptoOutputDecrypt.value = result;
            } catch (e) {
                cryptoOutputDecrypt.value = '';
                cryptoDecryptError.textContent = 'Error: ' + e.message;
            }
        };

        cryptoInputEncrypt.addEventListener('input', runEncrypt);
        cryptoKeyEncrypt.addEventListener('input', runEncrypt);
        cryptoInputDecrypt.addEventListener('input', runDecrypt);
        cryptoKeyDecrypt.addEventListener('input', runDecrypt);
        cryptoSelectDecrypt.addEventListener('change', () => {
            cryptoKeyDecryptWrapper.style.display = cryptoSelectDecrypt.value === 'aes' ? 'block' : 'none';
            runDecrypt();
        });
    }

    // 4. Base Converter Logic
    const base10Input = document.getElementById('base-10');
    if (base10Input) {
        const baseInputs = {
            10: base10Input,
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
                } catch (err) { console.error('Conversion error', err); }
            });
        });
    }
});
