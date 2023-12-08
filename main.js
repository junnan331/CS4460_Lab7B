// Function to create or update the bubble chart
function createBubbleChart(data) {
    const regionCounts = {};

    data.forEach(college => {
        const region = college.Region;
        regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    const width = 1200;
    const height = 700;

    const svg = d3.select('#main').select('svg')
        .attr('width', width)
        .attr('height', height);

    const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(regionCounts))])
        .range([30, 140]);

    const groupedData = d3.group(data, d => d.Region);
    const nodes = Array.from(groupedData.values(), (colleges, i) => ({
        id: i,
        colleges: colleges,
        radius: radiusScale(regionCounts[colleges[0].Region]),
        x: width / 2,
        y: height / 2
    }));

    const simulation = d3.forceSimulation(nodes)
        .force('collision', d3.forceCollide().radius(d => d.radius))
        .force('x', d3.forceX().x(width / 2).strength(0.1))
        .force('y', d3.forceY().y(height / 2).strength(0.1))
        .stop();

    for (let i = 0; i < 300; ++i) simulation.tick();

    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    const bubbles = svg.selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0.9);
                tooltip.html(`
                <div style="background-color: gray; padding: 8px; border-radius: 5px; font-size: 12px;">
                    <strong>Region:</strong> ${d.colleges[0].Region}<br>
                    <strong>Colleges:</strong> ${regionCounts[d.colleges[0].Region]}
                </div>
            `)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", (event, d) => {
            tooltip.transition() // Assuming tooltip.hide() is the correct method
            .style("opacity", 0);
            // Rest of your click event handling...
        });;

    bubbles.append('circle')
        .attr('r', d => d.radius)
        .style('fill', (d, i) => d3.schemeCategory10[i % 10]);

    bubbles.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('font-size', '10px')
        .attr('fill', 'white')
        .text(d => d.colleges[0].Region);

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '25px')
        .attr('font-weight', 'normal')
        .attr('fill', 'black')
        .text('Colleges in the US by Region');

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 685)
        .attr('text-anchor', 'middle')
        .attr('font-size', '25px')
        .attr('font-weight', 'normal')
        .attr('fill', 'blue')
        .attr('weight', 'bold')
        .text('Select a region to start');
}

// Read data from CSV file and create the initial bubble chart
let width = 1200;
let height = 600;
let previousChartData;
let selectedXAxis = 'Admission Rate'; // Replace 'defaultX' with the default X-axis column name
let selectedYAxis = 'SAT Average';
let bubble;
let ScatterTooltip1;// Create enhanced tooltip instance
let ScatterTooltip2 ;
let circles1;
let circles2;

