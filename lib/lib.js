// Prerender a template for bootboxjs.
renderTmp = function(template, data) {
  var node = document.createElement("div");
  document.body.appendChild(node);
  UI.renderWithData(template, data, node);
  return node;
};

// Prototype
String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}