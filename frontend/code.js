// Get references
const welcomeSection = document.getElementById('welcome');
const aboutSection = document.querySelector('.about');
const calculatorSection = document.getElementById('calculator');
const startBtn = document.getElementById('start-btn');
const toCalculatorBtn = document.getElementById('to-calculator-btn');
const form = document.getElementById('carbon-form');
const resultsDiv = document.getElementById('results');
const tipsDiv = document.getElementById('tips');
const chartSvg = d3.select("#chart");
const toggleDatasetBtn = document.getElementById('toggle-dataset-btn');
const datasetSection = document.getElementById('dataset-section');
const datasetTableBody = document.querySelector('#dataset-table tbody');

let datasetEntries = [];

// Load dataset from localStorage
function loadDataset() {
  const stored = localStorage.getItem('carbonDataset');
  if (stored) {
    datasetEntries = JSON.parse(stored);
  } else {
    datasetEntries = [];
  }
}

// Save dataset to localStorage
function saveDataset() {
  localStorage.setItem('carbonDataset', JSON.stringify(datasetEntries));
}

// Render dataset table rows
function renderDataset() {
  datasetTableBody.innerHTML = ''; // Clear existing
  datasetEntries.forEach((entry, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${entry.electricity}</td>
      <td>${entry.driving}</td>
      <td>${entry.gas}</td>
      <td>${entry.diet}</td>
      <td>${entry.emissions}</td>
    `;
    datasetTableBody.appendChild(tr);
  });
}


const learningSection = document.getElementById('learning');

// Navigation handlers
startBtn.addEventListener('click', () => {
  welcomeSection.style.display = 'none';
  aboutSection.style.display = 'block';
    learningSection.style.display = 'none'; // hide here

  window.scrollTo(0, 0);
});

toCalculatorBtn.addEventListener('click', () => {
  aboutSection.style.display = 'none';
  calculatorSection.style.display = 'block';
 // learningSection.style.display='none';
   learningSection.style.display = 'none'; // ensure hidden

  window.scrollTo(0, 0);
});

// Dataset toggle button
toggleDatasetBtn.addEventListener('click', () => {
  if (datasetSection.style.display === 'none') {
    renderDataset();
    datasetSection.style.display = 'block';
    toggleDatasetBtn.textContent = 'Hide Dataset';
  } else {
    datasetSection.style.display = 'none';
    toggleDatasetBtn.textContent = 'View Dataset';
  }
});

// Form submission - calculate footprint
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const electricity = parseFloat(document.getElementById('electricity').value);
  const driving = parseFloat(document.getElementById('driving').value);
  const gasCylinders = parseFloat(document.getElementById('gas-cylinders').value);
  const diet = document.getElementById('diet').value;

  if (!diet) {
    alert("Please select a diet type.");
    return;
  }

  // CO2 emission factors
  const factors = {
    electricity: 0.92,      // kg CO2 per kWh
    driving: 0.21,          // kg CO2 per km
    gas: 35.5,              // kg CO2 per gas cylinder refill
    diet: {
      omnivore: 3300,
      vegetarian: 1700,
      vegan: 1500
    }
  };

  // Calculate annual emissions
  const elec = electricity * 12 * factors.electricity;
  const trans = driving * 52 * factors.driving;
  const gasCO2 = gasCylinders * 12 * factors.gas;
  const food = factors.diet[diet];
  const total = elec + trans + food + gasCO2;

  const data = [
    { label: "Electricity", value: elec },
    { label: "Transport", value: trans },
    { label: "Food", value: food },
    { label: "LPG Gas", value: gasCO2 }
  ];

  drawChart(data);
  showTips(data, total);
  resultsDiv.style.display = 'block';

  // Save to dataset and localStorage
  datasetEntries.push({
    electricity: electricity.toFixed(2),
    driving: driving.toFixed(2),
    gas: gasCylinders.toFixed(2),
    diet,
    emissions: total.toFixed(2)
  });
  saveDataset();

  // Refresh dataset table if visible
  if (datasetSection.style.display === 'block') {
    renderDataset();
  }
});

// Draw pie chart using D3
function drawChart(data) {
  chartSvg.selectAll("*").remove();

  const width = +chartSvg.attr("width");
  const height = +chartSvg.attr("height");
  const radius = Math.min(width, height) / 2;

  const color = d3.scaleOrdinal(["#98c9a3", "#f4a261", "#87bdd8", "#e76f51"]);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);
  const g = chartSvg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const arcs = g.selectAll("g")
    .data(pie(data))
    .enter()
    .append("g");

  arcs.append("path")
    .attr("fill", (d, i) => color(i))
    .transition()
    .duration(1000)
    .attrTween("d", function (d) {
      const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return t => arc(i(t));
    });

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .style("fill", "#2e2e2e")
    .style("font-weight", "600")
    .style("font-size", "12px")
    .text(d => d.data.label);
}

// Show tips based on biggest emission source
function showTips(data, total) {
  const max = data.reduce((a, b) => (a.value > b.value ? a : b));
  const tips = {
    "Electricity": "💡 Use energy-efficient appliances and reduce air conditioning.",
    "Transport": "🚲 Walk, bike, or use public transport when possible.",
    "Food": "🥗 Choose more plant-based and locally sourced foods.",
    "LPG Gas": "🔥 Reduce gas use by switching to induction cookers or solar stoves."
  };

  tipsDiv.innerHTML = `
    <strong>Total Emissions:</strong> ${total.toFixed(2)} kg CO₂/year<br>
    <strong>Biggest Source:</strong> ${max.label}<br>
    <strong>Tip:</strong> ${tips[max.label]}
  `;
}

// Initialize app, load dataset from localStorage
loadDataset();

async function renderVideos(){
  const container=document.getElementById('videoscontainer');
  container.innerHTML='';
  const response=await fetch('http://localhost:3000/api/videos');//request
  const videos=await response.json();//convert the json response to js onject
  videos.forEach(video=>{
    const card=document.createElement('div');
    card.className='maincard';
    card.innerHTML=`
         <a href="${video.url}" target="_blank">
          <img src="${video.thumbnail}" alt="${video.title}"/>
          <p>${video.title}</p>
        </a>
        `;
      container.appendChild(card);
  })
}

async function renderArticles(){
  const container=document.getElementById('articlescontainer');
  container.innerHTML='';
  const response=await fetch('http://localhost:3000/api/articles');//request
  const articles=await response.json();//convert the json response to js onject
  articles.forEach(article=>{
    const card=document.createElement('div');
    card.className='maincard';
    card.innerHTML=`
         <a href="${article.url}" target="_blank">
          <img src="${article.thumbnail}" alt="${article.title}"/>
          <p>${article.title}</p>
        </a>
        `;
      container.appendChild(card);
  })
}
/*function handleScrollAnimation() {
  const section = document.getElementById('learning');
  const sectionTop = section.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight / 1.3;

  if (sectionTop < triggerPoint) {
    section.style.opacity = 1;
    section.style.transform = 'translateY(0)';
  }
}
  */
window.addEventListener('load',()=>{
  learningSection.style.display = 'block';

  renderVideos();
  renderArticles();
   //window.addEventListener('scroll', handleScrollAnimation);
});