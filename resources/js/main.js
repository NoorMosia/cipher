/* ---------------------------------------------------------------------------------------------------------------- */
/*   CIPHER */
/* --------------------------------------------------------------------------------------------------------------- */

function srand(seed) {
    var x = Math.sin(seed++);
    return Math.floor( (x - Math.floor(x)) * 1000);
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

String.prototype.astring = function(string)
{
    return this.substr(0, replacement.length);
}

        // -------------------------SUBSTITUTION----------------------------------------------------------------//

let cipherController = (function() {
        
    class substitution {        //vigenere and OTP will inherit from here
        constructor(){}

        encode()
        {
            let newText = "";
            for (let i = 0; i < this.text.length ; i++)
            {
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

    // -------------------------VIGENERE----------------------------------------------------------------//
    class vigenere extends substitution {
        constructor(text, codeword){
            super();
            this.codeword = codeword;
            this.text = text;
            this.codeWordTracker = 0;
        }

        checkCodeWord(codeword) {
            let isOk = false;

            for (let i = 0; i < codeword.length(); i++)
            {
                if (str[i] < 33 || str[i] > 126 && str.length() > 2) { //right chars and bigger than 2
                    isOk = true;
                }
            }
            return isOk;
        }

        encodeChar(char) {
            let shift = this.codeword[this.codeWordTracker].charCodeAt(0) - 32;

            let n = shift + char.charCodeAt(0);

            if (n > 126) {
                n = n - 126 + 31;
            }

            this.codeWordTracker++;
            if (this.codeWordTracker == this.codeword.length) {
                this.codeWordTracker = 0;
            }

            return String.fromCharCode(n);
        }

        decodeChar(char) {

            let shift = this.codeword[this.codeWordTracker].charCodeAt(0) - 32;

            let n = char.charCodeAt(0) - shift;

            if (n < 32) {
                n += 126 - 31;
            }

            this.codeWordTracker++;
            if (this.codeWordTracker == this.codeword.length) {
                this.codeWordTracker = 0;
            }

            return String.fromCharCode(n);
        }
    }

    // -------------------------OTP----------------------------------------------------------------//
    class oneTimePad extends substitution {

        constructor(text,seed) {
            super();
            this.seed = seed;
            this.text = text;
        }

        encodeChar(char) {
            let shift = (srand(this.seed) % (94 - 1 + 1)) + 1;
            let n = shift + char.charCodeAt(0);

            if (n > 126) {
                n = n - 126 + 31;
            }
            return String.fromCharCode(n);
        }

        decodeChar(char) {
            let shift = (srand(this.seed) % (94 - 1 + 1)) + 1;

            let n = char.charCodeAt(0) - shift;

            if (n < 32) {
                n += 126 - 31;
            }

            return String.fromCharCode(n);
        }
    }

    // -------------------------TRANSPOSITION----------------------------------------------------------------//
    class transposition {
        constructor(){}
        
        removeSpaces()
        {
            let newText = "";

            for (let i = 0; i < this.text.length(); i++)
            {
                if (text[i].charCodeAt(0) != 32) {
                    newText += this.text[i];
                }
            }
            return newText;
        }

        toUpperCase()
        {
            let newText = "";

            for (let i = 0; i < newText.length(); i++)
            {
                newText += toupper(this.text[i]);
            }
            return newText;
        }

        isOk() {
            return removeSpaces(this.text).length() > 2;
        }

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

    // -------------------------SWAPSCRAMBLE----------------------------------------------------------------//
    class swapScramble extends transposition {
        constructor(text) {
            super();
            this.text = text;
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

        // -------------------------SWAPSCRAMBLE----------------------------------------------------------------//

        unscramble(text)
        {
            return this.scramble(text);
        }

    }

    // -------------------------COLUMNAR----------------------------------------------------------------//
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
        text: '.text',
        encrypted: '.encrypted'
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
                method: document.querySelector(DOMstrings.method).value, // 
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

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector('option').addEventListener('mousedown', () => {
            console.log("yebo");
        });

        document.querySelector(DOM.button).addEventListener('click', () => {
            if(UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'vigenere') {
                document.querySelector(DOM.encrypted).textContent = encryptVigenere();

            } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'vigenere') {
                document.querySelector(DOM.encrypted).textContent = decryptVigenere();

            } else if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'OTP') {
                document.querySelector(DOM.encrypted).textContent = encryptOTP();

            } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'OTP') {
                document.querySelector(DOM.encrypted).textContent = decryptOTP();
            } else if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'SCRAMBLE') {
                document.querySelector(DOM.encrypted).textContent = encryptScramble();

            } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'SCRAMBLE') {
                document.querySelector(DOM.encrypted).textContent = decryptScramble();

            }
        });

        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                console.log("hallo");
                if(UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'vigenere') {
                document.querySelector(DOM.encrypted).textContent = encryptVigenere();

                } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'vigenere') {
                    document.querySelector(DOM.encrypted).textContent = decryptVigenere();

                } else if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'OTP') {
                    document.querySelector(DOM.encrypted).textContent = encryptOTP();

                } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'OTP') {
                    document.querySelector(DOM.encrypted).textContent = decryptOTP();
                    
                } else if (UIController.getInput().method === 'encrypt' && UIController.getInput().type === 'SCRAMBLE') {
                    document.querySelector(DOM.encrypted).textContent = encryptScramble();

                } else if (UIController.getInput().method === 'decrypt' && UIController.getInput().type === 'SCRAMBLE') {
                    document.querySelector(DOM.encrypted).textContent = decryptScramble();

                }
            }
        });
    };

    let encryptVigenere = () => {
        text = UIController.getInput().text;
        codeword = UIController.getInput().codeword;
        return cipherController.doVigenere(text, codeword);
    }
    let decryptVigenere = () => {
        text = UIController.getInput().text;
        codeword = UIController.getInput().codeword;
        return cipherController.undoVigenere(text, codeword);
    }
    let encryptOTP = () => {
        text = UIController.getInput().text;
        seed = parseInt(UIController.getInput().codeword);
        return cipherController.doOTP(text, seed);
    }
    let decryptOTP = () => {
        text = UIController.getInput().text;
        seed = parseInt(UIController.getInput().codeword);
        return cipherController.undoOTP(text, seed);
    }
    let encryptScramble = () => {
        text = UIController.getInput().text;
        return cipherController.doScramble(text);
    }
    let decryptScramble = () => {
        text = UIController.getInput().text;
        return cipherController.undoScramble(text);
    }

    return {
        init: () => {
            setupEventListeners();
        }
    }
})(cipherController, UIController);

controller.init();

/* ---------------------------------------------------------------------------------------------------------------- */
/*   TEST */
/* --------------------------------------------------------------------------------------------------------------- */


// let encoded = cipherController.doVigenere('{{ Hello World! }}', 'BANANA');
// console.log(cipherController.undoVigenere(encoded, 'BANANA'));

// let encodedOTP = cipherController.doOTP('{{ Hello World! }}', 10);
// console.log(cipherController.undoOTP(encodedOTP, 10));

// let encodedScramble = cipherController.doScramble('SADWORLD');
// console.log(cipherController.undoScramble(encodedScramble));


