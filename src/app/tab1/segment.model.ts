import { Section } from './section.model';

export class Segment {
    title: string;
    sections: Array<Section>;

    constructor() {
        this.title = '';
        this.sections = new Array<Section>();
    }

    setTitle(title: string) {
        this.title = title;
    }

    setSections(section: Section) {
        this.sections.push(section);
    }
}
