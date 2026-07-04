class PapuaMap {
    constructor() {
        this.mapContainer = null;
        this.destinations = [];
        this.currentLang = 'id';
    }

    init(mapContainerId, destinations, currentLang) {
        this.mapContainer = document.getElementById(mapContainerId);
        this.destinations = destinations;
        this.currentLang = currentLang;

        if (!this.mapContainer) return;

        this.renderMarkers();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        this.renderMarkers();
    }

    renderMarkers() {
        if (!this.mapContainer) return;

        // Clear existing markers (excluding the base map SVG)
        const oldMarkers = this.mapContainer.querySelectorAll('.map-marker-pin');
        oldMarkers.forEach(el => el.remove());

        // Create markers dynamically based on destinations
        this.destinations.forEach(dest => {
            const marker = document.createElement('div');
            marker.className = 'map-marker-pin';
            marker.style.left = `${dest.coords_x}%`;
            marker.style.top = `${dest.coords_y}%`;
            marker.dataset.destId = dest.id;

            // Dot inside marker
            const dot = document.createElement('div');
            dot.className = 'marker-dot';
            
            // Pulse rings for glowing effect
            const pulse = document.createElement('div');
            pulse.className = 'marker-pulse';

            // Tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'marker-tooltip';
            const name = this.currentLang === 'id' ? dest.name_id : dest.name_en;
            tooltip.innerHTML = `
                <h6>${name}</h6>
                <span class="region-tag">${dest.region}</span>
                <div class="rating-mini">⭐ ${dest.rating.toFixed(1)}</div>
            `;

            marker.appendChild(dot);
            marker.appendChild(pulse);
            marker.appendChild(tooltip);

            // Click interaction: Scroll to destination card and open its modal/highlight it
            marker.addEventListener('click', () => {
                const card = document.getElementById(`dest-card-${dest.id}`);
                if (card) {
                    // Highlight the card temporarily
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.classList.add('highlight-pulse');
                    setTimeout(() => {
                        card.classList.remove('highlight-pulse');
                    }, 2000);
                }
            });

            this.mapContainer.appendChild(marker);
        });
    }
}

const papuaMap = new PapuaMap();
export default papuaMap;
export { papuaMap };