d3.csv('colleges.csv').then(data => {
    previousChartData = data;
    createBubbleChart(previousChartData);

    // Function to handle bubble click
    d3.selectAll('circle').on('click', handleBubbleClick);
// ,,,,,,,,,,
let margin = { top: 20, right: 20, bottom: 50, left: 50 };

    function handleBubbleClick(event, d) {
        event.preventDefault();
        bubble = d.colleges[0].Region;
        console.log(bubble);
        // Clear the existing SVG content
        d3.select('#main').select('svg').selectAll('*').remove();

        // Create a new SVG and display "Empty SVG" text
        const width = 1200;
        const height = 600;
        const svg = d3.select('#main').select('svg')
            .attr('width', width)
            .attr('height', height);

        const chartGroup = svg.append('g');
       
        d3.select('#hiddenButton')
            .style('display', 'block');
            const defaultXAxis = "Admission Rate";
            const defaultYAxis = "SAT Average";
        
            const dropdowns1 = svg.append('foreignObject')
            .attr('x', 10)
            .attr('y', 60)
            .attr('width', 400)
            .attr('height', 60)
            .append('xhtml:body')
            .style('font', '14px "Arial"')
            .html(`
                    <div>
                    <label for="xAxis1">X-Axis:</label>
                    <select id="xAxis1">
                        ${getHeaders(data).map(header => `<option value="${header}" ${header === defaultXAxis ? 'selected' : ''}>${header}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="yAxis1">Y-Axis:</label>
                    <select id="yAxis1">
                        ${getHeaders(data).map(header => `<option value="${header}" ${header === defaultYAxis ? 'selected' : ''}>${header}</option>`).join('')}
                    </select>
                </div>
            `);
            const dropdowns2= svg.append('foreignObject')
            .attr('x', 500)
            .attr('y', 60)
            .attr('width', 400)
            .attr('height', 60)
            .append('xhtml:body')
            .style('font', '14px "Arial"')
            .html(`
                <div>
                <label for="xAxis2">X-Axis:</label>
                <select id="xAxis2">
                    ${getHeaders(data).map(header => `<option value="${header}" ${header === defaultXAxis ? 'selected' : ''}>${header}</option>`).join('')}
                </select>
            </div>
            <div>
                <label for="yAxis2">Y-Axis:</label>
                <select id="yAxis2">
                    ${getHeaders(data).map(header => `<option value="${header}" ${header === defaultYAxis ? 'selected' : ''}>${header}</option>`).join('')}
                </select>
            </div>
        `);
        svg.append('text')
        .attr('class', 'region-text')
        .attr('x', margin.left)
        .attr('y', margin.top+20)
        .attr('font-size', '14px')
        .attr('fill', 'blue');
        // scatter plot <<<<<<<<<<<<<<<<<<<
        // Usage
        ScatterTooltip1 = createTooltip(); // Create enhanced tooltip instance
        ScatterTooltip2 = createTooltip()
        let scatter1;
        let scatter2;
        d3.csv('colleges.csv').then(data => {
            scatter1= createScatterplot1(svg,data, 'xAxis1', 'yAxis1', bubble, ScatterTooltip1, scatter2);
            scatter2 = createScatterplot2(svg,data, 'xAxis2', 'yAxis2', ScatterTooltip2, scatter1);
            
        });
        svg.select('.region-text')
        .text(`Region: ${bubble}`);
   
        svg.append('text')
        .attr('class', 'region-text')
        .attr('x', margin.left)
        .attr('y', margin.top +20)
        .attr('font-size', '14px')
        .attr('fill', 'black');
     
       

        svg.append('text')
        .attr('x', width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '25px')
        .attr('font-weight', 'normal')
        .attr('fill', 'black')
        .text('Colleges in the US by Region');
        svg.append('circle')
        .attr('cx', 1100)
        .attr('cy', 200)
        .attr('r', 7)
        .attr('fill', 'red');

        // Add a label
        svg.append('text')
            .attr('x', 1120) // Position the label to the right of the dot
            .attr('y', 205) // Align the label with the center of the dot
            .text('Private'); // Add text to the label

            svg.append('circle')
            .attr('cx', 1100)
            .attr('cy', 220)
            .attr('r', 7)
            .attr('fill', 'green');
    
            // Add a label
            svg.append('text')
                .attr('x', 1120) // Position the label to the right of the dot
                .attr('y', 225) // Align the label with the center of the dot
                .text('Public'); // Add text to the label
    
    }
    function createTooltip() {
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    
        return {
            show: (event, d) => {
                console.log("d:", d)
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(`
                    <div style="background-color: gray; color: white; padding: 8px; border-radius: 4px;">
                        <strong>${d['Name']}</strong><br>
                        Control: ${d['Control']}<br>
                        Location: ${d['Locale']}<br>
                        %Biracial: ${d['% Biracial']}<br>
                        Admission Rate: ${d['Admission Rate']}
                    </div>
                `)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY) + "px");
                console.log(tooltip.html());
            },
            hide: () => {
                console.log("hide")

                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            }
        };
    }        

    // ................updatebrush2..............................................
   
    
    
    let brushedData = [];
    function updateScatter2(brushedData) {
        circles2.attr('opacity', function(d) {
            // Check if the data point is in the brushedData
            const isInBrushedData = brushedData.some(b => b.Name === d.Name && b.Region === d.Region);
    
            // Return the appropriate opacity
            return isInBrushedData ? 1 : 0.1;
        });
    }

    function updateScatter1(brushedData) {
        circles1.attr('opacity', function(d) {
            // Check if the data point is in the brushedData
            const isInBrushedData = brushedData.some(b => b.Name === d.Name && b.Region === d.Region);
    
            // Return the appropriate opacity
            return isInBrushedData ? 1 : 0.1;
        });
    }

    function createScatterplot1(svg, data, xAxisId, yAxisId, bubble, tooltip, target) {
        let selectedXAxis1 = d3.select(`#${xAxisId}`).node().value;
        let selectedYAxis1 = d3.select(`#${yAxisId}`).node().value;
        let filteredData = data.filter(d => d.Region === bubble);

        // Create scales, axes, and groups for axes
        const xScale1 = d3.scaleLinear()
            .range([margin.left + 20, margin.left + 400]);
    
        const yScale1 = d3.scaleLinear()
            .range([height - margin.bottom, height - margin.bottom - 400]);
    
        const xAxis1 = d3.axisBottom(xScale1);
        const yAxis1 = d3.axisLeft(yScale1);
    
        const xAxisGroup1 = svg.append('g')
            .attr('class', 'x-axis1')
            .attr('transform', `translate(0, ${height - margin.bottom})`);
    
        const yAxisGroup1 = svg.append('g')
            .attr('class', 'y-axis1')
            .attr('transform', `translate(${margin.left + 20}, 0)`);
        let tooltipVisible = false;

    // Declare circles variable outside the updateChart1 function
        
        function updateSelf(event) {
            const selection = event.selection;
        
            circles1.attr('opacity', function(d) {
                // Convert data point coordinates to pixel coordinates
                const cx = xScale1(+d[selectedXAxis1]);
                const cy = yScale1(+d[selectedYAxis1]);
        
                // Check if the circle is within the brush selection
                const isWithinSelection = 
                    selection[0][0] <= cx && cx <= selection[1][0] &&
                    selection[0][1] <= cy && cy <= selection[1][1];
        
                // Return the appropriate opacity
                return isWithinSelection ? 1 : 0.2;
            });
        }
        const brush1 = d3.brush()
            .extent([[margin.left + 20, height - margin.bottom - 400], [margin.left + 400, height - margin.bottom]])
            .on("brush", updateSelf)
            .on("end", () => {
                const selection = d3.brushSelection(d3.select('.brush1').node());

                if (selection) {
                    brushedData = filteredData.filter(d => {
                        const x = xScale1(+d[selectedXAxis1]);
                        const y = yScale1(+d[selectedYAxis1]);

                        return (
                            x >= selection[0][0] &&
                            x <= selection[1][0] &&
                            y >= selection[0][1] &&
                            y <= selection[1][1]
                        );
                    });
                    updateScatter2(brushedData);
                } else {
                    brushedData = [];
                    circles1.attr('opacity', 0.5);
                    circles2.attr('opacity', 0.5);
                }

                console.log("bBBBBBBBBBBBBBB:", brushedData);

            
            });
        svg.append("g")
        .attr("class", "brush1")
        .call(brush1);
        
    
        // Update the target scatter plot with the brushedData
        // Update function for the chart
        const updateChart1 = () => {
            

            selectedXAxis1 = d3.select(`#${xAxisId}`).node().value;
            selectedYAxis1 = d3.select(`#${yAxisId}`).node().value;
    
            // Filter data based on the selected "bubble" region
            
    
            // Update scales with the filtered data
            xScale1.domain([0, d3.max(filteredData, d => +d[selectedXAxis1])]);
            yScale1.domain([0, d3.max(filteredData, d => +d[selectedYAxis1])]);
    
            // Update axes
            xAxisGroup1.call(xAxis1);
            yAxisGroup1.call(yAxis1);
    

            circles1 = svg.selectAll('.circle1')
            .data(filteredData);


        circles1 = circles1.enter().append('circle')
            .attr('class', 'circle1')
            .merge(circles1)
            .attr('cx', d => xScale1(+d[selectedXAxis1]))
            .attr('cy', d => yScale1(+d[selectedYAxis1]))
            .attr('r', 7)
            .attr('fill', d => (d.Control === 'Private') ? 'red' : 'green')
            .attr('opacity', 0.5)

                .on("mouseover", function (event, d) {
                    console.log("Mouseover event:");

                    d3.select(this).attr('opacity', 1);
                    tooltip.show(event, d);
                    tooltipVisible = true;
                })
                .on("mouseleave", function () {
                    console.log("Mouseleave event:");

                    d3.select(this).attr('opacity', 0.5);
                    if (tooltipVisible) {
                        tooltip.hide();
                        tooltipVisible = false;
                    }
                });
            circles1.exit().remove();

    
    
            // Update axis labels
            svg.select('.x-axis-label1').text(selectedXAxis1);
            svg.select('.y-axis-label1').text(selectedYAxis1);

        };
        

        svg.append('text')
            .attr('x', width*0.2) // Adjust the x position for x-axis label
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .text(selectedXAxis1)
            .attr('class', 'x-axis-label1');
    
        svg.append('text')
            // .attr('x', margin.left + 500) // Adjust the x position for y-axis label
            .attr('y', height / 2 +10)
            .attr('x', -height / 8)
            .attr('transform', 'rotate(-90, 10, ' + (height / 2) + ')')
            .attr('text-anchor', 'middle')
            .text(selectedYAxis1)
            .attr('class', 'y-axis-label1');
    
        // Event listeners for dropdown changes
        d3.select(`#${xAxisId}`).on('change', updateChart1);
        d3.select(`#${yAxisId}`).on('change', updateChart1);
    
        // Initial chart rendering
        updateChart1();
    }


    function createScatterplot2(svg, data, xAxisId, yAxisId, tooltip) {
        let selectedXAxis2 = d3.select(`#${xAxisId}`).node().value;
        let selectedYAxis2 = d3.select(`#${yAxisId}`).node().value;

        function updateSelf(event) {
            const selection = event.selection;
        
            circles2.attr('opacity', function(d) {
                // Convert data point coordinates to pixel coordinates
                const cx = xScale2(+d[selectedXAxis2]);
                const cy = yScale2(+d[selectedYAxis2]);
        
                // Check if the circle is within the brush selection
                const isWithinSelection = 
                    selection[0][0] <= cx && cx <= selection[1][0] &&
                    selection[0][1] <= cy && cy <= selection[1][1];
        
                // Return the appropriate opacity
                return isWithinSelection ? 1 : 0.1;
            });
        }
        const brush2 = d3.brush()
        .extent([[margin.left + 500, margin.top+120], [margin.left + 900, height - margin.bottom]])
        .on("brush", updateSelf)
        .on("end", () => {
            const selection = d3.brushSelection(d3.select('.brush2').node());

            if (selection) {
                brushedData = data.filter(d => {
                    const x = xScale2(+d[selectedXAxis2]);
                    const y = yScale2(+d[selectedYAxis2]);

                    return (
                        x >= selection[0][0] &&
                        x <= selection[1][0] &&
                        y >= selection[0][1] &&
                        y <= selection[1][1]
                    );
                });
                updateScatter1(brushedData);
            } else {
                brushedData = [];
                circles1.attr('opacity', 0.5);
                circles2.attr('opacity', 0.5);
            }

            console.log("bBBBBBBBBBBBBBB:", brushedData);

        
        });
        // Append brush to scatter plot 2
        svg.append("g")
            .attr("class", "brush2")
            .call(brush2);

        const updateChart2 = () => {
            selectedXAxis2 = d3.select(`#${xAxisId}`).node().value;
            selectedYAxis2 = d3.select(`#${yAxisId}`).node().value;
    
            xScale2.domain([0, d3.max(data, d => +d[selectedXAxis2])]);
            yScale2.domain([0, d3.max(data, d => +d[selectedYAxis2])]);
    
            svg.select('.x-axis2').call(xAxis2);
            svg.select('.y-axis2').call(yAxis2);
    
            svg.selectAll('.circle2')
                .attr('cx', d => xScale2(+d[selectedXAxis2]))
                .attr('cy', d => yScale2(+d[selectedYAxis2]));
    
            svg.select('.x-axis-label2').text(selectedXAxis2);
            svg.select('.y-axis-label2').text(selectedYAxis2);
        };
    
        const xScale2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d[selectedXAxis2])])
            .range([margin.left + 500, margin.left + 900]);
    
        const yScale2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d[selectedYAxis2])])
            .range([height - margin.bottom, margin.top + 120]); // Set the range for the y-axis to have a length of 500
    
        const xAxis2 = d3.axisBottom(xScale2);
        const yAxis2 = d3.axisLeft(yScale2);
    
        svg.append('g')
            .attr('class', 'x-axis2')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis2);
    
        svg.append('g')
            .attr('class', 'y-axis2')
            .attr('transform', `translate(${margin.left + 500}, 0)`) // Adjust the translate value for y-axis position
            .call(yAxis2);
        circles2 = svg.selectAll('.circle2')
            .data(data);

        circles2 = circles2.enter().append('circle')
                .attr('class', 'circle2')
                .merge(circles2)
                .attr('cx', d => xScale2(+d[selectedXAxis2]))
                .attr('cy', d => yScale2(+d[selectedYAxis2]))
                .attr('r', 7)
                .attr('fill', d => (d.Control === 'Private') ? 'red' : 'green')
                .attr('opacity', 0.5)
                .on("mouseover", function (event, d) {
                    console.log("Mouseover event:");

                    d3.select(this).attr('opacity', 1);
                    tooltip.show(event, d);
                    tooltipVisible = true;
                })
                .on("mouseleave", function () {
                    console.log("Mouseleave event:");

                    d3.select(this).attr('opacity', 0.5);
                    if (tooltipVisible) {
                        tooltip.hide();
                        tooltipVisible = false;
                    }
                });
            circles2.exit().remove();
            
        // Append labels to axes
        svg.append('text')
            .attr('x', width * 0.65) // Adjust the x position for x-axis label
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .text(selectedXAxis2)
            .attr('class', 'x-axis-label2');
    
        svg.append('text')
            // .attr('x', margin.left + 500) // Adjust the x position for y-axis label
            .attr('y', height / 2 + 500)
            .attr('x', -height / 8 )
            .attr('transform', 'rotate(-90, 10, ' + (height / 2) + ')')
            .attr('text-anchor', 'middle')
            .text(selectedYAxis2)
            .attr('class', 'y-axis-label2');
    
        // Update axis labels and scales based on dropdown selection
        d3.select(`#${xAxisId}`).on('change', updateChart2);
        d3.select(`#${yAxisId}`).on('change', updateChart2);
    }



    function handleButtonClick() {
        d3.select('#main').select('svg').selectAll('*').remove();

        // If there is previous chart data, recreate and display the bubble chart
        if (previousChartData) {
            createBubbleChart(previousChartData);
            d3.selectAll('circle').on('click', handleBubbleClick);
            document.getElementById('hiddenButton').addEventListener('click', handleButtonClick);
        } else {
            console.log('No previous chart data available.');
        }

        d3.select('#hiddenButton').style('display', 'none');

    }

    document.getElementById('hiddenButton').addEventListener('click', handleButtonClick);
   
});


// Function to get headers from the data
function getHeaders(data) {
    return Object.keys(data[0]);
}