/* Imports ----------------------------------------------------------------- */

import { deepCopy } from "./clcharts-d3-utils.js";
import { chartColors, paletteColors } from "./clcharts-d3-colors.js";
import { config } from "./config.js";
import { data } from "./data.js";
import "./style.css";

// D3 imports commented out for development: UNCOMMENT for production
// import "whatwg-fetch";
// import * as d3 from "d3";

/* Draw graphic ------------------------------------------------------------ */

function drawGraphic(settings, data, containerWidth, scale) {

    const margin = {
        top: settings.marginTop * scale, 
        right: settings.marginRight * scale, 
        bottom: settings.marginBottom, 
        left: settings.marginLeft};

    const width = containerWidth - margin.left - margin.right;
    const height = containerWidth * settings.ratio - margin.top - margin.bottom;

    // Key scale
    const keyScale = d3.scaleBand()
        .domain(data.map(d => d.key))
        .range([0, height])
        .paddingInner(settings.paddingInner)
        .paddingOuter(settings.paddingOuter);

    // Value scale
    const valueScale = d3.scaleLinear()
        .domain([settings.valueMin, settings.valueMax])
        .range([0, width]);

    // Clear the visualisation
    d3.select(`#${settings.element}-vis`).selectAll("*").remove();

    // Infobox
    const infobox = d3.select(`#${settings.element}-infobox`)
        .attr("class", "infobox")
        .style("opacity", "0")
        .style("text-align", "center")
        .style("padding", "5px 10px 5px 10px")
        .style("font-size", `${settings.labelSize}pt`)
        .style("font-weight", "bold")
        .style("background", chartColors.background)
        .style("color", paletteColors.commonsGreen)
        .style("border", `1px solid ${paletteColors.commonsGreen}`)
        .style("border-radius", "4px")
        .style("pointer-events", "none");

    // SVG
    const vis = d3.select(`#${settings.element}-vis`)
        .append("svg")
        .attr("id", "graphic")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Background
    vis.append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("fill", chartColors.background)
        .on("click", getBackgroundClickHandler(infobox));

    // Title
    vis.append("text")
        .attr("class", "title")
        .text(settings.titleText)
        .attr("x", settings.titleOffsetX)
        .attr("y", settings.titleOffsetY * scale)
        .style("font-size", `${settings.titleSize * scale}pt`)
        .style("fill", chartColors.title);


    // Title
    vis.append("text")
        .attr("class", "subtitle")
        .text(settings.subtitleText)
        .attr("x", settings.subtitleOffsetX)
        .attr("y", (settings.titleOffsetY + settings.subtitleOffsetY) * scale) 
        .style("font-size", `${settings.subtitleSize * scale}pt`)
        .style("fill", chartColors.title);

    // Canvas
    const canvas = vis.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Gridlines: X-axis
    function makeXGridlines() {
        
        const scale = d3.scaleLinear()
            .domain([settings.valueMin, settings.valueMax])
            .range([0, width]);  

        return d3.axisBottom(scale)
            .ticks(settings.valueTicks);
    }

    canvas.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(makeXGridlines()
            .tickSize(-height)
            .tickFormat(""));

    // Gridlines styles
    d3.select(".grid path")
        .style("opacity", 0);

    d3.selectAll(".grid line")
        .style("stroke", chartColors.grid)
        .style("shape-rendering", "crispEdges");

    // Bars
    canvas.selectAll(".value-clcharts")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("shape-rendering", "crispEdges")
        .attr("x", valueScale(0))
        .attr("y", d => keyScale(d.key))
        .attr("width", d => {
            return valueScale(d.value) - valueScale(0);
        })
        .attr("height", keyScale.bandwidth())
        .attr("fill", paletteColors.commonsGreen)
        .on("mouseover", getMouseOverHandler(
            infobox, margin, keyScale, valueScale))
        .on("mouseout", getMouseOutHandler(infobox));

    // X-axis settings
    canvas.append("g")
        .attr("class", "axis xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(valueScale).ticks(settings.valueTicks));

    // X-axis styles
    d3.selectAll(".xaxis text")
        .style("color", chartColors.axisText)
        .style("font-size", `${settings.valueSize}pt`);

    d3.select(".xaxis path")
        .style("opacity", 0);

    d3.selectAll(".xaxis line")
        .style("opacity", 0);

    // X-axis title
    canvas.append("text")
        .attr("class", "xaxis-title")
        .attr("transform", `translate(
            ${width / 2},
            ${height + settings.valueTitleOffset})`)
        .style("text-anchor", "middle")
        .style("fill", chartColors.axisTitle)
        .style("font-size", `${settings.valueTitleSize}pt`)
        .text(settings.valueTitleText);

    // Y-axis settings
    canvas.append("g")
        .attr("class", "axis yaxis")
        .style("color", chartColors.axisText)
        .call(d3.axisLeft(keyScale));

    // Y-axis styles
    d3.selectAll(".yaxis text")
        .style("color", chartColors.axisText)
        .style("font-size", `${settings.keySize}pt`);

    d3.select(".yaxis path")
        .style("opacity", 0);

    d3.selectAll(".yaxis line")
        .style("opacity", 0);
}

/* Infobox ----------------------------------------------------------------- */

// Shows the infobox with the given data
function showInfoBox(infobox, label, infoboxPosX, infoboxPosY) {

    infobox.html(label);

    infobox
        .style("left", infoboxPosX + "px")
        .style("top", infoboxPosY + "px");

    infobox
        .transition()
        .duration(100)
        .style("opacity", .96);
}

// Hides the infobox
function hideInfoBox(infobox) {
    infobox
        .transition()
        .duration(300)
        .style("opacity", 0);
}

/* Event handlers ---------------------------------------------------------- */

function getMouseOverHandler(infobox, margin, keyScale, valueScale) {
    return (d, i, n) => {
        d3.select(n[i]).attr("fill", paletteColors.oceanGreen);
        let infoboxPosX = margin.left + valueScale(d.value) - 85,
            infoboxPosY = margin.top + keyScale(d.key) - 7;
        showInfoBox(infobox, d.label, infoboxPosX, infoboxPosY);
    };
}

function getMouseOutHandler(infobox) {
    return (d, i, n) => {
        d3.select(n[i]).attr("fill", paletteColors.commonsGreen);
        hideInfoBox(infobox);
    };
}

function getBackgroundClickHandler(infobox) {
    return () => {
        d3.selectAll(".bar").attr("fill", paletteColors.commonsGreen);
        hideInfoBox(infobox);
    };
}

/* Draw graphic in container context --------------------------------------- */

function drawGraphicInContext(config, data) {

    // Get the actual width of the visualisation container
    const containerWidth = document
        .getElementById(`${config.main.element}-vis`)
        .getBoundingClientRect()
        .width;

    // Calculate scale as a percentage of maximum width
    const scale = containerWidth / config.main.containerMaxWidth;

    // Sort the alternative configurations by their maximum widths
    config.alts = config.alts
        .slice()
        .sort((a, b) => {
            return d3.ascending(
                a.containerMaxWidth, 
                b.containerMaxWidth);
        });

    // Check the main configuration has the largest maximum container width
    if (config.main.containerMaxWidth <= 
        config.alts[config.alts.length - 1].containerMaxWidth) {
        
        throw new Error(
            "The main configuration should have a larger containerMaxWidth " + 
            "than any of the alternative configurations");
    }

    // Create the base settings object
    let settings = deepCopy(config.main);

    // Update the settings object with any changes for this configuration
    for (const alt of config.alts) {
        if (containerWidth < alt.containerMaxWidth) {
            settings = Object.assign(settings, alt);
            break;
        }
    }

    // Set the keys and values for this configuration
    data = data.map(d => {
        return {
            key: d[settings.keyColumn],
            value: d[settings.valueColumn],
            label: d[settings.labelColumn]
        };
    });

    // Sort the data values from top to bottom
    data = data
        .slice()
        .sort((a, b) => d3.descending(a.value, b.value));

    drawGraphic(settings, data, containerWidth, scale);
}

/* Main -------------------------------------------------------------------- */

function main() {
    
    const element = d3.select(`#${config.main.element}`);
        
    // Create the infobox
    element.append("div")
        .attr("id", `${config.main.element}-infobox`)
        .style("position", "absolute")
        .style("opacity", "0");

    // Create the visualisation containers
    element.append("div")
        .attr("id", `${config.main.element}-container`)
        .style("max-width", `${config.main.containerMaxWidth}px`)
        .append("div")
        .attr("id", `${config.main.element}-vis`)
        .style("max-width", "100%");

    // Listen for a resize event and redraw when fired
    window.addEventListener("resize", () => {
        drawGraphicInContext(config, data);
    });

    // Do the initial draw
    drawGraphicInContext(config, data);
}

main();

