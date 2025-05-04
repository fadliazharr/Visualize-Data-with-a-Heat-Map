const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const svg = d3.select("#scatterplot");
const width = +svg.attr("width");
const height = +svg.attr("height");
const padding = 60;

const tooltip = d3.select("#tooltip");

d3.json(url).then(data => {
  data.forEach(d => {
    d.Time = d3.timeParse("%M:%S")(d.Time);
    d.YearDate = new Date(d.Year, 0); // Jan 1st of the year
  });

  const xScale = d3.scaleTime()
    .domain([
      d3.min(data, d => d.YearDate),
      d3.max(data, d => d.YearDate)
    ])
    .range([padding, width - padding]);

  const yScale = d3.scaleTime()
    .domain([
      d3.min(data, d => d.Time),
      d3.max(data, d => d.Time)
    ])
    .range([padding, height - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.YearDate))
    .attr("cy", d => yScale(d.Time))
    .attr("r", 6)
    .attr("fill", d => d.Doping ? "red" : "green")
    .attr("data-xvalue", d => d.YearDate.toISOString())
    .attr("data-yvalue", d => d.Time.toISOString())
    .on("mouseover", function(event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`
        <strong>${d.Name}</strong>: ${d.Nationality}<br/>
        Year: ${d.Year}, Time: ${d3.timeFormat("%M:%S")(d.Time)}<br/>
        ${d.Doping ? d.Doping : "No doping allegations"}
      `)
      .attr("data-year", d.YearDate.toISOString())
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  const legend = svg.append("g").attr("id", "legend");

  legend.append("rect")
    .attr("x", width - 180)
    .attr("y", 100)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", "red");

  legend.append("text")
    .attr("x", width - 160)
    .attr("y", 110)
    .text("Riders with doping allegations")
    .attr("alignment-baseline", "middle");

  legend.append("rect")
    .attr("x", width - 180)
    .attr("y", 120)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", "green");

  legend.append("text")
    .attr("x", width - 160)
    .attr("y", 130)
    .text("No doping allegations")
    .attr("alignment-baseline", "middle");
});
