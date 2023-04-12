//INDEX


var allOptions;
var mkePreset;
var custResponsePreset;
var salesOrderPreset;
var numWidgetSlots;
var quoteWidgets;
var salesorderWidgets;
var salesOrderMode;



allOptions = [ //List of all current widgets and associated tickers. THIS IS THE DB IT SHOULD PROBABLY BE A JSON BUT I DONT FEEL LIKE DOING THAT RIGHT NOW
    ["<BLANK>", "dum"], 
    ["No Stock", "nsk"],
    ["EU Stock", "eus"],
    ["P/N Not Found", "pnf"],
    ["Quoted with Alternate", "qwa"],
    ["Low Stock", "lst"],
    ["Stock with Lead Time", "swl"],
    ["Confirm P/N Correct", "cpc"],
    ["Spec/BOM Desc Mismatch", "sbm"],
  //  ["Packaging Discrepancy", "pkd"],
    ["Quoted As Supplied", "qas"],
   // ["Quoted With Inventory", "qwi"],
    ["Sourcing Partial", "srp"],
    ["Alternate Approved", "caa"],
    ["Customer Approval", "afc"],
    ["Sourcing From Inventory", "sfi"],
    ["Customer Supplied", "cts"],
    //Receiving Mode
    ["Rec'd Alternate", "rca"],
    ["Unprotected MSL", "msl"],
    ["Top Marking Unverifiable", "tmu"],
    ["Short Parts", "shp"],
    ["Rec'd Exact QTY", "eqt"],
    ["Didn't Receive Line", "drl"],
    ["Added Alt Package", "aap"],
    ["Label/BOM Mismatch", "lbm"]
    
];

mkePreset = [
    ["<BLANK>", "dum"],                            //dummy doesn't need to be here but tbh it just helps with consistency
    ["No Stock", "nsk"],
    ["Low Stock", "lst"],
    ["Quoted As Supplied", "qas"],
    ["Quoted with Alternate", "qwa"],
    ["Spec/BOM Desc Mismatch", "sbm"],
 //   ["Packaging Discrepancy", "pkd"],
    ["Confirm P/N Correct", "cpc"]
];

custResponsePreset = [
    ["<BLANK>", "dum"],
    ["Quoted with Alternate", "qwa"],
    ["Alternate Approved", "caa"],
    ["Alt From Customer", "afc"],
    ["Customer Supplied", "cts"],
    ["EU Stock", "eus"],
    ["P/N Not Found", "pnf"],
    ["Stock with Lead Time", "swl"],
    ["Confirm P/N Correct", "cpc"]
];

salesOrderPreset = [
    ["<BLANK>", "dum"], 
    ["No Stock", "nsk"],
    ["P/N Not Found", "pnf"],
    ["Quoted with Alternate", "qwa"],
    ["Stock with Lead Time", "swl"],
    ["Spec/BOM Desc Mismatch", "sbm"],
    ["Sourcing Partial", "srp"],
    ["Customer Approval", "afc"],
    ["Customer Supplied", "cts"]
    
];

incomingPreset = [
    ["<BLANK>", "dum"], 
    ["Rec'd Alternate", "rca"],
    ["Unprotected MSL", "msl"],
    ["Top Marking Unverifiable", "tmu"],
    ["Short Parts", "shp"],
    ["Rec'd Exact QTY", "eqt"],
    ["Didn't Receive Line", "drl"],
    ["Added Alt Package", "aap"],
    ["Label/BOM Mismatch", "lbm"]
    
];

numWidgetSlots = 8;


quoteWidgets = [
'costInclusionDiv',
'requiresApprovalDiv',
'higherQTYLT'

];
salesorderWidgets = [
    
];

if(numWidgetSlots >= allOptions.length) { // makes sure there aren't more placeholder slots than available widgets
    numWidgetSlots = allOptions.length -1;
}

