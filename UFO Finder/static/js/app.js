// from data.js
var tableData = data;

// YOUR CODE HERE!
function create_table(data) {
    d3.select("tbody").html("");
    data.map(row => {
        var new_row = d3.select("tbody").append("tr");
        Object.values(row).map(cell => new_row.append("td").text(cell));
    });
}

create_table(tableData);

var filters = ["datetime", "city", "state", "country", "shape"];
d3.select("button").on("click", function() {
    d3.event.preventDefault();
    var new_data = data;
    filters.map(filter => {
        var submit = d3.select("#" + filter);
        if (submit.property("value") !== "") {
            new_data = new_data.filter(row => row[filter] === submit.property("value"));         
        }
    });
    create_table(new_data);
});
