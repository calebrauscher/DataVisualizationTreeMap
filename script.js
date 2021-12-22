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
        .attr("left", d3.event.pageX + "px")
        .attr("top", d3.event.pageY + "px")
        .html(`<p><strong>Name:</strong> ${d.data.name}</p>
        <p><strong>Category:</strong> ${d.data.category}</p>
        <p><strong>Value:</strong> ${d.data.value}</p>
        `);
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });

  cell
    .append("text")
    .text((d) => d.data.name)
    .attr("x", 5)
    .attr("y", 15);

  const legend = body.append("svg").attr("id", "legend");
  const categories = hierarchy
    .leaves()
    .map((n) => n.data.category)
    .filter((item, idx, arr) => arr.indexOf(item) === idx);

  const blockSize = 20;
  const legendWidth = 200;
  const legendHeight = (blockSize + 2) * categories.length;

  legend
    .selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("fill", (d) => color(d))
    .attr("x", blockSize / 2)
    .attr("y", (_, i) => i * (blockSize + 1) + 10)
    .attr("width", blockSize)
    .attr("height", blockSize);

  legend
    .append("g")
    .selectAll("text")
    .data(categories)
    .enter()
    .append("text")
    .attr("fill", "black")
    .attr("fill", "black")
    .attr("x", blockSize * 2)
    .attr("y", (_, i) => i * (blockSize + 1) + 25)
    .text((d) => d);
};

d3.json(url).then((data, error) => {
  if (error) {
    console.log(error);
  }
  drawTreeMap(data);
});