const urlParams = new URLSearchParams(window.location.search);
document.getElementById('initials').value = urlParams.get('user') || ""; // allows user to be predefined with URL Params
customLoadoutWidgetGenerator();
salesOrderMode = false; // TRUE == Sales Order, FALSE == Quote
if((urlParams.get('salesOrderMode') ||"").toLowerCase()=="so") {
    document.getElementById('switchView').click();
}

    document.getElementById("notesLoadout").value = urlParams.get('loadout') ||"quote";
    document.getElementById("notesLoadout").onchange();

//GLOBAL FUNCTIONS

//document.getElementById('initials').value = urlParams.get('mode') || ""; // allows user to be predefined with URL Params

 //All my loops start at 1 and im not stupid its just the widgets all increment from 1 and it happened to work out that I needed a dummy element

function onLoadoutPresetChange() {
    for (var i = 1; i < numWidgetSlots +1; i++) {
        if (document.getElementById(`widget${i}`).lastChild) {
            document.getElementById('widgetHolder').appendChild(document.getElementById(`widget${i}`).lastChild); //only *direct* child is the widget div, so we just use lastChild
        }
    }
    document.getElementById('custom-config').style.display = "none";

    switch (document.getElementById("notesLoadout").value) {
        case 'quote':
            for (var i = 1; i < numWidgetSlots +1; i++) { //again im not stupid its just the widgets index from 1 so thats why everything starts at 1
                document.getElementById(`widget${i}`).appendChild(document.getElementById(allOptions[i][1]));
            }
            hideEmptyWidgets();
            break;
        case 'etk':
            hideEmptyWidgets();
            break;
        case 'mke':
            for (var i = 1; i < mkePreset.length; i++) { //no clue why i dont need to add 1 to the length, i think it has something to do with the dummy
                document.getElementById(`widget${i}`).appendChild(document.getElementById(mkePreset[i][1]));
            }
            hideEmptyWidgets();
            break;
        case 'custresponse':
            for (var i = 1; i < custResponsePreset.length; i++) { //no clue why i dont need to add 1 to the length, i think it has something to do with the dummy
                document.getElementById(`widget${i}`).appendChild(document.getElementById(custResponsePreset[i][1]));
            }
            hideEmptyWidgets();
            break;
        case 'salesorder':
            for (var i = 1; i < salesOrderPreset.length; i++) { //no clue why i dont need to add 1 to the length, i think it has something to do with the dummy
                document.getElementById(`widget${i}`).appendChild(document.getElementById(salesOrderPreset[i][1]));
            }
            hideEmptyWidgets();
            break;
        case 'incoming':
            document.getElementById('customer').value = "NA";
            for (var i = 1; i < incomingPreset.length; i++) { //no clue why i dont need to add 1 to the length, i think it has something to do with the dummy
                document.getElementById(`widget${i}`).appendChild(document.getElementById(incomingPreset[i][1]));
            }
            
            hideEmptyWidgets();
            break;    
        case 'custom':
            document.getElementById('custom-config').style.display = "block";
            for (var i = 1; i < numWidgetSlots +1; i++) {
                var selection = document.getElementById(`loadoutSelection${i}`).value
                if (selection !== "dum") {
                    document.getElementById(`widget${i}`).appendChild(document.getElementById(selection));
                }
            }
            hideEmptyWidgets();
            break;
    }
}

function onCustomLoadoutSelectionChange() {
    for (var i = 1; i < numWidgetSlots +1; i++) { 
        document.getElementById(`loadoutSelection${i}`).style.borderColor = "";
        if (event.target.value === document.getElementById(`loadoutSelection${i}`).value && event.target.value !== 'dum' && i != event.target.name) {
            document.getElementById(`loadoutSelection${i}`).selectedIndex = 0;
            document.getElementById(`loadoutSelection${i}`).style.borderColor = "rgb(176, 0, 32)";
        }
    }
    if (event.target.value !== 'dum') {
        event.target.style.borderColor = "";
        if (document.getElementById('widget' + event.target.name).lastChild) {
            document.getElementById('widgetHolder').appendChild(document.getElementById('widget' + event.target.name).lastChild); //only *direct* child is the widget div, so we just use firstChild
        }
        document.getElementById('widget' + event.target.name).appendChild(document.getElementById(event.target.value));
    }
    hideEmptyWidgets();
}

