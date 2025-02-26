import Experience from "../Experience.js";
import Grid from "./Grid.js";
import Pattern from "./Pattern.js";
export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    // const axesHelper = new THREE.AxesHelper(10)
    // this.scene.add(axesHelper)

    this.grid = new Grid();
    this.pattern = new Pattern();
  }
}
