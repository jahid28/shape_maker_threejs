import * as THREE from "three";
import Experience from "../Experience.js";
export default class VertexManager {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.vertices = [];
    this.lines = [];
    this.geometry = new THREE.SphereGeometry(0.1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  }

  getVertices() {
    return this.vertices;
  }

  getLines() {
    return this.lines;
  }

  addVertex(position) {
    const vertex = new THREE.Mesh(this.geometry, this.material);
    vertex.position.copy(position);
    this.scene.add(vertex);
    this.vertices.push(vertex);

    if (this.vertices.length > 1) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        this.vertices[this.vertices.length - 2].position,
        position,
      ]);
      const line = new THREE.Line(lineGeometry, this.material);
      this.scene.add(line);
      this.lines.push(line);
    }
  }

  removeVertices() {
    this.vertices.forEach((vertex) => {
      this.scene.remove(vertex);
    });

    this.lines.forEach((line) => {
      this.scene.remove(line);
    });

    this.vertices = [];
    this.lines = [];
  }

  destroy() {
    this.vertices.forEach((vertex) => {
      this.scene.remove(vertex);
      vertex.geometry.dispose();
      vertex.material.dispose();
    });

    this.lines.forEach((line) => {
      this.scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    });

    this.vertices = [];
    this.lines = [];
  }
}
