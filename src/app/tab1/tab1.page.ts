import { Component } from '@angular/core';
import { Script } from './script.model';
import { Segment } from './segment.model';
import { Section } from './section.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  transIn = '';
  segTitle = '';
  transOut = '';

  script: Script;
  segment: Segment;
  section: Section;

  constructor() {}

  convert() {

    if (!this.transIn || this.transIn === '') {
      return;
    }

    this.scriptInit();

    let lineNum = 0;

    const inAry = this.transIn.split('\n');

    for (const line of inAry) {

      lineNum += 1;

      const cols = line.split('\t');

      const data = new Array();
      // preprocess values
      for (const value of cols) {
        if (value && value !== '') {
          data.push(value);
        }
      }

      // handle title row
      if (data.length === 2 && data[1] !== '') {
        // store current segment
        if(this.segTitle) {
          this.updateSegmentInScript();
        }

        this.segTitle = data[1];

        // create new segment
        this.segment = new Segment();
        // create new section
        this.section = {
          engPhrases: new Array(),
          chiPhrases: new Array()
        };
      }

      // handle section data
      if (data.length >= 3 && data[1] !== '' && data[2] !== '') {
        const eng = data[1].trim();
        if (!this.isDuplicate(eng, this.section.engPhrases)) {
          this.section.engPhrases.push(eng);
        }
        const chi = data[2].trim();
        if (!this.isDuplicate(chi, this.section.chiPhrases)) {
          this.section.chiPhrases.push(chi);
        }
      }

      // handle break row
      if (data.length >= 1 && !data[1] && !data[2]) {
        // update section in segment
        this.segment.setTitle(this.segTitle);
        this.segment.setSections(this.section);

        // create new section
        this.section = {
          engPhrases: new Array(),
          chiPhrases: new Array()
        };
      }

      // handle end of input
      if(lineNum === inAry.length) {
        this.updateSegmentInScript();
      }
    }

    // output script
    this.outputScript();
  }

  private updateSegmentInScript() {
    this.segment.setTitle(this.segTitle);
    this.segment.setSections(this.section);
    this.script.setSegment(this.segment);
  }

  private scriptInit() {
    this.script = new Script();
    this.segment = new Segment();
    this.section = {
      engPhrases: new Array(),
      chiPhrases: new Array()
    };
  }

  outputScript() {
    this.transOut = '';

    for (const seg of this.script.segments) {
      if (!seg) {
        continue;
      }

      // set eng phrases
      this.transOut += '\n' + seg.title + '\n';
      for (const sec of seg.sections) {

        for (const eng of sec.engPhrases) {
          this.transOut += eng + ' ';
        }
        this.transOut += '\n';
      }

      // set chi phrases
      this.transOut += '\n' + seg.title + '\n';
      for (const sec of seg.sections) {

        for (const chi of sec.chiPhrases) {
          this.transOut += chi;
        }
        this.transOut += '\n';
      }
    }
  }

  isDuplicate(str: string, ary: string[]) {
    for (const phrase of ary) {
      if (str === phrase) {

      return true;
      }
    }
    return false;
  }

}
