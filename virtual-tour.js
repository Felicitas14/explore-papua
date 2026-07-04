class PapuaVirtualTour {
    constructor() {
        this.container = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.sphere = null;

        // Interaction states
        this.isUserInteracting = false;
        this.onPointerDownMouseX = 0;
        this.onPointerDownMouseY = 0;
        this.lon = 0;
        this.onPointerDownLon = 0;
        this.lat = 0;
        this.onPointerDownLat = 0;
        this.phi = 0;
        this.theta = 0;
        this.targetFov = 75;

        // Auto-rotation
        this.autoRotate = true;
        this.autoRotateSpeed = 0.05;

        // Animation frame handle
        this.animationFrameId = null;

        // Bindings
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onDocumentMouseWheel = this.onDocumentMouseWheel.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.animate = this.animate.bind(this);
    }

    init(containerId, imageUrl) {
        // Clean up previous instance if running
        this.destroy();

        this.container = document.getElementById(containerId);
        if (!this.container) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 500;

        // 1. Scene & Camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
        this.camera.target = new THREE.Vector3(0, 0, 0);

        // 2. Inverted Sphere Geometry for 360 projection
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1); // Invert faces to point inwards

        // 3. Texture Loader
        const texture = new THREE.TextureLoader().load(imageUrl, () => {
            // Trigger layout resize on image load to ensure correct scaling
            this.onWindowResize();
        });
        
        // Use basic material (no lighting needed for panorama)
        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);

        // 4. WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);

        // 5. Event Listeners
        this.container.addEventListener('pointerdown', this.onPointerDown);
        this.container.addEventListener('wheel', this.onDocumentMouseWheel);
        window.addEventListener('resize', this.onWindowResize);

        // Reset variables
        this.lon = 0;
        this.lat = 0;
        this.autoRotate = true;

        // 6. Start Loop
        this.animate();
    }

    zoomIn() {
        this.targetFov = Math.max(30, this.targetFov - 8);
    }

    zoomOut() {
        this.targetFov = Math.min(95, this.targetFov + 8);
    }

    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        return this.autoRotate;
    }

    onPointerDown(event) {
        if (!this.container) return;
        this.isUserInteracting = true;
        this.autoRotate = false; // Disable auto-rotate when user interacts

        this.onPointerDownMouseX = event.clientX;
        this.onPointerDownMouseY = event.clientY;

        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;

        document.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('pointerup', this.onPointerUp);
    }

    onPointerMove(event) {
        if (this.isUserInteracting === true) {
            this.lon = (this.onPointerDownMouseX - event.clientX) * 0.15 + this.onPointerDownLon;
            this.lat = (event.clientY - this.onPointerDownMouseY) * 0.15 + this.onPointerDownLat;
        }
    }

    onPointerUp() {
        this.isUserInteracting = false;
        document.removeEventListener('pointermove', this.onPointerMove);
        document.removeEventListener('pointerup', this.onPointerUp);
    }

    onDocumentMouseWheel(event) {
        // Prevent page scroll when inside virtual tour
        event.preventDefault();
        this.targetFov = Math.max(30, Math.min(95, this.camera.fov + event.deltaY * 0.05));
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;

        this.animationFrameId = requestAnimationFrame(this.animate);

        // Auto rotate if enabled
        if (this.autoRotate) {
            this.lon += this.autoRotateSpeed;
        }

        // Clamp latitude to avoid flipping at poles
        this.lat = Math.max(-85, Math.min(85, this.lat));
        
        // Convert spherical coords to Cartesian target coordinates
        this.phi = THREE.MathUtils.degToRad(90 - this.lat);
        this.theta = THREE.MathUtils.degToRad(this.lon);

        const target = this.camera.target;
        target.x = 500 * Math.sin(this.phi) * Math.sin(this.theta);
        target.y = 500 * Math.cos(this.phi);
        target.z = 500 * Math.sin(this.phi) * Math.cos(this.theta);

        // Smooth camera FOV zooming
        if (Math.abs(this.camera.fov - this.targetFov) > 0.05) {
            this.camera.fov += (this.targetFov - this.camera.fov) * 0.1;
            this.camera.updateProjectionMatrix();
        }

        this.camera.lookAt(target);
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.container) {
            this.container.removeEventListener('pointerdown', this.onPointerDown);
            this.container.removeEventListener('wheel', this.onDocumentMouseWheel);
            
            // Clean DOM element
            if (this.renderer && this.renderer.domElement) {
                try {
                    this.container.removeChild(this.renderer.domElement);
                } catch(e) {}
            }
        }

        window.removeEventListener('resize', this.onWindowResize);
        document.removeEventListener('pointermove', this.onPointerMove);
        document.removeEventListener('pointerup', this.onPointerUp);

        // Dispose WebGL resources
        if (this.sphere) {
            this.scene.remove(this.sphere);
            if (this.sphere.geometry) this.sphere.geometry.dispose();
            if (this.sphere.material) {
                if (this.sphere.material.map) this.sphere.material.map.dispose();
                this.sphere.material.dispose();
            }
            this.sphere = null;
        }

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.container = null;
    }
}

const papuaVirtualTour = new PapuaVirtualTour();
export default papuaVirtualTour;
export { papuaVirtualTour };
