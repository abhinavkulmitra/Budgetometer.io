// Module

// BUDGET CONTROLLER

var budgetController = (function(){

    //calculations of all the input datas

    var Expense = function(id, desc, value){

        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;

};

// prototype of expense object to get percentage data 

Expense.prototype.calcPercentage = function( totalIncome) {
    if(totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100 );
    }
    else {
        this.percentage = -1;
    } 
};  

Expense.prototype.getPercentage = function() {
    return this.percentage;
}

    var Income = function (id, desc, value){

        this.id = id;
        this.desc = desc;
        this.value = value;

};



// calculating total income and expense
var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur){
        sum += cur.value;
    });
    data.totals[type] = sum; 
}

// Data-structures for storing data
    var data = {
        allItems : {
            exp: [],
            inc: []
    },
        totals: {
            exp: 0,
            inc: 0
    },
        Budget : 0,
        percentage: -1
}

    return { 
        addItem : function (type, des, val){
            var newItem, ID;

            //    [1 2 3 4 5], next ID = 6
            // [1 2 4 6 8], next ID = 9
            // ID = last ID + 1 OR ID = array[array.length - 1] + 1
     
            // create new ID
            //if the array is empty then put first item's ID = 0

            if(data.allItems[type].length === 0){
                ID = 0;
            }  else{
                ID = data.allItems[type][data.allItems[type].length- 1].id + 1;
            }
            
            // create new item based on type = 'exp' or 'inc'
            if(type === 'exp'){
                 newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                 newItem = new Income(ID, des, val);
            }

            //    push it into the data structure
            data.allItems[type].push(newItem);
     
            //    return the new element
            return newItem;
       
            },


            deleteItem: function(type , id) {
                var ids, index;
                
                // id = 3 
                // data.allItems[type][id];
                // [1 2 4 6 8]
                // index = 3
                //for each data type (exp or inc), this code makes an array of
                // ids among the desc, ids and values.


                ids = data.allItems[type].map(function(current) {
                   
                    return current.id ;
                });

                index = ids.indexOf(id);

                if(index !== -1) {
                    
                    data.allItems[type].splice(index, 1);   
                };

            },


            calculateBudget: function(){
                // add total income AND total expense
                calculateTotal('exp');
                calculateTotal('inc');

                // substract total income and total expense
                
                 data.budget = data.totals.inc - data.totals.exp;

                // calculate the expence amount percentage
                if(data.totals.inc > 0){
                
                    data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100) ;
                }
            },

            calculatePercentage : function() {
                
                // to calculate percentage of each element of the wxp array

                data.allItems.exp.forEach(function(cur) {
                    cur.calcPercentage(data.totals.inc);
                });
            },

            getPercentage: function () {
                var allPerc = data.allItems.exp.map(function(current){
                    return current.getPercentage();
                });
                return allPerc;
            },

            getBudget: function(){
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage
                }
            },
            testing: function(){
                console.log(data);
            }
        }

        

})();