function hideEmptyWidgets() { //hides widget slots that are unoccupied
    for (var i = 1; i < numWidgetSlots +1; i++) { 
        if (document.getElementById(`widget${i}`).firstChild) {
            document.getElementById(`widget${i}`).style.display = "block";
        } else {
            document.getElementById(`widget${i}`).style.display = "none";
        }
    }

}

function onTabClick(navBarLabel, newString) { //updates nav bar heading when switching tabs
    navBarLabel.innerHTML = newString;
}
function onEULeadTimeInput() { //updates EU LT heading to match input
    document.getElementById("euLeadTimeLabel").innerHTML = "EU Stock with " + event.target.value + "d LT";
}

function onCopyExportLegendClick() {
  navigator.clipboard.writeText(document.getElementById("exportLegend").outerHTML)//`${document.getElementById('customer').value} Attention Required	BoM Tool v1\nTouchPad Electronics Attention Required	${getNotePrefix().substring(0,10)}\nResolved	\nDo Not Populate	`);
  
  
    /* navigator.clipboard.writeText(`https://theultracorgi.github.io/bom-comments-tool/index.html?user=${document.getElementById('initials').value}` +
    `&salesOrderMode=${substituteByView("so","")}&loadout=${document.getElementById('notesLoadout').value}`);
    alert('1. Right click the Bookmarks bar,\n2. Click "Add Page",\n3. "Name" whatever is most convenient\n4. Paste clipboard into URL')
*/}

function switchView() {
    salesOrderMode = !salesOrderMode;
    if(salesOrderMode) {
        brokersIndex = 0;
        document.getElementById('requiresApproval').checked = true;
        onHeaderClick("",document.getElementById("brokerPriceAdvHeader"),"brokers","",0);     
    }
    document.getElementById('viewIcon').textContent = substituteByView('currency_exchange','format_quote');
    document.getElementById("notesLoadout").value = substituteByView("salesorder","quote");
    

    for (var i =0; i<salesorderWidgets.length;i++) {
        document.getElementById(salesorderWidgets[i]).style.display = substituteByView("block","none");
    }
    for (var i =0; i<quoteWidgets.length;i++) {
        document.getElementById(quoteWidgets[i]).style.display = substituteByView("none","block");
    }

    document.getElementById('quotedWithAltHeader').innerHTML = substituteByView("Potential Alternate","Quoted With Alternate");

    var r = document.querySelector(':root');
    r.style.setProperty('--primary', substituteByView("rgba(239,83,80,1)","rgba(3, 169, 244,1)")); //makes view red/blue for clarity
    document.getElementById("notesLoadout").onchange();
   /* var dummy = [
        ["lowStockAdvHeader", "lowStockAdvLabel","lowStockAdvIcon"],
        ["brokerPriceAdvHeader", "brokerPriceAdvLabel","brokerPriceAdvIcon"],
        ["mPQAdvHeader", "mPQAdvLabel","mPQAdvIcon"],
        ["mOQAdvHeader", "mOQAdvLabel","mOQAdvIcon"],
        ["lTAdvHeader", "lTAdvLabel","lTAdvIcon"]
    ];

    for (var i =0; i < dummy.length; i++){
        onAdvInputChange(document.getElementById(dummy[i][0]), document.getElementById(dummy[i][1]),document.getElementById(dummy[i][2]));

    }
    */
}

