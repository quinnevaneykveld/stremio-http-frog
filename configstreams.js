// configstreams.js

// Define your frontend component using HTML and JavaScript
const ConfigPage = () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "fmovies";
    checkbox.checked = true;
    checkbox.id = "fmovies";
  
    const label = document.createElement("label");
    label.htmlFor = "fmovies";
    label.appendChild(document.createTextNode("fmovies"));
  
    const container = document.createElement("div");
    container.appendChild(checkbox);
    container.appendChild(label);
  
    return container;
  };
  
  // Define your backend component that returns the selected options
  const getConfig = () => {
    return {
      fmovies: true // Checked by default
    };
  };
  
  module.exports = {
    ConfigPage,
    getConfig
  };
  