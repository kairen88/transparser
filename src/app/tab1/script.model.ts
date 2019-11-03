import { Segment } from './segment.model';

export class Script {
    segments: Array<Segment>;

    constructor() {
        this.segments = new Array<Segment>();
    }

    setSegment(segment: Segment) {
        this.segments.push(segment);
    }
}
