/************************************************
 ** Script to draw/render the resolution graph **
 ************************************************/

/** CONTROL VARIABLES **/
// SETTING UP GRAPH SIZE
var margin = {top: 20, right: 90, bottom: 30, left: 40},
    width = 850 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

// DEFAULT MAX NUMBERS ON AXIS
var maxXscale = 10;
var maxYscale = 10;

// DEFINING THE SCALE: NUMBERS THAT WILL APPEAR UNDER/BESIDE THE AXIS
var xScale = d3.scale.linear()
    .domain([0, maxXscale])
    .range([0, width]);
var yScale = d3.scale.linear()
    .domain([0, maxYscale])
    .range([height, 0]);

// CONTROL ARRAYS
var graphScalesArray = [];
var linesArray = [];
var constraintsArray = [];
var intersectionPointsArray = [];

// ARRAY OF COLORS, LIMITED IN 12 COLORS
var colorsArray = ["RoyalBlue",
                   "Crimson",
                   "BlueViolet",
                   "Tomato",
                   "Navy",
                   "Brown",
                   "DarkCyan",
                   "DarkGoldenRod",
                   "DarkOrange",
                   "Fuchsia",
                   "Gold",
                   "Black"];
var colorsArrayLenght = colorsArray.length;
//var constraintsArrayLength = 0;
/** END OF CONTROL VARIABLES **/

// DRAWING THE DEFAULT GRAPH (WHEN PAGE IS INITIALLY LOADED)
drawGraph();

