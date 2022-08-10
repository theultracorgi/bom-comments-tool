var allOptions;
var mkePreset;
var custResponsePreset;
var salesOrderPreset;
var numWidgetSlots;
var quoteWidgets;
var salesorderWidgets;
var toolView;

document.addEventListener("DOMContentLoaded", function(event) {

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
    ["Customer Supplied", "cts"]
    
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
toolView = false; // TRUE == Sales Order, FALSE == Quote
if((urlParams.get('toolView') ||"").toLowerCase()=="so") {
    switchView();
}

    document.getElementById("notesLoadout").value = urlParams.get('loadout') ||"default";
    document.getElementById("notesLoadout").onchange();
});
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
        case 'default':
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

function onBookmarkPageClick() {
    navigator.clipboard.writeText(`https://theultracorgi.github.io/bom-comments-tool/index.html?user=${document.getElementById('initials').value}` +
    `&toolView=${substituteByView("so","")}&loadout=${document.getElementById('notesLoadout').value}`);
    alert('1. Right click the Bookmarks bar,\n2. Click "Add Page",\n3. "Name" whatever is most convenient\n4. Paste clipboard into URL')
}

function switchView() {
    toolView = !toolView;
    if(toolView) {
        brokersIndex = 0;
        document.getElementById('requiresApproval').checked = true;
        onHeaderClick("",document.getElementById("brokerPriceAdvHeader"),"brokers","",0);     
    }
    document.getElementById('viewIcon').textContent = substituteByView('currency_exchange','format_quote');
    document.getElementById("notesLoadout").value = substituteByView("salesorder","default");
    

    for (var i =0; i<salesorderWidgets.length;i++) {
        document.getElementById(salesorderWidgets[i]).style.display = substituteByView("block","none");
    }
    for (var i =0; i<quoteWidgets.length;i++) {
        document.getElementById(quoteWidgets[i]).style.display = substituteByView("none","block");
    }

    document.getElementById('quotedWithAltHeader').innerHTML = substituteByView("Potential Alternate","Quoted With Alternate");

    var r = document.querySelector(':root');
    r.style.setProperty('--primary', substituteByView("rgba(239,83,80,1)","rgba(3, 169, 244,1)"));
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
    document.getElementById('requiresApproval').checked = false;
}
var partNumberIndex;
var uniq;
var octopartIcon = document.getElementById("octopartLookupIcon");
async function onOctopartLookupClick(buttonFunction) {
    
    if (buttonFunction) {
        var clipText = await navigator.clipboard.readText();
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
  if(toolView){
        return textIfTrue;
    } else {
        return textIfFalse;
    }
}