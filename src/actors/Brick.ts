import Actor from "./Actor";
import {clamp} from "../math/index";

function randomComponent() {
    return clamp(Math.round(4 * Math.random()) / 4, 0.1, 0.9);
}

export default class Brick extends Actor {
    constructor() {
        super();
        this.size.set(40, 20);
        this.color.set(randomComponent(), randomComponent(), randomComponent());
    }
}