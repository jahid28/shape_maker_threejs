import * as THREE from "three";
import Experience from "../Experience.js";
import VertexManager from "./VertexManager.js";
import Camera from "../Camera.js";
import Shape from "./Shape.js";
export default class Pattern {
  vertices = [];
  allShapes = [];
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = new Camera();
    this.vertexManager = new VertexManager();
    this.isComplete = false;
    this.camera = new Camera();

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({visible: false})
    );
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.y = 0.1;
    this.scene.add(this.plane);
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.setupMouseEvents();
    this.setupCompleteButton();
    this.reset();
    this.copy();
  }

  setupMouseEvents() {
    document.querySelector(".webgl").addEventListener("click", (event) => {
      if (this.isComplete) {
        return;
      }

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera.instance);

      const intersects = this.raycaster.intersectObjects([this.plane]);

      this.vertexManager.addVertex(intersects[0].point);
    });
  }

  setupCompleteButton() {
    const button = document.getElementById("btnComplete");

    button.addEventListener("click", () => this.completeShape());
  }

  completeShape() {
    if(this.isComplete) return;
    this.vertices = this.vertexManager.getVertices();
    if (this.vertices.length < 3) {
      return;
    }
    this.isComplete = true;

    const obj = new Shape(this.vertices, false);
    this.allShapes.push(obj.getShape());

    this.vertexManager.removeVertices();
  }

  reset() {
    const button = document.getElementById("btnRemove");

    button.addEventListener("click", () => {
      this.isComplete = false;
      this.vertexManager.destroy();
      if (this.allShapes.length > 0) {
        this.allShapes.forEach((shape) => {
          this.scene.remove(shape);
          shape.geometry.dispose();
          shape.material.dispose();
        });
        this.allShapes = [];
      }
    });
  }

  copy() {
    const button = document.getElementById("btnCopy");

    button.addEventListener("click", () => {
      if (this.allShapes.length > 0) {
        const obj = new Shape(this.vertices, true);
        this.allShapes.push(obj.getShape());
      }
    });
  }
}