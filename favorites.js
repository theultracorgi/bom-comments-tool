var timer = null; //timer for clearing the no cost inclusion field

function onNoStockCopyClick(excludePricingReason, customer) { //returns note for no stock
    if (hasValidInputs()) {
        var output = getNotePrefix() + "No stock, component LT will not meet build req., ";
        var removeLen = 2; // this is to retain gramatical correctness when modes are switcheronied
        if (excludePricingReason.value.length > 0) { // checks if the price is included
           
            if(excludePricingReason.value.length >= 3 & !toolView) { //checks to sea if there is a reason the price is omitted or not
                output += excludePricingReason.value + ", no ";
            } else if(toolView) {
                output += excludePricingReason.value + ".";
                removeLen = 0;
            } else if (!toolView) {
                output += "no ";
            }
            
            if (timer != null) { // timer to clear the Price not included field 
                window.clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () { excludePricingReason.value = ""; }, 3000);
        }

        if(toolView) {
            output = output.substring(0,output.length-removeLen) + " Can " + customer.value + " supply or suggest alternates?" + appendOtherNotes('Fav');
        } else {
            output += "cost included in quote. Can " + customer.value + " supply or suggest alternates?" + appendOtherNotes('Fav'); 
        }
        
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

function onLowStockClick(lowStock) { // returns note for low stock
    if (hasValidInputs([document.getElementById('lowStock')])) {
        navigator.clipboard.writeText(getNotePrefix() + "Low stock (" + lowStock.value + ")" + appendOtherNotes('Fav'));
    }
}

function onSpecMismatchClick(specDesc, listedSpec, bomDesc) { // returns note for spec mismatch
    if (hasValidInputs([specDesc, listedSpec, bomDesc])) {
        navigator.clipboard.writeText(getNotePrefix() + "Listed " + specDesc.value + " (" + listedSpec.value + ") does not match BOM desc (" + bomDesc.value + "), please confirm P/N" + appendOtherNotes('Fav'));
    }
}

function onSourcingPartialClick(sourceableQTY, higherQTYLT) { // returns note for sourcing partial stock
    if (hasValidInputs([sourceableQTY, higherQTYLT])) {
        navigator.clipboard.writeText(getNotePrefix() + "Can source up to " + sourceableQTY.value + " QTY, higher QTYs subject to " + higherQTYLT.value + "w LT and potential volume MOQs" + appendOtherNotes('Fav'));
    }
}

function onStockWithLeadTimeClick(leadTime) {
    if (hasValidInputs([leadTime])) {
        if (leadTime.value.includes('d') || leadTime.value.includes('w')) {
            navigator.clipboard.writeText(getNotePrefix() + `Stock available with " + leadTime.value + " LT, is this acceptable?${substituteByView(" ", " Cost included in quote")}` + appendOtherNotes('Fav'));
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

function onQuotedWithInventoryClick(inventoryID) {
    if (hasValidInputs([inventoryID])) {
        navigator.clipboard.writeText(getNotePrefix() + "No distributor stock, quoted with TPE Inventory " + inventoryID.value + appendOtherNotes('Fav'));
    }
}

function onAlternateApprovedClick(note) {
    if (hasValidInputs([note])) {
        navigator.clipboard.writeText(getNotePrefix() + note.value.substring(note.value.indexOf("with alternate ") + 15, note.value.indexOf(", is this")) + " approved" + appendOtherNotes("Fav"));
    }
}

function onAlternateFromCustomerClick(alternate, customer) {
    if (hasValidInputs([alternate])) {
        navigator.clipboard.writeText(getNotePrefix() + alternate.value + " approved" + appendOtherNotes("Fav"));
    }
}

function onCustomerToSupplyClick(customer) {
    if (hasValidInputs()) {
        navigator.clipboard.writeText(getNotePrefix() + customer + " to supply" + appendOtherNotes("Fav"));
    }
}

function onOtherClick(otherNotes) { // returns the custom note
    if (hasValidInputs([otherNotes])) {
        navigator.clipboard.writeText(getNotePrefix() + otherNotes.value);
    }
}