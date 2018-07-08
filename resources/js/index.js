/**
 * Created by Fellipe G on 11/11/2017.
 */

var restrictionNumber = 1;

// var goal = document.findElementById('goal');
// Add restriction function: add a new div restriction to the list
document.getElementById("add-restriction").onclick = function () {
    var ok = true;

    if (ok === true) {
        var div = document.createElement('div');
        div.className = 'restriction';
        div.id = 'restriction'+restrictionNumber.toString();
        div.setAttribute('onchange', 'redefineGraph(this)');
        div.setAttribute('value', restrictionNumber);

        var x1Input = document.createElement('input');
        x1Input.id = 'x1-'.concat(restrictionNumber.toString());
        x1Input.className = 'coefficient';
        x1Input.typeName = 'text';

        var x1Label = document.createElement('a');
        x1Label.innerText = ' x1 +';

        // var operatorSelect = document.createElement('select');
        // operatorSelect.className = 'btn-dark';
        // operatorSelect.name = 'arithmetic-operator';
        // var plus = document.createElement('option');
        // plus.innerText = '+';
        // plus.value = "plus";
        // var minus = document.createElement('option');
        // minus.innerText = '-';
        // minus.value = "minus";
        // operatorSelect.appendChild(plus);
        // operatorSelect.appendChild(minus);

        div.appendChild(x1Input);
        div.appendChild(x1Label);
        //div.appendChild(operatorSelect);

        var x2Input = document.createElement('input');
        x2Input.id = 'x2-'.concat(restrictionNumber.toString());
        x2Input.className = 'coefficient';
        x2Input.typeName = 'text';
        x2Input.style = 'margin-left: 5px';

        var x2Label = document.createElement('a');
        x2Label.innerText = ' x2 ';

        var comparisonOperatorSelect = document.createElement('select');
        comparisonOperatorSelect.className = 'btn-light';
        comparisonOperatorSelect.name = "comparison-operator";

        var greaterOrEqual = document.createElement('option');
        greaterOrEqual.innerText = '≥';
        greaterOrEqual.value = 'greater-or-equal';

        var lessOrEqual = document.createElement('option');
        lessOrEqual.innerText = '≤';
        lessOrEqual.value = 'less-or-equal';

        var equal = document.createElement('option');
        equal.innerText = '=';
        equal.value = 'equal';

        comparisonOperatorSelect.appendChild(lessOrEqual);
        comparisonOperatorSelect.appendChild(greaterOrEqual);
        comparisonOperatorSelect.appendChild(equal);

        var restrictionValue = document.createElement('input');
        restrictionValue.id = 'result-'.concat(restrictionNumber.toString());
        restrictionValue.className = 'coefficient';
        restrictionValue.typeName = 'text';
        restrictionValue.style = 'margin-left: 4px';

        var removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger remove-btn';
        removeButton.setAttribute('onclick', 'removeRestriction("'+restrictionNumber.toString()+'")');
        removeButton.innerHTML = '<a data-toggle="tooltip" data-placement="right" title="Remover restrição"> X </a>';

        div.appendChild(x2Input);
        div.appendChild(x2Label);
        div.appendChild(comparisonOperatorSelect);
        div.appendChild(restrictionValue);
        div.appendChild(removeButton);

        var restrictionComment = document.createComment(' RESTRICTION '.concat(restrictionNumber.toString()).concat(' '));
        var restrictionContainer = document.getElementById('restrictions-container');
        restrictionContainer.appendChild(restrictionComment);
        restrictionContainer.appendChild(div);
        restrictionNumber++;

        tooltip();
    }
};

function removeRestriction(restrictionNumber) {
    var restrictionToBeRemoved = document.getElementById('restriction'+restrictionNumber);
    restrictionToBeRemoved.remove();
    hideTooltip();
    removeConstraint(restrictionNumber);
};

// Tooltip functions
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
function tooltip() {
    $('[data-toggle="tooltip"]').tooltip();
}
function hideTooltip() {
    $('[role="tooltip"]').remove();
}

