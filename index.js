// DOM helpers
const grab = (selector) => document.querySelector(selector);
const grabAll = (selector) => document.querySelectorAll(selector);
const listen = (node, e, callback) => node.addEventListener(e, callback);
const div = (className, order, color = ranomColor()) =>
  `<div draggable="true" class="${className}" style="order:${order}; background-color: ${color}">${color}</div>`;

const ranomColor = () => {
  const num = Math.floor(Math.random() * 180) + Math.floor(Math.random() * 180);
  return `hsla(${num}, 100%, 50%, 1)`;
};

const createGrid = (size) => {
  let template = ``;
  for (let i = 0; i < size; i++) {
    template += div(`item item--${i}`, i);
  }
  return template;
};

// Render grid
const grid = grab(".container");
grid.innerHTML = createGrid(16);

// Grab grid cells
const items = grabAll(".item");
// Add drag event listeners
for (const item of items) {
  listen(
    item,
    "mouseover",
    (e) => (e.target.style.boxShadow = "0.1rem 0.1rem 1rem hsla(0, 0%, 40%, 1)")
  );

  listen(item, "mouseleave", (e) => (e.target.style.boxShadow = "none"));

  listen(item, "dragstart", (e) => {
    const order = e.target.style.order
      ? e.target.style.order
      : e.target.classList.item(1).split("").reverse()[0] - 1;
    const id = e.target.classList.item(1);
    const data = JSON.stringify({ id: id, order: order });
    e.dataTransfer.setData("text/plain", data);
    e.target.style.animation = "";
  });

  listen(item, "dragenter", (e) => {
    e.preventDefault();
    e.currentTarget.style.opacity = 0.5;
    e.target.style.animation = "";
    e.target.style.boxShadow = "0.3rem 0.3rem 0.5rem hsla(0, 0%, 40%, 1)";
  });

  listen(item, "dragover", (e) => {
    e.preventDefault();
  });

  listen(item, "dragleave", (e) => {
    e.preventDefault();
    e.currentTarget.style.opacity = 1;
    e.target.style.boxShadow = "none";
  });

  listen(item, "dragend", (e) => (e.target.boxShadow = "none"));

  listen(item, "drop", (e) => {
    const newOrder = JSON.parse(e.dataTransfer.getData("text")).order;
    const oldOrder = e.currentTarget.style.order
      ? e.currentTarget.style.order
      : e.currentTarget.classList.item(1).split("").reverse()[0] - 1;
    const id = JSON.parse(e.dataTransfer.getData("text")).id;
    const dragedItem = grab("." + id);
    dragedItem.style.order = oldOrder;
    dragedItem.style.animation = "fadeIn .5s ease-in";
    e.currentTarget.style.order = newOrder;
    e.currentTarget.style.animation = "fadeIn .5s ease-in";
    e.currentTarget.style.opacity = 1;
  });
}
