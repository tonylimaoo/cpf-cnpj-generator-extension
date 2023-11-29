window.generateDoc = {}

/**
* Method for generating CPF.
* @param {boolean} pontuacao - If true it generates the document number with correct non number characters.
* @returns {String} Generated document id in string format.
*/
generateDoc.cpf = (pontuacao = true) => {
    return generateDocument(9, pontuacao)
};

/**
* Method for generating CNPJ.
* @param {boolean} pontuacao - If true it generates the document number with correct non number characters.
* @returns {String} Generated document id in string format.
*/
generateDoc.cnpj = (pontuacao = true) => {
    return generateDocument(12, pontuacao)
};

function generateDocument(initialDigits, pontuacao) {
    let doc = String(randomDocumentNumber(initialDigits));

    let firstVerificationDigit = getVerificationDigit(doc);
    let secondVerificationDigit = getVerificationDigit(doc.concat(firstVerificationDigit))

    doc += (String(firstVerificationDigit) + String(secondVerificationDigit))
    return pontuacao ? addNonNumberCharacters(initialDigits, doc) : doc
}

function generateValidNumber() {
    let randomNumber = Math.random()
    if (10 * randomNumber < 1) return generateValidNumber();
    return randomNumber
}

function randomDocumentNumber(digits) {
    return digits == 9 ? Math.floor(generateValidNumber() * (10 ** digits)) : (Math.floor(generateValidNumber() * (10 ** 8)) * 10000 + 1)
}

function getVerificationDigit(documentString) {

    let mask = [];

    switch (documentString.length) {
        case 12: mask = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            break;
        case 13: mask = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            break;
        case 9: mask = [10, 9, 8, 7, 6, 5, 4, 3, 2]
            break;
        case 10: mask = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
            break;
    }


    let randomNumberArrayWeighted = documentString.split('').map((digit, index) => +(Number(digit) * (mask[index])));
    let digitSumMod11 = randomNumberArrayWeighted.reduce((acc, curr) => acc + curr, 0) % 11
    return digitSumMod11 < 2 ? '0' : (11 - digitSumMod11).toString()
}


function addNonNumberCharacters(initialDigits, documentString) {
    let documentArray = documentString.split('');
    if (initialDigits == 12) {
        documentArray.splice(2, 0, ".")
        documentArray.splice(6, 0, ".")
        documentArray.splice(10, 0, "/")
        documentArray.splice(-2, 0, "-")
    }

    if (initialDigits == 9) {
        documentArray.splice(3, 0, ".")
        documentArray.splice(7, 0, ".")
        documentArray.splice(-2, 0, "-")
    }
    return documentArray.join('')
}

document.querySelectorAll('.generate-button').forEach((e) => e.addEventListener('click', (event) => {
    event.preventDefault();

    const ponc = document.querySelector('.ponctuation input:checked');
    if (event.target.id === 'cpf') {
        if (ponc !== null) {
            generatedDoc = generateDoc.cpf();
        } else {
            generatedDoc = generateDoc.cpf(false);
        }
    } else {
        if (ponc !== null) {
            generatedDoc = generateDoc.cnpj();
        } else {
            generatedDoc = generateDoc.cnpj(false);
        }
    }

    document.querySelector(".generated-doc").value = generatedDoc;

    navigator.clipboard.writeText(generatedDoc)
        .then(() => console.log('Document copied to clipboard'))
        .then(() => "Erro ao copiar");
}))