function clearActiveFields() {
    document.querySelectorAll(['input','textarea']).forEach((input) => { //clears text inputs except initials, customer name, and EU LT
        if (input.id === 'initials' || input.id === 'customer' || input.id === 'euLeadTime') {
        } else {
            input.value = '';
        }
    });

    document.getElementById('stock-notice').querySelectorAll(['span','h2']).forEach((heading) => { //resets Stock Notice icons and headings
        if (heading.id === 'copyAdvIcon') {
        } else {
            heading.style.color = 'black';
        }
    });

    document.getElementById('stock-notice').querySelectorAll('h4').forEach((label) => { //resets Stock Notice labels
        label.style.display = 'none';
    });

    document.getElementById('costOption1').checked = true;
    document.getElementById('costOption1Parent').className = 'radio-item'; //resets cost option styles
    document.getElementById('costOption2Parent').className = 'radio-item';
    document.getElementById('costOption3Parent').className = 'radio-item';
    document.getElementById('requestAlternate').checked = true;

    if(salesOrderMode) {
        document.getElementById('requiresApproval').checked = true;
    } else {
        document.getElementById('requiresApproval').checked = false;
    }
}
var partNumberIndex;
var uniq;
var octopartIcon = document.getElementById("octopartLookupIcon");


async function onOctopartLookupClick(buttonFunction) {
    
    if (buttonFunction) {
        var clipText = await navigator.clipboard.readText();
        
        if(clipText.startsWith('"')) {
           clipText = clipText.substring(1,clipText.length-3); // for whatever reason when you copy a cell, an extra alt enter gets added
        }
        
        uniq = [...new Set(clipText.split(/\r?\n/))];
        partNumberIndex = -1;


        if (timer != null) { // timer to clear the Price not included field 
            window.clearTimeout(timer);
            timer = null;
        }
        octopartIcon.innerHTML = "checklist";
        timer = setTimeout(function () { octopartIcon.innerHTML = "filter_8"; }, 1250); 
        
    }
        partNumberIndex +=1;
        if (partNumberIndex== uniq.length){
            partNumberIndex = 0;
        }
        window.open(`https://octopart.com/search?q=${uniq[partNumberIndex]}`);
}

function getNotePrefix() { // returns note prefix in format: 'YYYY-MM-DD FL:'
    const initials = document.getElementById('initials');
    var today = new Date();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    return today + " " + initials.value + ": "
}

function hasValidInputs(extraParamsArray) { // checks if customer and initials are filled out, returns boolean
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


function appendOtherNotes(tab) { //returns Other notes
    if (document.getElementById('otherNotes' + tab).value !== '') {
        return "\n\n" + document.getElementById('otherNotes' + tab).value;
    } else {
        return '';
    }
}

function onCustomerChange(customer) {
    document.getElementById("legendCustomer").innerHTML = `${customer.value} Action Required`;
    document.getElementById("legendDate").innerHTML = getNotePrefix().substring(0,10);
}

function customLoadoutWidgetGenerator () {

    var customConfigParent = document.getElementById('favorite-notes'); //creates the widget locations on the parent page

    for (var j = 1; j < numWidgetSlots +1; j++) { // generates widgets for custom loadout
        var widget = document.createElement('div');
        widget.id = `widget${j}`;
        widget.className = "favorite-note-container";
        customConfigParent.appendChild(widget);
        document.getElementById('widget' + j).appendChild(document.getElementById(allOptions[j][1])); //populates widget

    }

    customConfigParent.appendChild(document.getElementById('otr'));


    //switches parent to be the selector parent on settings page
    customConfigParent = document.getElementById('custom-config-wrapper'); // creates the selectors

    for (var j = 1; j < numWidgetSlots +1; j++) { // generates selectors for custom loadout
        var header = document.createElement('div');
        header.className = 'note-header';
    
        var icon = document.createElement('span');
        icon.className = 'material-icons-outlined';
        icon.appendChild(document.createTextNode("filter_" + j));
    
        var select = document.createElement('select');
        select.id = 'loadoutSelection' + j;
        select.name = j;
        select.setAttribute("onchange", "onCustomLoadoutSelectionChange()");
    
        header.appendChild(icon);
        header.appendChild(select);
        customConfigParent.appendChild(header);
    
        for (var i = 0; i < allOptions.length; i++) { //add list of widget options to custom loadout selectors
            var opt = allOptions[i];
            var el = document.createElement("option");
            el.textContent = allOptions[i][0];
            el.value = allOptions[i][1];
            select.appendChild(el);
        }
        if(j < numWidgetSlots+1-4) {
            select.selectedIndex = j;
        } else {
            select.selectedIndex = 0;
        }
        
    }
}

function createRipple(event) {
    const button = event.currentTarget;
  
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
  
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");
  
    const ripple = button.getElementsByClassName("ripple")[0];
  
    if (ripple) {
      ripple.remove();
    }
  
    button.appendChild(circle);
  }
  
const buttons = document.getElementsByTagName("button");
  for (const button of buttons) {
    button.addEventListener("click", createRipple);
  }

function substituteByView(textIfTrue, textIfFalse) {
  if(salesOrderMode){
        return textIfTrue;
    } else {
        return textIfFalse;
    }
}


// STOCK NOTICE
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
        return substituteByView(" ", ` Authorized distributor pricing included in quote.`)
    } else {
        return `${substituteByView("", " No cost included in quote.")} Can ` + document.getElementById('customer').value + " supply or suggest alternates?"
    }
}


