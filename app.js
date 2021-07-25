const numbers = document.querySelectorAll('[data-number]');
const operators = document.querySelectorAll('[data-operator]');
const clear = document.querySelector('[data-clear]');
const removeLast = document.querySelector('[data-delete]');
const equalSign = document.querySelector('[data-equals]');
const display = document.querySelector('.display p');
const colorInactive = '#FDEC37';
const colorActive = '#93e6f3';


// Create calculator object
const calculator = {
    currentValue: '',
    previousValue: '',
    operation: '',

    addInput(value) {
        // Ensures that "." can only be used once
        if (value.innerText === '.') {
            if (this.currentValue.includes('.')) {
                return;
            } else if (this.currentValue === '') {
                // Add a "0" if the first "number" is "."
                this.displayValue('0') + this.displayValue(value.innerText)
            } else {
                this.displayValue(value.innerText);
            }
        } else if (this.currentValue === '0' && value.innerText !== '0') { // Ensure not more than 1 zero is on screen
            this.currentValue = ''
            this.displayValue(value.innerText)
        } else if (this.currentValue === '0' && this.currentValue.length === 1) { // Make sure you cannot enter more zeros if the current value is already just a zero
            return;
        } else {
            this.displayValue(value.innerText)
        }
    },

    chooseOperator(operator) {
        if (this.operation !== '') { // Compute with previous operand only when operand value is not empty
            this.compute(this.operation);
        } else { // If previous operand is empty then either compute with current or assign current value to previous
            if (this.previousValue !== '') { // Compute with current operand only when previous value is not empty
                this.compute(operator.innerText);
            } else if (this.currentValue !== '') {
                this.previousValue = this.currentValue; // If previous value is empty, just assign the current to previous
            } else {
                return;
            }
        }

        this.operation = operator.innerText;
        this.currentValue = '';
        display.innerText = this.previousValue;
    },
    
    compute(operand) {
        switch (operand) {
            case '+':
                this.previousValue = Number(this.previousValue) +  Number(this.currentValue);

                break;
            case '-':
                this.previousValue = Number(this.previousValue) - Number(this.currentValue);
                break;
            case '÷':
                if (this.currentValue !== '') {
                    this.previousValue = Number(this.previousValue) / Number(this.currentValue);
                }
                break;
            case 'x':
                if (this.currentValue !== '') {
                    this.previousValue = Number(this.previousValue) * Number(this.currentValue);
                }
                break;
            default:
                break;
        }
    },

    displayValue(value) {
        if (this.currentValue == '') {
            this.currentValue = value;
        } else {
            this.currentValue += value;
        }
        
        display.innerText = this.currentValue;

        // Change text size in case numbers get very long
        if (display.innerText.length < 27) {
            display.style.fontSize = '2rem';
        } else if (display.innerText.length < 70) {
            display.style.fontSize = '1.2rem';
        } else if (display.innerText.length < 108) {
            display.style.fontSize = '1rem';
        } else {
            display.innerText = 'The number in too big!';
            this.currentValue = '';
            this.previousValue = '';
            this.operation = '';
            return;
        }
    },

    equals() {
        if (this.previousValue === '') {
            return;
        } else {
            this.compute(this.operation);
            this.currentValue = '';
            this.operation = '';
            display.innerText = this.previousValue;
        }
        operators.forEach(operator => {
            operator.style.backgroundColor = colorInactive;
        })
    },

    deleteLast() {
        if (this.currentValue === '') { // Handle the deletion in case user has clicked on operation button already
            return; // If operation button was already clicked, don't delete current value
        } else {
            this.currentValue = this.currentValue.slice(0, -1);
            display.innerText = this.currentValue;
        }
    },

    clear() {
        this.currentValue = '';
        this.previousValue = '';
        display.innerText = '0';
        display.style.fontSize = '2rem';
        operators.forEach(operator => {
            operator.style.backgroundColor = colorInactive;
        })
    },

    colorChange(button) {
        operators.forEach(operator => {
            operator.style.backgroundColor = colorInactive;
        })
        button.style.backgroundColor = colorActive;
    }
}



// Handle user's input
numbers.forEach(number => {
    number.addEventListener('click', () => calculator.addInput(number));
});


// Listen for clicks on operand and handle the results
operators.forEach(operator => {
    operator.addEventListener('click', () => {
        calculator.chooseOperator(operator);
        calculator.colorChange(operator);
    })
})


// Handle the results and update the values when "=" is pressed
equalSign.addEventListener('click', () => calculator.equals());


// Removes last digit on click
removeLast.addEventListener('click', () => calculator.deleteLast());


// Clear display and all data
clear.addEventListener('click', () => calculator.clear());



