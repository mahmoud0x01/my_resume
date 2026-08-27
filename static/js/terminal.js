/* ============================================================
   TERMINAL CODE BLOCKS — copy-to-clipboard
   ============================================================ */

(function () {
    'use strict';

    function codeOf(block) {
        var pre = block.querySelector('pre');
        return pre ? pre.innerText.replace(/\n+$/, '') : '';
    }

    function flash(btn, label, ok) {
        var original = btn.getAttribute('data-label') || btn.textContent;
        btn.setAttribute('data-label', original);
        btn.textContent = label;
        btn.classList.toggle('term-copy--done', !!ok);
        window.setTimeout(function () {
            btn.textContent = original;
            btn.classList.remove('term-copy--done');
        }, 1600);
    }

    function copy(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy') ? resolve() : reject();
            } catch (err) {
                reject(err);
            }
            document.body.removeChild(ta);
        });
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.term-copy');
        if (!btn) return;
        var block = btn.closest('.term-block');
        if (!block) return;
        e.preventDefault();
        copy(codeOf(block)).then(
            function () { flash(btn, 'Copied', true); },
            function () { flash(btn, 'Failed', false); }
        );
    });

    /* Interactive prompt — any input echoes and gets a fixed Mahmoud reply */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var input = e.target.closest('.term-input');
        if (!input) return;
        e.preventDefault();
        var block = input.closest('.term-block');
        if (!block) return;
        var output = block.querySelector('.term-output');
        if (!output) return;
        var promptText = input.closest('.term-input-line').querySelector('.term-prompt').textContent;

        var echo = document.createElement('div');
        echo.className = 'term-echo';
        var promptSpan = document.createElement('span');
        promptSpan.className = 'term-prompt';
        promptSpan.textContent = promptText;
        echo.appendChild(promptSpan);
        echo.appendChild(document.createTextNode(' ' + input.value));
        output.appendChild(echo);

        var resp = document.createElement('div');
        resp.className = 'term-response';
        resp.textContent = '{ mahmoud : Are you looking for an RCE in my portofolio ? }';
        output.appendChild(resp);

        input.value = '';
        output.scrollTop = output.scrollHeight;
    });

    /* Clicking the console area focuses the prompt (unless on a button/input) */
    document.addEventListener('click', function (e) {
        var consoleEl = e.target.closest('.term-console');
        if (!consoleEl) return;
        if (e.target.closest('.term-input') || e.target.closest('.term-copy')) return;
        var inp = consoleEl.querySelector('.term-input');
        if (inp) inp.focus();
    });
})();