//FAVORITES

var timer = null;


function onNoStockCopyClick(excludePricingReason, customer) { //returns note for no stock
    if (hasValidInputs()) {
        var output; 

        if(isNaN(excludePricingReason.value) || excludePricingReason.value == "") {
           output = getNotePrefix() + "No stock, component LT will not meet build req., ";
        } else {
            output = getNotePrefix() + `Insufficient stock (${excludePricingReason.value}pc), component LT will not meet build req., `;
        }
        var removeLen = 2; // this is to retain gramatical correctness when in sales order mode

        if (excludePricingReason.value.length > 0 && isNaN(excludePricingReason.value)) { // checks if the price is included
           
            if(!salesOrderMode) { //checks to sea if there is a reason the price is omitted or not
                output += excludePricingReason.value + ", no ";
            } else {
                output += excludePricingReason.value + ".";
                removeLen = 0;
            }
            
        } 
        
        if(!salesOrderMode) {
            output += "cost included in quote. Can " + customer.value + " supply or suggest alternates?" + appendOtherNotes('Fav'); 
        } else {
            output = output.substring(0,output.length-removeLen) + " Can " + customer.value + " supply or suggest alternates?" + appendOtherNotes('Fav');
        }

        if (timer != null) { // timer to clear the Price not included field 
            window.clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function () { excludePricingReason.value = ""; }, 3000);
        
        navigator.clipboard.writeText(output);
    }
}

function onEUStockCopyClick(euLeadTime) { // returns note for EU LT
    if (hasValidInputs([euLeadTime])) {
        navigator.clipboard.writeText(getNotePrefix() + "EU Stock with listed " + euLeadTime.value + `d transit time.${substituteByView(" Is this acceptable?","")}` + appendOtherNotes('Fav'));
    } else {
        document.getElementById('settings-button').click(); // focuses the settings menu which is actively highlighting an invalid EU LT field
    }
}

function onPNNotFoundCopyClick() { // returns note for P/N not found
    if (hasValidInputs()) {
        navigator.clipboard.writeText(getNotePrefix() + `P/N not found, ${substituteByView("p","no cost included in quote. P")}lease confirm P/N` + appendOtherNotes('Fav'));
    }
}

function onQuotedAltClick(altMFRName, altMFRPN) { // returns note for alternate quoted
    if (hasValidInputs([altMFRName, altMFRPN])) {
        navigator.clipboard.writeText(getNotePrefix() + `No stock, ${substituteByView("potential","quoted with")} alternate ` + altMFRName.value + " " + altMFRPN.value + `, is this acceptable?` + appendOtherNotes('Fav'));
    }
}

function onLimitedStockClick(limitedStock) { // returns note for low stock
    if (hasValidInputs([document.getElementById('limitedStock')])) {
        navigator.clipboard.writeText(getNotePrefix() + "Limited stock (" + limitedStock.value + "pc), likely to be exhausted by time of order" + appendOtherNotes('Fav'));
    }
}

