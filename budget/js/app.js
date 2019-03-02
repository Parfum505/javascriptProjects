const budgetController = (function () {
    const Expense = function (id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    const Income = function (id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    const calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function (item) {
            sum += item .value;
        });
        data.totals[type] = sum;
    };
    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthList[(new Date).getMonth()];
    return {
        addItem: function (type, desc, val) {
            let newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(ID,desc, val);
            } else if (type === 'inc') {
                newItem = new Income(ID,desc, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, id) {
            let ids, index;
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },
        getMonth: function() {
            return month;
        },
        data: function () {return data.allItems;}
    }
})();
const UIController = (function () {
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        expensesContainer: '.expenses__list',
        incomeContainer: '.income__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        budgetTitle: '.budget__title--month',
        container: '.container'
    };
    return {
        getInput: function () {
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            let html, idType, element;
            if (type === 'exp') {
                idType = 'exp';
                element = DOMstrings.expensesContainer;
            } else if (type === 'inc') {
                idType = 'inc';
                element = DOMstrings.incomeContainer;
            }
            html = '<div class="item clearfix" id="'+ idType +'-'+ obj.id +'">\n' +
                        '<div class="item__description">'+ obj.description +'</div>\n' +
                        '<div class="right clearfix">\n' +
                            '<div class="item__value">'+ obj.value +'</div>\n' +
                            '<div class="item__delete">\n' +
                                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                            '</div>\n' +
                        '</div>\n' +
                    '</div>';
            document.querySelector(element).insertAdjacentHTML('beforeend', html);

        },
        deleteListItem: function(id) {
            const item = document.getElementById(id);
            item.parentNode.removeChild(item);
        },
        clearFields: function() {
            let fields;
            fields = Array.prototype.slice.call(document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue));
           fields.forEach(function (current) {
               current.value = '';
           });
            fields[0].focus();
        },
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },
        displayBudgetTitle: function(month) {
          document.querySelector(DOMstrings.budgetTitle).textContent = month;
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();

const appController = (function (budgetCtrl, UICtrl) {
    const setupEventListeners = function () {
        const DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keyup', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                if (event.target.className === DOM.inputDescription.substring(1)){
                    document.querySelector(DOM.inputValue).focus();
                } else if (event.target.className === DOM.inputValue.substring(1)){
                    ctrlAddItem();
                } else {
                    document.querySelector(DOM.inputDescription).focus();
                }
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    const updateBudget = function () {
        budgetCtrl.calculateBudget();
        let budget = budgetCtrl.getBudget();
        // console.log(budget);
        UICtrl.displayBudget(budget);
    };
    const ctrlAddItem = function(){
        let input, newItem;
        input = UICtrl.getInput();
        if (input.description && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem,input.type );
            UICtrl.clearFields();
            updateBudget();
        }
    };
    const ctrlDeleteItem = function (event) {
        if (event.target.parentNode.className === 'item__delete--btn') {
            const item = event.target.parentNode.parentNode.parentNode.parentNode.id;
            // console.log(itemId);
            if (item) {
                const itemType = item.split('-')[0];
                const itemId = item.split('-')[1];
                if (itemType && itemId) {
                    UICtrl.deleteListItem(item);
                    budgetCtrl.deleteItem(itemType, parseInt(itemId));
                    updateBudget();
                }
            }
        }
    };

    return{
        init: function () {
            UICtrl.displayBudgetTitle(budgetCtrl.getMonth());
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                percentage: 0,
                totalInc: 0,
                totalExp: 0
            });
        }
    }

})(budgetController, UIController);

appController.init();