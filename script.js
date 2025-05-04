document.addEventListener('DOMContentLoaded', function() {
    // Fetch the data
    const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            createHeatMap(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    
    function createHeatMap(data) {
        const baseTemperature = data.baseTemperature;
        const monthlyData = data.monthlyVariance;
        
        // Set dimensions and margins
        const margin = { top: 60, right: 80, bottom: 80, left: 80 };
        const width = 1000 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        
        // Create SVG
        const svg = d3.select("#heat-map")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Set up scales
        const years = monthlyData.map(d => d.year);
        const minYear = d3.min(years);
        const maxYear = d3.max(years);
        
        const xScale = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.01);
        
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const yScale = d3.scaleBand()
            .domain(months)
            .range([0, height])
            .padding(0.01);
        
        // Calculate temperature values for color scale
        const temps = monthlyData.map(d => baseTemperature + d.variance);
        const minTemp = d3.min(temps);
        const maxTemp = d3.max(temps);
        
        // Color scale - using 6 discrete colors
        const colorScale = d3.scaleThreshold()
            .domain([
                minTemp + (maxTemp - minTemp) * 0.2,
                minTemp + (maxTemp - minTemp) * 0.4,
                minTemp + (maxTemp - minTemp) * 0.6,
                minTemp + (maxTemp - minTemp) * 0.8
            ])
            .range([
                "#313695",
                "#4575b4",
                "#74add1",
                "#abd9e9",
                "#ffffbf",
                "#fdae61"
            ]);
        
        // Create tooltip
        const tooltip = d3.select("#tooltip");
        
        // Create cells
        svg.selectAll(".cell")
            .data(monthlyData)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("data-month", d => d.month - 1)
            .attr("data-year", d => d.year)
            .attr("data-temp", d => baseTemperature + d.variance)
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.month))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(baseTemperature + d.variance))
            .on("mouseover", function(event, d) {
                const date = new Date(d.year, d.month - 1);
                const monthName = date.toLocaleString('default', { month: 'long' });
                const temp = (baseTemperature + d.variance).toFixed(2);
                const variance = d.variance.toFixed(2);
                
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                
                tooltip.html(`${monthName} ${d.year}<br>${temp}℃<br>${variance}℃ variance`)
                    .attr("data-year", d.year)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        
        // Create x-axis
        const xAxis = d3.axisBottom(xScale)
            .tickValues(xScale.domain().filter(year => year % 10 === 0));
        
        svg.append("g")
            .attr("id", "x-axis")
            .attr("class", "year-axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);
        
        // Create y-axis with month names
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"];
        
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(month => monthNames[month - 1]);
        
        svg.append("g")
            .attr("id", "y-axis")
            .attr("class", "month-axis")
            .call(yAxis);
        
        // Add axis labels
        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", `translate(${-margin.left + 20},${height / 2}) rotate(-90)`)
            .text("Month");
        
        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", `translate(${width / 2},${height + margin.bottom - 20})`)
            .text("Year");
        
        // Create discrete legend
        const legendWidth = 300;
        const legendHeight = 30;
        const legendMargin = { top: 20, right: 20, bottom: 40, left: 20 };
        const legendRectWidth = legendWidth / colorScale.range().length;
        
        const legendSvg = d3.select("#heat-map")
            .append("svg")
            .attr("id", "legend")
            .attr("width", legendWidth + legendMargin.left + legendMargin.right)
            .attr("height", legendHeight + legendMargin.top + legendMargin.bottom)
            .append("g")
            .attr("transform", `translate(${legendMargin.left},${legendMargin.top})`);
        
        // Create legend rectangles with discrete colors
        legendSvg.selectAll(".legend-rect")
            .data(colorScale.range())
            .enter()
            .append("rect")
            .attr("class", "legend-rect")
            .attr("x", (d, i) => i * legendRectWidth)
            .attr("y", 0)
            .attr("width", legendRectWidth)
            .attr("height", legendHeight)
            .attr("fill", d => d);
        
        // Create legend axis
        const legendScale = d3.scaleLinear()
            .domain([minTemp, maxTemp])
            .range([0, legendWidth]);
        
        const legendAxis = d3.axisBottom(legendScale)
            .tickValues(colorScale.domain().concat([maxTemp]))
            .tickFormat(d3.format(".1f"));
        
        legendSvg.append("g")
            .attr("transform", `translate(0,${legendHeight})`)
            .call(legendAxis);
    }
});