// UI CONTROLLER
var UIController = (function() { 

    var DOMstrings = {
        inputType : '.add__type' ,
        inputDesc : '.add__description',
        value : '.add__value',
        btn : '.add__btn',
        incomeList : '.income__list',
        expenseList: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container : '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    }

    var formatNumber =  function (num, type) {

        var numSplit, int , dec;

        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands
        
        2310.4567 -> + 2,310.46
        2000 -> 2,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2);  
        
        numSplit = num.split('.');

        int = numSplit[0];

        if(int.length > 3) {
          int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3 ,3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-': '+') + ' ' + num;
    };

    var nodeListForEach = function(list, callback){    //a function which takes parameters and loops it to values of a func
               
        for(var i=0; i< list.length; i++){
            callback(list[i], i);       //parameters being provided to the callback func --> function(current, index)
        };

    };
    
    return {
        getInput: function () {
            return  {

             inputType : document.querySelector(DOMstrings.inputType).value,
             inputDesc : document.querySelector(DOMstrings.inputDesc).value,
             value : Number(document.querySelector(DOMstrings.value).value)
             };
     },

     addListItem: function(obj, type){
         
        var htmlString, newHTML,element;
        // create html string with placeholder text
        if(type === 'inc'){
            element = DOMstrings.incomeList;

        htmlString = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div> 
         <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">
         <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

        }
        else if(type === 'exp'){
            element = DOMstrings.expenseList;

            htmlString = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div>
        <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>
        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
        </div></div></div>`;
        }
  
        // Replace the placeholder text with some actual data

        newHTML = htmlString.replace('%id%', obj.id);
        newHTML = newHTML.replace('%desc%', obj.desc);
        newHTML = newHTML.replace('%value%', formatNumber(obj.value, type) );

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
                                                                                   
     },

     deleteListItem : function (selecorID){
         
        var childEl;
        childEl = document.getElementById(selecorID);

        childEl.parentNode.removeChild(childEl); //coz syntax is - parent.removeChild(child) in JS to remove a child.
     },


     clearFields: function(){

        var field, fieldArr;
        
        field = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.value);

        fieldArr =  Array.prototype.slice.call(field);

        fieldArr.forEach(function(current , index, array) { //to loop over each element of the array 

            current.value  = "";     //to clear the input blanks
        });
        fieldArr[0].focus();   //to bring the cursor from the first blank (or the first element of the array) 
    },

    displayBudget: function(obj) {

        var type ;
        obj.budget >=0 ? type = 'inc' : type = 'exp';

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');


        if(obj.percentage > 0){
            
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }
        },

        displayPercentage: function(percentages) {
  
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);  //creating a nodeList

            nodeListForEach(fields, function(current, index){   //the same function is being provided with parameters of 'fields' 
                                                                // and the callback func 
               
                if(percentages[index] > 0){    //codition being that -- there shud be some positive value in perc data
               
                    current.textContent = percentages[index] + '%';  //the text content of the nodeList being converted to that of perc list data//

               }
               else {
                   current.textContent = '---';
               }
                
            });
        },

     displayMonth: function() {
        var now, year; 
        now = new Date();
        // var chrisma = new Date(2019, 11, 25);

        // getting the month and year

        months = ['January' , 'Febuary', 'March', 'April', 'June' , 'July', 'August', 'September', 'October', 'November', 'December']; //month array
        month = now.getMonth(); //method to get the current month
        monthNow = months[month - 1]; //getting month from array
        year = now.getFullYear(); //method to get the year 
        document.querySelector(DOMstrings.dateLabel).textContent = monthNow + ', ' + year; //putting it into UI
     },   
        
     changeType : function() {
         
        var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' + DOMstrings.inputDesc + ',' +
            DOMstrings.value
        );  

        nodeListForEach(fields, function(cur){
            cur.classList.toggle('red-focus');

        });  
        
        document.querySelector(DOMstrings.btn).classList.toggle('red');
     },
     getDOMstrings : function(){
         return DOMstrings;
     }
    };
})();





// GLOBAL APP CONTROLLER

var controller = (function(budgetCtrl , UIctrl) { 
   
    var DOM = UIctrl.getDOMstrings();

    var setupEventListener =  function (){
    
    document.querySelector(DOM.btn).addEventListener('click', ctrlAddItem );

    document.addEventListener('keypress', function(event){
          
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

   
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem );    //setting up event listener to delete 
    // DOM.container is the refers to the parent tag cotaining the target tags ... which refers to them on event delegation   
       
    document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changeType);
    // event listerner on the +- icon in Ui to change the color
    };

    

    var updateBudget = function(){

         //1.  calculate the budget
         budgetCtrl.calculateBudget();

         //2. Return the budget
         var budget = budgetCtrl.getBudget();

         //3. display the budget on the ui \\\
         UIctrl.displayBudget(budget);
         
    };

    var updatePercentages = function(){

        // 1. Calculate percentages 
          budgetCtrl.calculatePercentage(); 

        // 2. Read percentages from the budget controller
          var percentages = budgetCtrl.getPercentage();

        // 3. Update the UI with the new percentages 
          UIctrl.displayPercentage(percentages);
    }



    var ctrlAddItem = function() { 
        var input, newItem;

        //1. get input data 

        input = UIctrl.getInput();
        
        // if input value is not a no. then wont be printed 
        if(input.inputDesc !== "" && !isNaN(input.value) && input.value >0){

        //2. add item to the budget controller

        newItem =  budgetCtrl.addItem(input.inputType,input.inputDesc,input.value);
        
        // console.log(newItem);
        //3.  add the item to the ui (in ui controller)
        
        UIctrl.addListItem(newItem, input.inputType);

        // 4. clear the fields 
        UIctrl.clearFields();

        // 5. calculate and update the budget.
        updateBudget();

        // 6. Calculate and update the percetages
        updatePercentages();

        };
    };


    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID ;  //variables 
      

            itemID =  event.target.parentNode.parentNode.parentNode.parentNode.id; // event.target targets the delete icon and .parentNode...
            //...  targets the parent of the element and thus, the variable targeting the parent tag's id.
        
          
        if(itemID){


            splitID = itemID.split('-');            //here,  itemID, a string, wraps around as an object when .split property is used 
             //.split property converts the object into an array 
            
            
            type = splitID[0];                    //indicating the first el of the array -  splitID
            ID = parseInt(splitID[1]);            //indicating the second el of the array

            // 1. Delete the item from the data structure
            
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from UI
            
            UIctrl.deleteListItem(itemID);

            // 3. update and show the new budget
            updateBudget();

            // 4. calculate and update percentages
            updatePercentages();
        }
        
    } 


    return {
        init: function() { 

            var budget = budgetCtrl.getBudget();
            
            UIctrl.displayBudget(budget);

            UIctrl.displayMonth();
        
             setupEventListener();
            
        }
    }

//    var z = budgetCtrl.publicTest(5);
//     return {
//         anotherPulic: function() {
//             console.log(z);
//         }
//     }


})(budgetController, UIController);


controller.init();