function onSpecMismatchClick(specDesc, listedSpec, bomDesc) { // returns note for spec mismatch
    if (hasValidInputs([specDesc, listedSpec, bomDesc])) {
        navigator.clipboard.writeText(getNotePrefix() + "Listed " + specDesc.value + " (" + listedSpec.value + ") does not match BOM desc (" + bomDesc.value + "), please confirm P/N" + appendOtherNotes('Fav'));
    }
}

function onSourcingPartialClick(sourceableQTY, higherQTYLT) { // returns note for sourcing partial stock
    if (hasValidInputs([sourceableQTY, higherQTYLT]) || (hasValidInputs([sourceableQTY]) && salesOrderMode )) {
        navigator.clipboard.writeText(getNotePrefix() + `Can source up to ` + sourceableQTY.value + ` QTY PCBAs, ${substituteByView("can customer supply or suggest alternate for remainder?","higher QTYs subject to " + higherQTYLT.value + "w LT and potential volume MOQs")}` + appendOtherNotes('Fav'));
    }
}

function onStockWithLeadTimeClick(leadTime) {
    if (hasValidInputs([leadTime])) {
        if (leadTime.value.includes('d') || leadTime.value.includes('w')) {
            navigator.clipboard.writeText(getNotePrefix() + `Stock available with ` + leadTime.value + ` LT, is this acceptable?${substituteByView(" ", " Cost included in quote")}` + appendOtherNotes('Fav'));
        } else if (leadTime.value.includes('/') || leadTime.value.includes('-')) {
            navigator.clipboard.writeText(getNotePrefix() + "Stock with expected ship date of " + leadTime.value + `, is this acceptable?${substituteByView(" ", " Cost included in quote")}` + appendOtherNotes('Fav'));
        } else {
            navigator.clipboard.writeText(getNotePrefix() + "Stock available with " + leadTime.value + `w LT, is this acceptable?${substituteByView(" ", " Cost included in quote")}` + appendOtherNotes('Fav'));
        }
    }
}

function onConfirmPNCorrectClick(mfrPN) {
    if (hasValidInputs([mfrPN])) {
        navigator.clipboard.writeText(getNotePrefix() + `${substituteByView("Sourced ", "Quoted with ")}` + mfrPN.value + ", please confirm accurate" + appendOtherNotes('Fav'));
    }
}

function onPackagingDiscrepancyClick(charDisc,oldPackage,newPackage) {
    if (hasValidInputs([charDisc]) && ![oldPackage.selectedIndex,newPackage.selectedIndex].includes(0) && oldPackage.selectedIndex != newPackage.selectedIndex) {
        navigator.clipboard.writeText(getNotePrefix() + "P/N discrepancy \"" + charDisc.value + "\" due to packaging (" + oldPackage.value + " vs " + newPackage.value + ")" + appendOtherNotes('Fav'));
    }
}

function onQuotedAsSuppliedClick(reason, customer) {
    if (hasValidInputs([reason])) {
        navigator.clipboard.writeText(getNotePrefix() + reason.value + ", quoted as " + customer + " supplied, please confirm" + appendOtherNotes('Fav'));
    }
}

function onSourcingInventoryClick(inventoryLocation, inventoryQTY) {
    if (inventoryLocation.value == "") {
        inventoryLocation.value = null;
    }
    if (inventoryQTY.value == "") {
        inventoryQTY.value = null;
    }
        navigator.clipboard.writeText(getNotePrefix() + `Pull ${(inventoryQTY.value || '')}pc from ${(inventoryLocation.value || 'inventory')}`.replace(" pc","") + appendOtherNotes('Fav'));
}

function onQuotedWithInventoryClick(inventoryID) {
    if (hasValidInputs([inventoryID])) {
        navigator.clipboard.writeText(getNotePrefix() + "No distributor stock, quoted with TPE Inventory " + inventoryID.value + appendOtherNotes('Fav'));
    }
}

