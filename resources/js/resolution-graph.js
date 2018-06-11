/**
 * Created by Fellipe G on 11/5/2017.
 */

/** CONTROL VARIABLES **/
// setting up the size of the graph
var margin = {top: 20, right: 100, bottom: 30, left: 70},
    width = 920 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// MAX NUMBERS ON AXIS
var maxXscale = 10;
var maxYscale = 10;
// DEFINING THE SCALE: NUMBERS THAT WILL APPEAR UNDER/BESIDE THE AXIS
var xScale = d3.scale.linear()
    .domain([0, maxXscale])
    .range([0, width]);
var yScale = d3.scale.linear()
    .domain([0, maxYscale])
    .range([height, 0]);
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
var scalesDatasetArray = [];
var linesArray = [];
/** END OF CONTROL VARIABLES **/

// DRAWING THE DEFAULT GRAPH
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

    svg.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 20) + ")")
        .attr("class", "label")
        .text("x1");

    // APPENDING THE Y AXIS TO THE GRAPH
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "label")
        .text("x2");
}

// UPDATES THE SCALE
function updateGraphScale(){

    var x = d3.max(scalesDatasetArray, function (d) {
        return d.x;
    });

    var y = d3.max(scalesDatasetArray, function (d) {
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
function drawLine(dataset, restrictionNumber, svg) {

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
        .attr("stroke", setLineColor(restrictionNumber));

    console.log("line dataset >> ");
    console.log(lineDataset);

    // PAINTING THE AREA
    var teste = [{x: 35, y: 25}, {x: 35, y: 0}, {x: 50, y: 25}];
    var teste2 = [{x: 25, y: 15}, {x: 40, y: 15}, {x: 25, y: 0}, {x: 100, y: 0}];
    svg.append("path")
        .datum(teste)
        .attr("class", "area")
        .attr("d", area);
}

function setLineColor(restrictionNumber) {
    var colorIndex = restrictionNumber%colorsArrayLenght;
    return colorsArray[colorIndex];
}

// REDRAWS THE WHOLE GRAPH BASED ON THE CONSTRAINTS EQUATIONS
function redefineGraph(restriction) {

    // GETTING THE INPUTS
    var inputs = restriction.getElementsByClassName('coefficient');
    var x1 = parseInt(inputs[0].value) || 0;
    var x2 = parseInt(inputs[1].value) || 0;
    var res = parseInt(inputs[2].value) || 0;
    var arithmeticOperator = restriction.getElementsByTagName('select')[0];
    var restrictionNumber = parseInt(restriction.getAttribute('value'));
    var scaleDataset;
    var lineDataset;

    // DEFINING THE BOTH LINE AND SCALE DATA SETS
    if(res === 0){
        return;
    }
    if(x1 !== 0){
        // both x1 and x2 set
        if(x2 !== 0){
            scaleDataset = {x: Math.ceil(res/x1), y: Math.ceil(res/x2)};
            scalesDatasetArray[restrictionNumber] = scaleDataset;
            updateGraphScale(scalesDatasetArray);

            lineDataset = [
                {x: 0, y: Math.ceil(res/x2)},
                {x: Math.ceil(res/x1), y: 0}
            ];

        // only x1 set
        } else {
            scaleDataset = {x: Math.ceil(res/x1), y: Math.ceil(res/x1)};
            scalesDatasetArray[restrictionNumber] = scaleDataset;
            updateGraphScale(scalesDatasetArray);

            lineDataset = [
                {x: res/x1, y: 0},
                {x: res/x1, y: -1}
            ];
        }
    } else {
        // only x2 set
        if(x2 !== 0){
            scaleDataset = {x: Math.ceil(res/x2), y: Math.ceil(res/x2)};
            scalesDatasetArray[restrictionNumber] = scaleDataset;
            updateGraphScale(scalesDatasetArray);

            lineDataset = [
                {x: 0, y: res/x2},
                {x: -1, y: res/x2}
            ];
        } else {
            lineDataset = [
                {x: 0, y: 0},
                {x: 0, y: 0}
            ];
        }
    }

    // DRAWING THE WHOLE GRAPH AREA AGAIN WITH UPDATED SCALES
    drawGraph();

    // ADDING THE NEW LINE TO THE ARRAY OF LINES
    linesArray[restrictionNumber] = lineDataset;

    // DRAWING ALL THE LINES BASED NOW ON THE NEW SCALE
    for (i = 0 ; i < linesArray.length ; i++) {
        drawLine(linesArray[i], i, d3.select('#graph-child'));
    }
}

// REMOVES A LINE FROM THE GRAPH AREA
function removeLine(restrictionNumber){
    resetLineDataset = [{x: 0, y: 0},
                        {x: 0, y: 0}];
    resetScaleDataset = [{x: 0, y: 0}];

    linesArray[restrictionNumber] = resetLineDataset;
    scalesDatasetArray[restrictionNumber] = resetScaleDataset;

    updateGraphScale();

    drawGraph();

    for (i = 0 ; i < linesArray.length ; i++) {
        drawLine(linesArray[i], i, d3.select('#graph-child'));
    }
}