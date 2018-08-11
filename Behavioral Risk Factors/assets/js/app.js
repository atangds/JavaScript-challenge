// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
const svgWidth = 960;
const svgHeight = 500;

const margin = {
    top: 40,
    right: 40,
    bottom: 90,
    left: 140
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "age_median";
let chosenYAxis = "heart_disease";

// function used for updating scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[chosenXAxis]))
        .range([0, width]);
    return xLinearScale;
}

function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[chosenYAxis]))
        .range([height, 0]);  
    return yLinearScale;
}

// function used for updating axis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]) + 5);
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    if (chosenXAxis === "age_median") {
        var xLabel = "Median Age";
    }
    else if (chosenXAxis === "income_household_median") {
        var xLabel = "Median Household Income ($)";
    }
    else {
        var xLabel = "16 Years and Older Employed (%)";
    }

    if (chosenYAxis === "heart_disease") {
        var yLabel = "Cardiovascular Disease (%)";
    }
    else if (chosenYAxis === "cancer_other") {
        var yLabel = "Cancer (Skin Cancer Excluded, %)";
    }
    else {
        var yLabel = "Depression (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([50, -77.5])
        .html(d => `${d.state}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);

    circlesGroup.call(toolTip);

    circlesGroup
        .on("mouseover", d => toolTip.show(d))
        .on("mouseout", d => toolTip.hide(d));

    textGroup
        .on("mouseover", d => toolTip.show(d))
        .on("mouseout", d => toolTip.hide(d));

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("../../data.csv", (err, data) => {
    if (err) throw err;

    // parse data
    data.map(d => {
        d.age_median = +d.age_median;
        d.income_household_median = +d.income_household_median;
        d.employed = +d.employed;
        d.heart_disease = +d.heart_disease;
        d.cancer_other = +d.cancer_other;
        d.depression = +d.depression;
    });

    // LinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`);
        // .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g");
        // .call(leftAxis);

    // append initial circles
    var circlesTextGroup = chartGroup
        .selectAll("g")
        .data(data)
        .enter();

    var circlesGroup = circlesTextGroup
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "lightseagreen")
        .attr("opacity", .5)
        .attr("stroke", "black")
        .on("mouseover", function() {
            d3.select(this)
                .attr("stroke", "none");
        });
    
    var textGroup = circlesTextGroup
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 3)
        .attr("fill", "white")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle");

    // Create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var xLabel1 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age_median") // value to grab for event listener
        .classed("active", true)
        .text("Median Age");

    var xLabel2 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income_household_median") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Household Income ($)");
    
    var xLabel3 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "employed") // value to grab for event listener
        .classed("inactive", true)
        .text("16 Years and Older Employed (%)");

    // Create group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var yLabel1 = yLabelsGroup.append("text")
        .attr("x", - (height / 2))
        .attr("y", -30)
        .attr("value", "heart_disease") // value to grab for event listener
        .classed("active", true)
        .text("Cardiovascular Disease (%)");

    var yLabel2 = yLabelsGroup.append("text")
        .attr("x", - (height / 2))
        .attr("y", -50)
        .attr("value", "cancer_other") // value to grab for event listener
        .classed("inactive", true)
        .text("Cancer (Skin Cancer Excluded, %)");
    
    var yLabel3 = yLabelsGroup.append("text")
        .attr("x", - (height / 2))
        .attr("y", -70)
        .attr("value", "depression") // value to grab for event listener
        .classed("inactive", true)
        .text("Depression (%)");

    xAxis.call(bottomAxis);
    yAxis.call(leftAxis);

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXaxis with value
                chosenXAxis = value;

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(data, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                // changes classes to change bold text
                if (chosenXAxis === "age_median") {
                    xLabel1
                    .classed("active", true)
                    .classed("inactive", false);
                    xLabel2
                    .classed("active", false)
                    .classed("inactive", true);
                    xLabel3
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenXAxis === "income_household_median") {
                    xLabel2
                    .classed("active", true)
                    .classed("inactive", false);
                    xLabel1
                    .classed("active", false)
                    .classed("inactive", true);
                    xLabel3
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                    xLabel3
                    .classed("active", true)
                    .classed("inactive", false);
                    xLabel1
                    .classed("active", false)
                    .classed("inactive", true);
                    xLabel2
                    .classed("active", false)
                    .classed("inactive", true);
                }
            }
        });
    
    // y axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenYaxis with value
                chosenYAxis = value;

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(data, chosenYAxis);

                // updates y axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new y values
                circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                // changes classes to change bold text
                if (chosenYAxis === "heart_disease") {
                    yLabel1
                    .classed("active", true)
                    .classed("inactive", false);
                    yLabel2
                    .classed("active", false)
                    .classed("inactive", true);
                    yLabel3
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenYAxis === "cancer_other") {
                    yLabel2
                    .classed("active", true)
                    .classed("inactive", false);
                    yLabel1
                    .classed("active", false)
                    .classed("inactive", true);
                    yLabel3
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                    yLabel3
                    .classed("active", true)
                    .classed("inactive", false);
                    yLabel1
                    .classed("active", false)
                    .classed("inactive", true);
                    yLabel2
                    .classed("active", false)
                    .classed("inactive", true);
                }
            }
        });
});
