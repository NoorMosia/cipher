// HELPERS
function srand(seed) {
    var x = Math.sin(seed++);
    return Math.floor( (x - Math.floor(x)) * 19834);
}

let cipherController = (function () {
    class substitution {        //vigenere and OTP will inherit from here
        constructor(){}

        encode()
        {
            let newText = "";
            for (let i = 0; i < this.text.length ; i++) {
                newText += this.encodeChar(this.text[i]);
            }
            return newText;
        }

        decode() {
            let newText = "";
            for (let i = 0; i < this.text.length; i++) {
                newText += this.decodeChar(this.text[i]);
            }
            return newText;
        }
    }

    class vigenere extends substitution {
        constructor(text, codeword){
            super();
            this.codeword = codeword;
            this.text = text;
            this.codeWordTracker = 0;
        }

        encodeChar(char) {
            const shift = this.codeword[this.codeWordTracker].charCodeAt(0) - 32;
            let n = shift + char.charCodeAt(0);

            if (char.charCodeAt(0) == 10)
            {
                n = 9;
            }
            else if (n > 126) {
                n = n - 126 + 31;
            }

            this.codeWordTracker++;
            if (this.codeWordTracker == this.codeword.length) {
                this.codeWordTracker = 0;
            }

            return String.fromCharCode(n);
        }

        decodeChar(char) {
            const shift = this.codeword[this.codeWordTracker].charCodeAt(0) - 32;
            let n = char.charCodeAt(0) - shift;

            if (char.charCodeAt(0) == 9)
            {
                n = 10;
            }
            else if (n < 32) 
            {
                n += 126 - 31;
            }

            this.codeWordTracker++;
            if (this.codeWordTracker == this.codeword.length) {
                this.codeWordTracker = 0;
            }

            return String.fromCharCode(n);
        }
    }

    class oneTimePad extends substitution {
        constructor(text,seed) {
            super();
            this.seed = seed;
            this.text = text;
        }

        encodeChar(char) {
            let shift = (srand(this.seed) % (94 - 1 + 1)) + 1;
            let n = shift + char.charCodeAt(0);

            if (char.charCodeAt(0) == 10) {
                n = 9;
            }
            else if (n > 126) {
                n = n - 126 + 31;
            }
            return String.fromCharCode(n);
        }

        decodeChar(char) {
            let shift = (srand(this.seed) % (94 - 1 + 1)) + 1;
            let n = char.charCodeAt(0) - shift;

            if (char.charCodeAt(0) == 9) {
                n = 10;
            }
            else if (n < 32) {
                n += 126 - 31;
            }

            return String.fromCharCode(n);
        }
    }

    // -------------------------TRANSPOSITION----------------------------------------------------------------//
    class transposition {
        constructor(){}

        encode()
        {
            let newText = "";

            for (let i = 0; i < this.text.length; i++)
            {
                if (isOk(this.text)) {
                    newText += toupper(this.text[i]);
                }
            }

            return scramble(this.newText);
        }

        decode()
        {
            return unscramble(this.text);
        }

    }

    class swapScramble extends transposition {
        constructor(text) {
            super();
            this.text = text.trim();
        }

        scramble()
        {
            let newText = "";
            let textarr = [];

            for(let index = 0; index < this.text.length; index++)
            {
                textarr.push(this.text[index]);
            }

            let mid = parseInt(textarr.length / 2);
            let holder;

            if (textarr.length % 2 != 0) {
                for (let i = 1; i < mid + 1; i += 2)
                {
                    holder = textarr[mid - i];
                    textarr[mid - i] = textarr[mid + i];
                    textarr[mid + i] = holder;
                }
            }
            else {
                for (let i = 0; i < mid ; i += 2)
                {
                    holder = textarr[mid - i - 1];
                    textarr[mid - i - 1] = textarr[mid + i];
                    textarr[mid + i] = holder;
                }
            }

            for (let index = 0; index < this.text.length; index++) {
                newText += textarr[index];
            }

            return newText;
        }

        unscramble(text)
        {
            return this.scramble(text);
        }

    }

    return {
        doVigenere: (text, codeword) => {
            let newObj = new vigenere(text, codeword); 
            return newObj.encode();
        },
        undoVigenere: (text, codeword) => {
            let newObj = new vigenere(text, codeword);
            return newObj.decode();
        },
        doOTP: (text, seed) => {
            let newObj = new oneTimePad(text, seed);
            return newObj.encode();
        },
        undoOTP: (text, seed) => {
            let newObj = new oneTimePad(text, seed);
            return newObj.decode();
        },
        doScramble: (text) => {
            let newObj = new swapScramble(text);
            return newObj.scramble();
        },
        undoScramble: (text) => {
            let newObj = new swapScramble(text);
            return newObj.unscramble();
        }
    };

})();
/* ---------------------------------------------------------------------------------------------------------------- */
/*   UI */
/* --------------------------------------------------------------------------------------------------------------- */

var UIController = (function () {

    var DOMstrings = {
        method: '.method',
        codeword: '.codeword',
        type: '.type',
        button: '.button',
        text: '.mytext',
        encrypted: '.encrypted',
        userText: '.mytext',
        input: 'input',
        modal: '.modal',
        copy: '.cpy',
        clear_1: '.clear-mytext',
        clear_2: '.clear-encrypt-text',

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getDOMStrings: () => {
            return DOMstrings;
        },

        getInput: function () {
            return {
                method: document.querySelector(DOMstrings.method).value, 
                codeword: document.querySelector(DOMstrings.codeword).value,
                type: document.querySelector(DOMstrings.type).value,
                text: document.querySelector(DOMstrings.text).value,
            };
        },
    }


})();