function onAlternateApprovedClick(note) {
    if (hasValidInputs([note])) {
        if(note.value.includes("with alternate ")) { //checks if is pulling directly from alt note
            navigator.clipboard.writeText(getNotePrefix() + note.value.substring(note.value.indexOf("with alternate ") + 15, note.value.indexOf(", is this")) + " approved" + appendOtherNotes("Fav"));
        } else {
            navigator.clipboard.writeText(getNotePrefix() + note.value + " approved");

        }
            }
}

function onApprovalFromCustomerClick(alternate, customer) {
    if (hasValidInputs([alternate])) {
        navigator.clipboard.writeText(getNotePrefix() + alternate.value + ` approved per ${customer}`+ appendOtherNotes("Fav"));
    }
}

function onCustomerToSupplyClick(customer) {
    if (hasValidInputs()) {
        navigator.clipboard.writeText(getNotePrefix() + customer + " to supply" + appendOtherNotes("Fav"));
    }
}

function onRecdAlternateClick(alternate) {
    if (hasValidInputs([alternate])) {
        navigator.clipboard.writeText(getNotePrefix() + `Rec'd ${alternate.value}, is this acceptable?` + appendOtherNotes("Fav"));
    }
}

var bakeRequired = ", is baking required?";
function onMSLIconClick(){
    if(bakeRequired === ", is baking required?") {
        document.getElementById("mslLevelIcon").setAttribute("style", "color: var(--error);");
        document.getElementById("mslLevelH2").setAttribute("style", "color: var(--error);");
        bakeRequired =  ", baking required";
    } else {
        document.getElementById("mslLevelIcon").setAttribute("style", "color: black");
        document.getElementById("mslLevelH2").setAttribute("style", "black");
        bakeRequired =  ", is baking required?";
        
    }
}

function onMSLLevelClick(mslLevel) {
    if (hasValidInputs()) {
        navigator.clipboard.writeText(getNotePrefix() + `Part is MSL ${mslLevel.value + bakeRequired}` + appendOtherNotes("Fav"));
    }
}



function onTopMarkingUnverifiableClick(actualTopMarking, datasheetTopMarking) {
    if (hasValidInputs([actualTopMarking])) {
        if(datasheetTopMarking.value === '') {
            navigator.clipboard.writeText(getNotePrefix() + `Part marking on rec'd component "${actualTopMarking.value}" not verifiable against datasheet, is this acceptable?` + appendOtherNotes("Fav"));
        } else {
            navigator.clipboard.writeText(getNotePrefix() + `Part marking on rec'd component "${actualTopMarking.value}" does not match datasheet "${datasheetTopMarking.value}", is this acceptable?` + appendOtherNotes("Fav"));
        }
    }
        
}

function onShortPartsClick() {
    if (hasValidInputs()) {
        navigator.clipboard.writeText(getNotePrefix() + `Short parts` + appendOtherNotes("Fav"));
    }
}

function onRecdExactQTYClick() {
    if (hasValidInputs()) {
        navigator.clipboard.writeText(getNotePrefix() + `Rec'd exact QTY` + appendOtherNotes("Fav"));
    }
}

function onDidntReceiveLineClick() {
    if (hasValidInputs()) {
        navigator.clipboard.writeText(getNotePrefix() + `Didn't receive` + appendOtherNotes("Fav"));
    }
}

function onAddedAltPackageClick(alternate) {
    if (hasValidInputs([alternate])) {
        navigator.clipboard.writeText(getNotePrefix() + `Added ${alternate.value}` + appendOtherNotes("Fav"));
    }
}

function onLabelBOMMismatchClick(labelText, mismatchType) {
    if (hasValidInputs([labelText, mismatchType])) {
        navigator.clipboard.writeText(getNotePrefix() + `Rec'd ${labelText.value}, ${mismatchType.value} mismatch` + appendOtherNotes("Fav"));
    }
}

function onOtherClick(otherNotes) { // returns the custom note
    if (hasValidInputs([otherNotes])) {
        navigator.clipboard.writeText(getNotePrefix() + otherNotes.value);
    }
}