// DRAWS THE GRAPH AREA AND ITS AXIS
function drawGraph() {

    // CREATING THE AXIS LINES WITH THE SCALE RANGE ABOVE
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .innerTickSize(-height) // changes the bar grids
        .outerTickSize(1)
        .tickPadding(10);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize(-width) // changes the bar grids
        .outerTickSize(1)
        .tickPadding(10); // how far from the line, the scale will appear

    // REMOVING THE "ALREADY THERE" GRAPH IN ORDER TO REPLACE IT AND NOT ADD ANOTHER ONE
    var svg = d3.select("#graph");
    if (svg[0][0] !== null) {
        svg.remove("#graph-child");
    }
    svg = d3.select("body").append("svg")
        .attr("id", "graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom+20)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "graph-child");

    // APPENDING THE X AXIS TO THE GRAPH
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    // text label for the x1 axis
    svg.append("text")
        .attr("transform",
            "translate(733  , 410)")
        .attr("class", "label")
        .text("x1");
    // svg.append("text")
    //     .attr("transform",
    //         "translate(" + (width/2) + " ," +
    //         (height + margin.top + 20) + ")")
    //     .attr("class", "label")
    //     .text("x1");

    // APPENDING THE Y AXIS TO THE GRAPH
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    // text label for the x2 axis
    svg.append("text")
        .attr("transform", "translate(213,20)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "label")
        .text("x2");
    // svg.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x",0 - (height / 2))
    //     .attr("dy", "1em")
    //     .attr("class", "label")
    //     .text("x2");

    // var teste = [{x: 5, y: 10}, {x: 5, y: 0}, {x: 10, y: 5}];
    // var teste2 = [{x: 25, y: 15}, {x: 40, y: 15}, {x: 25, y: 0}, {x: 100, y: 0}];
    //
    // svg.append("path")
    //     .datum(teste)
    //     .attr("class", "area")
    //     .attr("d", area);
}

// UPDATES THE SCALE (WHEN THERE ARE CHANGES ON CONSTRAINTS)
function updateGraphScale(){

    var x = d3.max(graphScalesArray, function (d) {
        return d.x;
    });

    var y = d3.max(graphScalesArray, function (d) {
        return d.y;
    });

    maxXscale = x;
    maxYscale = y;

    yScale = d3.scale.linear()
        .domain([0, maxYscale])
        .range([height, 0]);

    xScale = d3.scale.linear()
        .domain([0, maxXscale])
        .range([0, width]);
}

// DRAWS A LINE ON THE GRAPH
function drawLine(dataset, constraintNumber, svg) {

    var lineDataset = [{x: dataset[0].x, y:dataset[0].y},{
                       x: dataset[1].x, y:dataset[1].y}];

    if (lineDataset[1].x === -1)
        lineDataset[1].x = maxXscale;

    if (lineDataset[1].y === -1)
        lineDataset[1].y = maxYscale;

    // CREATING THE LINE ON THE GRAPH CONSIDERING THE AXIS' SCALES
    var line = d3.svg.line()
        .x(function (d) {
            return xScale(d.x);
        })
        .y(function (d) {
            return yScale(d.y);
        });

    var area = d3.svg.area()
        .x(function(d) { return xScale(d.x); })
        .y0(height)
        .y1(function(d) { return yScale(d.y); });

    // APPENDING THE LINE TO THE SVG GRAPH
    svg.append("path")
        .data([lineDataset])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", setLineColor(constraintNumber));

    // TESTES PINTAR AREA
    // console.log("line dataset >> ");
    // console.log(lineDataset);

    // PAINTING THE AREA
    // var teste = [{x: 35, y: 25}, {x: 35, y: 0}, {x: 50, y: 25}];
    // var teste2 = [{x: 25, y: 15}, {x: 40, y: 15}, {x: 25, y: 0}, {x: 100, y: 0}];
    // svg.append("path")
    //     .datum(lineDataset)
    //     .attr("class", "area")
    //     .attr("d", area);

}


// SETS A COLOR TO A LINE ACCORDING TO ITS CONSTRAINT NUMBER
function setLineColor(constraintNumber) {
    var colorIndex = constraintNumber%colorsArrayLenght;
    return colorsArray[colorIndex];
}

// REDRAWS THE WHOLE GRAPH BASED ON CONSTRAINTS CHANGES
function redefineGraph(constraint) {

    // GETTING THE INPUTS
    var inputs = constraint.getElementsByClassName('coefficient');
    var x1 = parseInt(inputs[0].value) || 0;
    var x2 = parseInt(inputs[1].value) || 0;
    var limitValue = parseInt(inputs[2].value) || 0;
    var arithmeticOperator = constraint.getElementsByTagName('select')[0];
    var constraintNumber = parseInt(constraint.getAttribute('value'));
    var scaleDataset;
    var lineDataset;

    // IF THE LIMITATION VALUE IS NOT SET, ABORT
    if(limitValue === 0){
        return;
    }

    // SAVING THE CONSTRAINT COEFFICIENTS INTO AN ARRAY
    var constraintObject = {
        number: constraintNumber,
        x1: x1,
        x2: x2,
        limit: limitValue
    };

    // DEFINING LINE AND SCALE DATA SETS AND THE CONSTRAINT TYPE (ACCORDING TO ITS COEFFICIENTS)
    if(x1 !== 0){
        /** BOTH x1 AND x2 ARE SET **/
        if(x2 !== 0){
            //
            scaleDataset = {x: Math.ceil(limitValue/x1), y: Math.ceil(limitValue/x2)};
            graphScalesArray[constraintNumber] = scaleDataset;
            updateGraphScale(graphScalesArray);

            lineDataset = [
                {x: 0, y: limitValue/x2},
                {x: limitValue/x1, y: 0}
            ];

            constraintObject.type = 1;

        } else { /** ONLY x1 IS SET **/
            scaleDataset = {x: Math.ceil(limitValue/x1), y: Math.ceil(limitValue/x1)};
            graphScalesArray[constraintNumber] = scaleDataset;
            updateGraphScale(graphScalesArray);

            lineDataset = [
                {x: limitValue/x1, y: 0},
                {x: limitValue/x1, y: -1}
            ];

            constraintObject.type = 2;
        }
    } else {
        /** ONLY x2 IS SET **/
        if(x2 !== 0){
            scaleDataset = {x: Math.ceil(limitValue/x2), y: Math.ceil(limitValue/x2)};
            graphScalesArray[constraintNumber] = scaleDataset;
            updateGraphScale(graphScalesArray);

            lineDataset = [
                {x: 0, y: limitValue/x2},
                {x: -1, y: limitValue/x2}
            ];

            constraintObject.type = 3;

        } else { /** BOTH x1 AND x2 ARE SET WITH ZERO **/
            lineDataset = [
                {x: 0, y: 0},
                {x: 0, y: 0}
            ];
        }
    }

    // ADDING THE NEW LINE TO THE ARRAY OF LINES
    linesArray[constraintNumber] = lineDataset;

    // ADDING THE NEW CONSTRAINT TO THE ARRAY OF CONSTRAINTS
    addingToConstraintsArray(constraintObject);

    // DRAWING THE WHOLE GRAPH AREA AGAIN WITH UPDATED SCALES
    drawGraph();

    // DRAWING ALL THE LINES BASED NOW ON THE NEW SCALE
    for (i = 0 ; i < linesArray.length ; i++) {
        drawLine(linesArray[i], i, d3.select('#graph-child'));
    }

    // CALCULATING THE CONCURRENT POINTS
    calculateIntersectionPoints();

    // PLOTTING THE INTERSECTION POINTS BASED ON NEW SCALE
    plotIntersectionPoints(d3.select('#graph-child'));

    // console.log("intersection points: ");
    // console.log(intersectionPointsArray);
}

// BASED ON THE CONSTRAINTS EQUATIONS, FIND ALL THE INTERSECTION POINTS, IF EXISTS
function calculateIntersectionPoints(){
    intersectionPointsArray = new Array();
    var constraintsArrayLength = constraintsArray.length;
    var i, j = 0;
    var equation1, equation2;
    var intersectionPointObject = {
        x: 0,
        y: 0,
        objectiveFunctionResult: 0
    };

    for(i = 0; i < constraintsArrayLength-1; i++){
        for(j = i+1; j < constraintsArrayLength; j++){

            // SINCE ORDER MATTERS HERE, IT HAS TO MAKE SURE THAT THE EQUATION-1
            // IS THE ONE WITH MORE COEFFICIENTS
            if(constraintsArray[i].type === 2 || constraintsArray[i].type === 3) {
                equation1 = constraintsArray[j];
                equation2 = constraintsArray[i];
                // IF THE EQUATIONS HAVE THE SAME TYPE, THERE IS NO INTERSECTION POINT
                if(equation1.type === equation2.type){
                    break;
                }
            } else {
                equation1 = constraintsArray[i];
                equation2 = constraintsArray[j];
            }

            // IF ONE OF THE EQUATIONS HAVE ONLY ONE COEFFICIENT SET,
            // IT MUST FIX EITHER X OR Y OF THE INTERSECTION POINT
            if(equation2.type === 2){
                intersectionPointObject.x = equation2.limit/equation2.x1;
            } else if (equation2.type === 3){
                intersectionPointObject.y = equation2.limit/equation2.x2;
            }
            if(equation1.type === 2){
                intersectionPointObject.x = equation1.limit/equation1.x1;
            } else if (equation1.type === 3){
                intersectionPointObject.y = equation1.limit/equation1.x2;
            }

            // IF BOTH X AND Y OF THE INTERSECTION POINT ARE ALREADY DEFINED,
            // FOLLOW THE BAILE
            if (intersectionPointObject.x !== 0 && intersectionPointObject.y !== 0){
                intersectionPointsArray.push(intersectionPointObject);
                break;
            }

            /** HERE, IT'S SURE THAT THE EQUATION-1 IS OF TYPE 1 **/
            /*
             Since we have two equations like:
             y = a1 * x + b1
             y = a2 * x + b2
             Como queremos verificar a intersecção, fazemos y(reta1) = y(reta2) onde teremos:
             a1 * x + b1 = a2 * x + b2
             Isolando o valor de x temos:
             x = ( b2 - b1 ) / (a1 - a2)
             Se a1 == a2 teremos um erro (divisão por zero), o que indica que as retas são paralelas (não têm intersecção).
             Utilizaremos o valor de x em alguma das equações acima:
             y = a1 * x + b1
             */
            var a1 = -equation1.x1/equation1.x2;
            var b1 = equation1.limit/equation1.x2;

            if (equation2.type === 2){
                intersectionPointObject.y = a1*intersectionPointObject.x + b1;
            } else if (equation2.type === 3){
                intersectionPointObject.x = (intersectionPointObject.y - b1)/a1;
            } else {
                var a2 = -equation2.x1/equation2.x2;
                var b2 = equation2.limit/equation2.x2;
                intersectionPointObject.x = ( b2-b1 ) / ( a1-a2 );
                intersectionPointObject.y = a1*intersectionPointObject.x + b1;
            }

            // adding the intersection point object to an array of points
            if(intersectionPointObject.x !== 0 && intersectionPointObject.y !== 0) {
                intersectionPointsArray.push(JSON.parse(JSON.stringify(intersectionPointObject)));
            }

            // reset object values
            intersectionPointObject.x = 0;
            intersectionPointObject.y = 0;
            intersectionPointObject.objectiveFunctionResult = 0;
        }
    }
}

function plotIntersectionPoints(svg){
    svg.selectAll("circle")
        .data(intersectionPointsArray)
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
}

function addingToConstraintsArray(constraintObject){

    for(var index in constraintsArray){
        if(parseInt(constraintsArray[index].number) === constraintObject.number) {
            constraintsArray[index] = JSON.parse(JSON.stringify(constraintObject));
            return;
        }
    }

    constraintsArray.push(JSON.parse(JSON.stringify(constraintObject)));
}

// TODO: RENAME IT TO REMOVE CONSTRAINT
// REMOVES A LINE FROM THE GRAPH AREA
function removeLine(constraintNumber){
    var resetLineDataset = [{x: 0, y: 0},
                        {x: 0, y: 0}];
    var resetScaleDataset = [{x: 0, y: 0}];

    linesArray[constraintNumber] = resetLineDataset;
    graphScalesArray[constraintNumber] = resetScaleDataset;
    constraintsArray = constraintsArray.filter(function(constraint) {
        return constraint.number !== parseInt(constraintNumber);
    });

    updateGraphScale();

    drawGraph();

    for (i = 0 ; i < linesArray.length ; i++) {
        drawLine(linesArray[i], i, d3.select('#graph-child'));
    }

    calculateIntersectionPoints();
}