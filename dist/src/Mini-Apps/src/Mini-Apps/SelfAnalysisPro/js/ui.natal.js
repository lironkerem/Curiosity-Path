// Mini-Apps/SelfAnalysisPro/js/ui.natal.js
// Patched: all API-derived values set via textContent (never innerHTML),
// img src kept as attribute (static URL from API response), aria on tables.

// XSS escape helper (for any values used in HTML attributes)
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

export function renderNatalChartBlock(astrologyResults) {
  const container = document.getElementById('natal-chart-output');
  if (!container) {
    console.warn('No #natal-chart-output container found.');
    return;
  }

  container.textContent = ''; // safe clear

  // === 1. Chart Wheel ===
  if (astrologyResults.natalChart?.output) {
    const chartSection = document.createElement('div');
    chartSection.className = 'natal-chart-section';

    const title = document.createElement('h3');
    title.textContent = 'Your Natal Chart';
    chartSection.appendChild(title);

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'natal-chart-svg';

    const img = document.createElement('img');
    // Validate it looks like a URL before setting as src
    const rawSrc = String(astrologyResults.natalChart.output || '');
    if (/^https?:\/\//.test(rawSrc) || rawSrc.startsWith('/')) {
      img.src = rawSrc;
    }
    img.alt   = 'Natal Birth Chart';
    img.style.cssText = 'max-width:100%;height:auto;';
    img.loading = 'lazy';

    chartWrapper.appendChild(img);
    chartSection.appendChild(chartWrapper);
    container.appendChild(chartSection);
  }

  // === 2. Planetary Positions ===
  if (astrologyResults.planets?.output) {
    const planetSection = document.createElement('div');
    planetSection.className = 'natal-planets-section';

    const title = document.createElement('h3');
    title.textContent = 'Planetary Positions';
    planetSection.appendChild(title);

    const table = document.createElement('table');
    table.className = 'natal-table planets-table';
    table.setAttribute('aria-label', 'Planetary positions');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Planet', 'Sign', 'Degree'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.setAttribute('scope', 'col');
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    astrologyResults.planets.output.forEach(p => {
      const tr = document.createElement('tr');

      const tdPlanet = document.createElement('td');
      tdPlanet.textContent = p.planet?.en || 'Unknown';

      const tdSign = document.createElement('td');
      tdSign.textContent = p.zodiac_sign?.name?.en || 'Unknown';

      const tdDegree = document.createElement('td');
      const deg = parseFloat(p.normDegree);
      tdDegree.textContent = isFinite(deg) ? `${deg.toFixed(2)}\u00B0` : '\u2014';

      tr.append(tdPlanet, tdSign, tdDegree);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    planetSection.appendChild(table);
    container.appendChild(planetSection);
  }

  // === 3. House Cusps ===
  if (astrologyResults.houses?.output?.Houses) {
    const houseSection = document.createElement('div');
    houseSection.className = 'natal-houses-section';

    const title = document.createElement('h3');
    title.textContent = 'House Cusps';
    houseSection.appendChild(title);

    const table = document.createElement('table');
    table.className = 'natal-table houses-table';
    table.setAttribute('aria-label', 'House cusps');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['House', 'Sign', 'Degree'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.setAttribute('scope', 'col');
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    astrologyResults.houses.output.Houses.forEach(h => {
      const tr = document.createElement('tr');

      const tdHouse = document.createElement('td');
      tdHouse.textContent = `House ${parseInt(h.House, 10) || h.House}`;

      const tdSign = document.createElement('td');
      tdSign.textContent = h.zodiac_sign?.name?.en || 'Unknown';

      const tdDegree = document.createElement('td');
      const deg = parseFloat(h.normDegree);
      tdDegree.textContent = isFinite(deg) ? `${deg.toFixed(2)}\u00B0` : '\u2014';

      tr.append(tdHouse, tdSign, tdDegree);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    houseSection.appendChild(table);
    container.appendChild(houseSection);
  }
}
