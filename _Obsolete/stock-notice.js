var brokersIndex;
var brokers;
var r;
var varStockNoticeParams;

r = document.querySelector(':root');

    varStockNoticeParams = [ //lazy and don't want to do charAt to change case its just not worth. Honestly might be more efficient even
    ["lowStock", "LowStock"],
    ["brokerPrice", "BrokerPrice"],
    ["mPQ", "MPQ"],
    ["mOQ", "MOQ"],
    ["lT", "LT"]
]

brokersIndex = 0;
brokers = [
    'Int\'l Broker',
    'Win Source',
    'LCSC',
    'Utmel',
    'NACSemi',
    'Worldway',
    'CXDA',
    'Heisener',
    'Quest Components',
    'TME Electronics'
];


//EVENT LISTENER METHODS
//
// 5 == number of radio buttons 
function onRadioButtonClick() { //sets radio button styles for the cost inclusion group
    for (var i = 1; i < 5; i++) {
        if (document.getElementById('costOption' + i) != event.target) {
            document.getElementById('costOption' + i).parentNode.className = 'radio-item-deselected';
        }
    }
    if(event.target.id === 'requiresApproval') {
        document.getElementById('costOption2').parentNode.className = 'radio-item-selected';
    } else {
        event.target.parentNode.className = 'radio-item-selected';
    }
}

function onAdvInputChange(header, label, icon) { //updates formatting/visible note portions for stock notice inputs
    if (event.target.value !== '') {
        icon.style.color = getComputedStyle(r).getPropertyValue("--primary");
        header.style.color = getComputedStyle(r).getPropertyValue("--primary");
        label.style.display = "block";
    } else {
        icon.style.color = 'black';
        header.style.color = 'black';
        label.style.display = "none";
    }
}

function onHeaderClick(prefix, header, array, suffix, button){

    if (button == 0) {
        window[array + 'Index'] +=1;
        if (window[array + 'Index'] == window[array].length){
            window[array + 'Index'] = 0;
        }
    } else {
        window[array + 'Index'] -=1;
        if (window[array + 'Index'] == -1){
            window[array + 'Index'] = window[array].length -1;
        }
    }
   
    header.innerHTML = prefix + window[array][window[array + 'Index']] + suffix;
    updateLabels();
}


function updateLabels() { // updates labels to reflect what will be returned in the final note
    for (var i = 0; i < varStockNoticeParams.length; i++) {
        document.getElementById(varStockNoticeParams[i][0] + 'AdvLabel').innerHTML = window['get' + varStockNoticeParams[i][1] + 'String']();
    }
}

function onRequiresApprovalClick(forceCostInclusion) { //auto selects cost inclusion based on customer approval state
    if (event.target.checked == true) {
        forceCostInclusion.checked = true;
        onRadioButtonClick();
    }
}

function onRequestAlternateClick(forceCostInclusion) { //auto selects cost inclusion based on customer approval state
    if (event.target.checked == true) {
        forceCostInclusion.checked = true;
    }
}

function onCopyAdvClick() { //compiles final copy output
        if (hasValidInputs() && [getLowStockString(), getBrokerPriceString(), getMPQString(), getMOQString(), getLTString()].join("").length != 0) {
            var output = getNotePrefix() + getLowStockString() + getBrokerPriceString() + getMPQString();

            if (![getMPQString(), getMOQString(), getLTString()].includes('')) {
                output += "," + getMOQString() + "," + getLTString();
            } else {
                output += getMOQString() + getLTString();
            }
            if (document.getElementById('requiresApproval').checked) {
                output += ", is this acceptable?" + getCheckedCostInclusion("costInclude");
            } else if (getCheckedCostInclusion("costInclude").toLowerCase() !== '') {
                output += "." + getCheckedCostInclusion("costInclude");
            } 
            if(document.getElementById("requestAlternate").checked && !output.includes("supply or suggest")){
                output +=  ` Can ${document.getElementById("customer").value} supply or suggest alternates?`
            }
            output += appendOtherNotes('Adv');
            navigator.clipboard.writeText(output);
        }
}

//GET NOTE SUBSTRING METHODS
//
function getLowStockString() { //returns gramatically correct substring for Low Stock notes
    if (document.getElementById('lowStockAdv').value === '') {
        return '';
    } else {
        return `Insufficient (${document.getElementById('lowStockAdv').value}pc) stock available`;
    }
}

function getBrokerPriceString() { //returns gramatically correct substring for Broker Pricing notes
    if (document.getElementById('brokerPriceAdv').value === '') {
        return '';
    } else {
        if (getLowStockString() !== '') {
            return ` through ${(brokers[brokersIndex] || "int'l broker")} @ $` + document.getElementById('brokerPriceAdv').value + "/pc";
        } else {
            return `Stock available through ${(brokers[brokersIndex] || "int'l broker")} @ $` + document.getElementById('brokerPriceAdv').value + "/pc";
        }
    }
}

function getMPQString() { //returns gramatically correct substring for MPQ notes
    if (document.getElementById('mPQAdv').value === '') {
        return '';
    } else {
        if (getLowStockString() !== '' || getBrokerPriceString() !== '') {
            return " with MPQ of " + document.getElementById('mPQAdv').value;
        } else {
            return "Stock available with MPQ of " + document.getElementById('mPQAdv').value;
        }
    }
}

function getMOQString() { //returns gramatically correct substring for MOQ notes
    if (document.getElementById('mOQAdv').value === '') {
        return '';
    } else {
        if (getMPQString() !== '' && document.getElementById('lTAdv').value === '') {
            return " and MOQ of " + document.getElementById('mOQAdv').value;
        } else if (getMPQString() !== '') {
            return " MOQ of " + document.getElementById('mOQAdv').value
        } else if (getLowStockString() !== '' || getBrokerPriceString() !== '') {
            return " with MOQ of " + document.getElementById('mOQAdv').value;

        } else {
            return "Stock available with MOQ of " + document.getElementById('mOQAdv').value;
        }
    }
}

function getLTString() { //returns gramatically correct substring for LT notes
    if (document.getElementById('lTAdv').value === '') {
        return '';
    } else {
        if (document.getElementById('lTAdv').value.includes('/') || document.getElementById('lTAdv').value.includes('-')) {
            if (getMPQString() !== '' || getMOQString() !== '') {
                return " and expected ship date of " + document.getElementById('lTAdv').value;
            } else if (getLowStockString() !== '' || getBrokerPriceString() !== '') {
                return " with expected ship date of " + document.getElementById('lTAdv').value;
            } else {
                return "Stock expected " + document.getElementById('lTAdv').value;
            }
        } else {
            if (getMPQString() !== '' || getMOQString() !== '') {
                return " and " + document.getElementById('lTAdv').value + "w LT";
            } else if (getLowStockString() !== '' || getBrokerPriceString() !== '') {
                return " with " + document.getElementById('lTAdv').value + "w LT";
            } else {
                return "Stock available with " + document.getElementById('lTAdv').value + "w LT";
            }
        }
    }
}

function getCheckedCostInclusion(groupName) { //returns gramatically correct substring for Cost Inclusion notes
    var radioGroup = document.getElementsByName(groupName);
    if (radioGroup[0].checked) {
        return "";
    } else if (radioGroup[1].checked) {
        return substituteByView(" ", " Cost included in quote.")
    } else if (radioGroup[2].checked) {
        return substituteByView(" ", " Distribution cost included in quote.")
    } else {
        return `${substituteByView("", " No cost included in quote.")} Can ` + document.getElementById('customer').value + " supply or suggest alternates?"
    }
}



