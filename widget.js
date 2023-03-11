var iconID, title, orderedFixedStrings, inputHints, quoteSuffix, salesOrderSuffix, layoutWeights, customJS;


class Widget {
    constructor(iconID, title, orderedFixedStrings, inputHints, quoteSuffix, salesOrderSuffix, layoutWeights, customJS) {
      this.iconID = iconID;
      this.title = title;
      this.orderedFixedStrings = orderedFixedStrings;
      this.inputHints = inputHints;
      this.quoteSuffix = quoteSuffix;
      this.salesOrderSuffix = salesOrderSuffix;
      this.layoutWeights = layoutWeights;
      this.customJS = customJS;
    }
    hasValidInputs(extraParamsArray) { // checks if customer and initials are filled out, returns boolean
        document.querySelectorAll('input').forEach((input) => { //has to be called here so that when a non-parameter-requiring button is clicked it clears errors
            if (input.id === 'initials' || input.id === 'customer') {
            } else {
                input.classList.remove('input-error'); //resets all fields first (prevents notes that were invalid at any point from being highlighted when not in use)
            }
        });
        var returnValue = true;
        if ([document.getElementById('initials').value, document.getElementById('customer').value].includes('')) {
            document.getElementById('settings-button').click();
            document.getElementById('customer').focus();
            returnValue = false;
        }
        if(extraParamsArray) {
            for (var i = 0; i < extraParamsArray.length; i++) {
                if (extraParamsArray[i].value === '') {
                    extraParamsArray[i].classList.add('input-error');
                    returnValue = false;
                }
            }
        }
        
        return returnValue;
    }
    


  }