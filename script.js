const WIDTH = 1000;
const HEIGHT = 600;
const color = d3.scaleOrdinal(d3.schemeCategory10);

const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
const body = d3.select("body");
body.append("h1").text("Video Game Sales Data Top 100").attr("id", "title");
body
  .append("p")
  .text("Top Video Game Sales sorted by revenue")
  .attr("id", "description");

const canvas = body.append("svg").attr("id", "canvas");
const tooltip = body.append("div");

const drawTreeMap = (data) => {
  const hierarchy = d3
    .hierarchy(data, (node) => {
      return node["children"];
    })
    .sum((node) => {
      return node["value"];
    })
    .sort((node1, node2) => {
      return node2["value"] - node1["value"];
    });

  const createTreeMap = d3.treemap().size([WIDTH, HEIGHT]);
  createTreeMap(hierarchy);

  const tiles = hierarchy.leaves();
  const cell = canvas
    .selectAll("g")
    .data(tiles)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  cell
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => color(d.data.category))
    .attr("data-name", (d) => {
      return d.data.name;
    })
    .attr("data-category", (d) => {
      return d.data.category;
    })
    .attr("data-value", (d) => {
      return d.data.value;
    })
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .on("mouseover", (d, i) => {
      tooltip.transition().style("visibility", "visible");

      tooltip
        .attr("id", "tooltip")
        .attr("data-value", d.value)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px")
        .html(`<p><strong>Name:</strong> ${d.data.name}</p>
        <p><strong>Category:</strong> ${d.data.category}</p>
        <p><strong>Value:</strong> ${d.data.value}</p>
        `);
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });

  console.log(cell.style("width"));
  cell
    .append("text")
    .attr("y", 15)
    .attr("dy", 0)
    .text((d) => d.data.name) //add here
    .call(wrap, 45);

  const legend = body.append("svg").attr("id", "legend");
  const categories = hierarchy
    .leaves()
    .map((n) => n.data.category)
    .filter((item, idx, arr) => arr.indexOf(item) === idx);

  let legendWidth = +parseFloat(legend.style("width"));

  const LEGEND_OFFSET = 10;
  const LEGEND_RECT_SIZE = 15;
  const LEGEND_H_SPACING = 150;
  const LEGEND_V_SPACING = 10;
  const LEGEND_TEXT_X_OFFSET = 3;
  const LEGEND_TEXT_Y_OFFSET = -2;
  let legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

  let legendElem = legend
    .append("g")
    .attr("transform", `translate(60, ${LEGEND_OFFSET})`)
    .selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      return `translate(${(i % legendElemsPerRow) * LEGEND_H_SPACING}, ${
        Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
        LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)
      })`;
    });

  legendElem
    .append("rect")
    .attr("width", LEGEND_RECT_SIZE)
    .attr("height", LEGEND_RECT_SIZE)
    .attr("class", "legend-item")
    .attr("fill", (d) => color(d));

  legendElem
    .append("text")
    .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
    .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
    .text((d) => d);
};

d3.json(url).then((data, error) => {
  if (error) {
    console.log(error);
  }
  drawTreeMap(data);
});

const wrap = (text, width) => {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
};
