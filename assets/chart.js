var dataArr1 = [0]; /* The chart data for "Data 1", altering this array/list changes the graph data */
var dataArr2 = [0]; /* The chart data for "Data 1", altering this array/list changes the graph data */

var ctx = document.getElementById('my_chart').getContext('2d'); //Defines the basic graphic element of the graph

var myLineChart = new Chart(ctx, { //Defines the graph
    type: 'line', //Defines the type of graph
    data: { //Decides how the data (content of the graph will be)
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], //Labels define the values of the x-axis (and can be altered at a later point/live)
        datasets: [ //Datasets refers to the different graphs and the data they contain
            {
                label: 'Kontinuerlig Temperatur:', //Label of dataset/graph 1
                data: dataArr1, //The dataArray that actually stores the data
                backgroundColor: [ //The background color of the graph (usually not in use)
                    '#a3c9a5'
                ],
                borderColor: [ //The border color of the graph (the color of the actual line)
                    '#4CAF50'
                ],
                borderWidth: 1, //The width of the graph line
                fill: false
            },
            //Kommenterer ut datalabel 2 så denne ikke vises i grafen.
            /*{
                label: 'Gj.Temperatur',
                data: dataArr2,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgb(29,28,255)'
                ],
                borderWidth: 1,
                fill: false
            }*/
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true //Keep this true to begin at zero in the graph
                }
            }]
        },
        responsive: true,
        maintainAspectRatio: false
    }
});