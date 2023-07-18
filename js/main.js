//Variables globales

const resultsCalc = document.querySelector("#results_calc");
const showResult = document.querySelector('.show-result');
let showOp = document.querySelector('#text');
const onOffButton = document.getElementById('onOffBtn');
let currentOperations = [];
let currentOperationsForView = [];
let equalsAvailable = false;


//Listener para cuando se presione click sobre el botón Encender/Apagar
onOffButton.addEventListener('click', () => {
    cleanValues();
    showOp.classList.toggle('turn-on-off');
    equalsAvailable = !equalsAvailable;
});

/***
 * Función que guarda el valor indicado en el parametro al storage del browser
 *
 * @param value Es el valor a guardar en el storage del browser
 */
const saveValueForANS = (value) => {
    localStorage.setItem("ANS", value);
}

/***
 * Recupera el valor guardado en el storage del browser para la clave ANS
 * @returns {string} El valor recuperado desde el storage del browser para la clave ANS
 */
const getANSValue = () => {
    return localStorage.getItem("ANS");
}

/***
 * Resetea las variables que contienen los valores ingresados
 */
const cleanValues = () => {
    resultsCalc.value = '';
    showResult.textContent = '';
    showOp.textContent = '';
    currentOperations = [];
    currentOperationsForView = [];
}

/***
 * Agrega al display la operación o número correspondiente al botón presionado
 * @param input
 * @param character
 */
const addToDisplay = (input, character) => {
    showOp.textContent += character.trim();
    input.value += character.trim();

}

const backspace = (resultCalc) => {
    resultCalc.value = resultCalc.value.substring(0, resultCalc.value.length - 1)
    currentOperations.pop();
    currentOperationsForView.pop();
}

const printResult = (calc) => {
    try {
        showResult.textContent = math.evaluate(calc.value)
        return true;
    }catch (exception) {
        //debugger;
        console.error(exception.name)
        //showResult.textContent = exception.message;
    }

    return false;
}

/***
 * Agrega la operación seleccionada a las variables globales
 * @param operationText
 * @param operation
 */
const addSelectedOperation = (operationText, operation) => {
    showOp.textContent += operationText;
    resultsCalc.value += operation
    currentOperations.push(operation);
    currentOperationsForView.push(operationText);
}

/***
 * Funcion que evalua el botón presionado
 */
const evaluate = () => {
    document.addEventListener('click', e => {
        let target = e.target;
        debugger;

        if (target.tagName === "BUTTON" && equalsAvailable) { //Valido que sea el click sobre un botón y se haya presionado la tecla on/off
            let buttonPressedValue = target.value.trim();
            switch (true){
                case buttonPressedValue === "equal":
                    if(!printResult(resultsCalc)) showResult.textContent = 'Error de sintaxis';
                    break;
                case buttonPressedValue === "clear":
                    cleanValues();
                    break;
                case buttonPressedValue === "del":
                    backspace(resultsCalc);

                    resultsCalc.value = '';
                    currentOperations.forEach((value) => {
                        resultsCalc.value += value;
                    });
                    showOp.textContent = '';
                    currentOperationsForView.forEach((value) => {
                        showOp.textContent += value;
                    });
                    break;
                case (buttonPressedValue === "m+"):
                    saveValueForANS(showResult.textContent);
                    break;
                case (buttonPressedValue === "ans"):
                    if(getANSValue() !== undefined && getANSValue() !== null) {
                        showOp.textContent += getANSValue();
                        resultsCalc.value = showOp.textContent;
                        currentOperations.push(getANSValue());
                        currentOperationsForView.push(getANSValue());
                    }
                    break;
                case (buttonPressedValue === "pi"):
                    showOp.textContent += math.pi;
                    resultsCalc.value = showOp.textContent;
                    currentOperations.push("pi");
                    currentOperationsForView.push(math.pi);
                    break;
                case (buttonPressedValue === "ln"):
                    addSelectedOperation(buttonPressedValue + "(", "log(e, ");
                    break;
                case (buttonPressedValue === "log"):
                    addSelectedOperation(buttonPressedValue + "(", "log10(");
                    break;
                case (buttonPressedValue === "XX"):
                    addSelectedOperation(String.fromCodePoint(0xB2), "^(2)");
                    break;
                case (buttonPressedValue === "XXX"):
                    addSelectedOperation(String.fromCodePoint(0xB3), "^(3)");
                    break;
                case (buttonPressedValue === String.fromCodePoint(0x221A)):
                    addSelectedOperation(buttonPressedValue + "(", "sqrt(");
                    break;
                case (buttonPressedValue === 'exp'):
                    addSelectedOperation(buttonPressedValue + "(", "exp(");
                    break;
                case (buttonPressedValue === 'fact'):
                    addSelectedOperation(buttonPressedValue + "(", 'factorial(');
                    break;
                default:
                    addToDisplay(resultsCalc, target.value);
                    if(target.value !== "") {
                        currentOperations.push(target.value);
                        currentOperationsForView.push(target.value);
                    }
                    break;
            }
        }
    });
}

/************ On Load ************/
window.onload = () => evaluate();
