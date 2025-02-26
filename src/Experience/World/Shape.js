import * as THREE from "three";
import Experience from "../Experience";
import Camera from "../Camera.js";
import Grid from "./Grid.js";
export default class Shape {
  constructor(vertices, isCopy) {
    this.vertices = vertices;
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = new Camera();
    this.shape = new THREE.Shape();
    this.grid = new Grid();
    this.shape.moveTo(vertices[0].position.x, -vertices[0].position.z);

    for (let i = 1; i < vertices.length; i++) {
      this.shape.lineTo(vertices[i].position.x, -vertices[i].position.z);
    }

    const geometry = new THREE.ShapeGeometry(this.shape);
    const material = new THREE.MeshBasicMaterial({
      color: 0xf56c42,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, 0.1, 0);
    this.scene.add(mesh);

    this.shape = mesh;
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      // linewidth: 1,
    });
    const outline = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(outline);

    if (isCopy) {
      this.calculateCenter();
      let complete = false;

      this.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshBasicMaterial({ visible: false})
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = 0.1;
      this.scene.add(plane);
      window.addEventListener("mousemove", (event) => {
        if (complete) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera.instance);
        const intersects = this.raycaster.intersectObjects([plane]);

        if (intersects.length > 0) {
          this.shape.position.x = intersects[0].point.x - this.centerX;
          this.shape.position.z = intersects[0].point.z - this.centerZ;
        }
      });

      document.querySelector(".webgl").addEventListener("click", (event) => {
        complete = true;
        this.scene.remove(plane);
      });
    }
  }

  getShape() {
    return this.shape;
  }

  calculateCenter() {
    let sumX = 0;
    let sumZ = 0;

    for (const vertex of this.vertices) {
      const x = vertex.position.x;
      const z = vertex.position.z;
      sumX += x;
      sumZ += z;
    }

    this.centerX = sumX / this.vertices.length;
    this.centerZ = sumZ / this.vertices.length;
  }

  destroy() {
    this.scene.remove(this.shape);
    this.shape.geometry.dispose();
    this.shape.material.dispose();
  }
}
