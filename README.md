# Visualize-Data-with-a-Heat-Map
https://visualize-data-with-a-heat-map.vercel.app/
# Global Temperature Heat Map

This project visualizes the monthly global land-surface temperature data from the years 1753 to 2015. The heat map uses a color scale to represent temperature variances, providing an interactive way to explore global temperature trends over time.

## Description

The heat map represents the monthly global temperature data. The x-axis shows the years, ranging from 1753 to 2015, and the y-axis shows the months, from January to December. Each cell in the heat map corresponds to a specific year and month, with the color of the cell representing the temperature variance from the base temperature. The base temperature is 8.66°C, and the temperature variance is calculated relative to this value.

### Features:

* **Interactive Tooltip**: Hovering over any heat map cell displays a tooltip with the month, year, temperature, and variance for that specific month-year combination.
* **Color Scale**: The cells are color-coded based on the temperature variance, with discrete colors representing different ranges of temperature change.
* **Legend**: A discrete color legend shows the mapping of temperature variances to colors.
* **Axis Labels**: The x-axis represents years, and the y-axis represents months with full month names.

## Tools Used

* **HTML/CSS**: Used for structuring and styling the webpage.
* **JavaScript (D3.js)**: The D3.js library is used to handle data visualization and interaction. D3 manipulates the DOM to create the heat map, manage scales, and handle mouse events for the tooltip.
* **Fetch API**: Used to retrieve the global temperature data from an external JSON file.

## How It Was Made

1. **Data Fetching**: The temperature data is fetched from an external JSON file hosted on GitHub.
2. **SVG Creation**: An SVG element is created to hold the heat map. The map is dynamically generated based on the data fetched.
3. **Scales and Axes**: D3 is used to create the x and y scales, which determine the positioning of the heat map cells. The x-axis shows the years, and the y-axis shows the months.
4. **Color Scale**: A color scale is defined to map temperature variance to different colors.
5. **Cells Creation**: Each cell represents a specific month-year combination, with the temperature variance determining the fill color of the cell.
6. **Tooltip**: A tooltip appears when hovering over a cell, showing more details about the selected month and year.
7. **Legend**: A discrete legend is created to show the range of temperature variances corresponding to different colors on the heat map.