/* ---------------------------------------------------------------------------------------------------------------- */
/*   CONTROLLER */
/* --------------------------------------------------------------------------------------------------------------- */

var controller = (function (cipherCtrl, UICtrl) {
    const DOM = UICtrl.getDOMStrings();

    const typeenc = document.querySelector(DOM.type);
    const inputField = document.querySelector(DOM.input);

    const encryptedText = document.querySelector(DOM.encrypted);
    const userText = document.querySelector(DOM.userText);

    const btn_copy = document.querySelector(DOM.copy);
    const btn_clear_1 = document.querySelector(DOM.clear_1);
    const btn_clear_2 = document.querySelector(DOM.clear_2);

    const checkCode = (code, message) => {
        if (!code || code < 1) {
            document.querySelector(DOM.modal).textContent = message;
            document.querySelector(DOM.modal).style.display = 'block';
            document.querySelector(DOM.modal).style.opacity = '1';

            setTimeout(() => {
                document.querySelector(DOM.modal).style.opacity = '0';
            }, 1000);
            setTimeout(() => {
                document.querySelector(DOM.modal).style.display = 'none';
            }, 1500);
            return null;
        }
        $('html, body').animate({ scrollTop: $(DOM.clear_2).offset().top }, 500);
        return 1;
    }

    const encryptVigenere = () => {
        text = UIController.getInput().text;
        codeword = UIController.getInput().codeword;
        checkCode(codeword, "codeword is required");
        return cipherController.doVigenere(text, codeword);
    }
    const decryptVigenere = () => {
        text = UIController.getInput().text;
        codeword = UIController.getInput().codeword;
        checkCode(codeword, "codeword is required")
        return cipherController.undoVigenere(text, codeword);
    }
    const encryptOTP = () => {
        text = UIController.getInput().text;
        seed = parseInt(UIController.getInput().codeword);
        checkCode(seed, "code number is required")
        return cipherController.doOTP(text, seed);
    }
    const decryptOTP = () => {
        const text = UIController.getInput().text;
        const seed = parseInt(UIController.getInput().codeword);
        checkCode(seed, "code number is required")
        return cipherController.undoOTP(text, seed);
    }
    const encryptScramble = () => {
        text = UIController.getInput().text;
        $('html, body').animate({ scrollTop: $(DOM.clear_2).offset().top }, 500);
        return cipherController.doScramble(text);
    }
    const decryptScramble = () => {
        text = UIController.getInput().text;
        $('html, body').animate({ scrollTop: $(DOM.clear_2).offset().top }, 500);
        return cipherController.undoScramble(text);
    }

    const setupEventListeners = function () {
        //listener to copy text
        btn_copy.addEventListener('click', () => {
            encryptedText.select();
            document.execCommand("copy");
            encryptedText.blur();
            $('html, body').animate({ scrollTop: $(".section__form").offset().top }, 500);

            document.querySelector(DOM.modal).textContent = "copied text";
            document.querySelector(DOM.modal).style.display = 'block';
            document.querySelector(DOM.modal).style.opacity = '1';

            setTimeout(() => {
                document.querySelector(DOM.modal).style.opacity = '0';
            }, 1000);
            setTimeout(() => {
                document.querySelector(DOM.modal).style.display = 'none';
            }, 1500);
        });

        //listener to clear text
        btn_clear_1.addEventListener('click', () => {
            userText.value = '';
        });
        btn_clear_2.addEventListener('click', () => {
            encryptedText.value = '';
        });

        //listeners for encryption type
        typeenc.addEventListener("click", function () {

            if(typeenc.value == 'SCRAMBLE') {
                inputField.style.display = "none";

            } else if (typeenc.value == 'OTP') {
                inputField.style.display = "inline";
                inputField.type = "number";
                inputField.placeholder = "enter number";

            } else if (typeenc.value == 'vigenere') {
                inputField.style.display = "inline";
                inputField.type = "text";
                inputField.placeholder = "codeword";
            }
        })

        //listeners for encrypting on click
        document.querySelector(DOM.button).addEventListener('click', () => {

            if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'vigenere') {
                encryptedText.value = encryptVigenere();

            } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'vigenere') {
                encryptedText.value = decryptVigenere();

            } else if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'OTP') {
                encryptedText.value = encryptOTP();

            } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'OTP') {
                encryptedText.value = decryptOTP();

            } else if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'SCRAMBLE') {
                encryptedText.value = encryptScramble();

            } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'SCRAMBLE') {
                encryptedText.value = decryptScramble();
                
            }
        });

        //listeners for encrypting on pressing enter key
        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                if(UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'vigenere') {
                document.querySelector(DOM.encrypted).value = encryptVigenere();

                } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'vigenere') {
                    document.querySelector(DOM.encrypted).value = decryptVigenere();

                } else if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'OTP') {
                    document.querySelector(DOM.encrypted).value = encryptOTP();

                } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'OTP') {
                    document.querySelector(DOM.encrypted).value = decryptOTP();
                    
                } else if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'SCRAMBLE') {
                    document.querySelector(DOM.encrypted).value = encryptScramble();

                } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'SCRAMBLE') {
                    document.querySelector(DOM.encrypted).value = decryptScramble();

                }
            }
        });
    };

    return {
        init: () => {
            setupEventListeners();
        }
    }
})(cipherController, UIController);

controller.init();

/* ---------------------------------------------------------------------------------------------------------------- */
/*   TESTS */
/* --------------------------------------------------------------------------------------------------------------- */