import * as THREE from 'three';
import Experience from '../Experience';
export default class Grid {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.grid = new THREE.GridHelper(50, 50);
    // this.grid.rotation.x = Math.PI;
    this.scene.add(this.grid);
  }
}