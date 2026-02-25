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

                // Expand parent nodes
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

    const handleJsonChange = () => {
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
    };

    jsonInput.addEventListener('input', handleJsonChange);

    btnFormat.addEventListener('click', () => {
        if (currentParsedData) {
            jsonInput.value = JSON.stringify(currentParsedData, null, 4);
        }
    });

    btnMinify.addEventListener('click', () => {
        if (currentParsedData) {
            jsonInput.value = JSON.stringify(currentParsedData);
        }
    });

    btnClear.addEventListener('click', () => {
        jsonInput.value = '';
        jsonError.textContent = '';
        currentParsedData = null;
        jsonTreeContainer.innerHTML = '';
        jsonSearchInput.value = '';
        searchCount.textContent = '0 matches';
    });

    // Crypto Logic Expanded
    const cryptoInput = document.getElementById('crypto-input');
    const cryptoOutputs = {
        md5: document.getElementById('crypto-md5'),
        sha256: document.getElementById('crypto-sha256'),
        sha512: document.getElementById('crypto-sha512'),
        sha1: document.getElementById('crypto-sha1'),
        enc: document.getElementById('crypto-b64-enc'),
        dec: document.getElementById('crypto-b64-dec')
    };

    cryptoInput.addEventListener('input', () => {
        const val = cryptoInput.value;
        if (!val) {
            Object.values(cryptoOutputs).forEach(out => out.value = '');
            return;
        }

        try {
            cryptoOutputs.md5.value = CryptoJS.MD5(val).toString();
            cryptoOutputs.sha256.value = CryptoJS.SHA256(val).toString();
            cryptoOutputs.sha512.value = CryptoJS.SHA512(val).toString();
            cryptoOutputs.sha1.value = CryptoJS.SHA1(val).toString();
        } catch (e) { console.error('Hash error', e); }

        // Base64 Encode
        try {
            const words = CryptoJS.enc.Utf8.parse(val);
            cryptoOutputs.enc.value = CryptoJS.enc.Base64.stringify(words);
        } catch (e) { cryptoOutputs.enc.value = 'Error'; }

        // Base64 Decode
        try {
            const decodedWords = CryptoJS.enc.Base64.parse(val);
            const decoded = CryptoJS.enc.Utf8.stringify(decodedWords);
            cryptoOutputs.dec.value = decoded || 'Invalid Base64';
        } catch (e) { cryptoOutputs.dec.value = 'Invalid Base64'; }
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
