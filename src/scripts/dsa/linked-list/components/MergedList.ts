import { gsap } from 'gsap';

export class MergedList {
  #mergedList: HTMLElement;

  #mergedListNodes: HTMLElement;

  #mergedListPointer: HTMLElement;

  #mergedListNodePointer: HTMLElement;

  constructor() {
    // Create Merged List
    this.#mergedList = document.createElement('div');
    this.#mergedList.className = 'relative list-dashed';

    this.#mergedListNodes = document.createElement('div');
    this.#mergedListNodes.className = 'relative w-node max-w-node';
    // prettier-ignore
    this.#mergedListNodes.innerHTML = '<div class="node"><div class="node-number"><span></span><div class="node-arrow"></div></div></div>';

    this.#mergedListPointer = document.createElement('div');
    this.#mergedListPointer.className = 'absolute w-full top-0 h-full';
    this.#mergedListPointer.innerHTML = `
      <div class="node-pointer">
        <span class="top-full absolute font-bold">cur</span>
      </div>
    `;

    this.#mergedListNodePointer = document.createElement('div');
    // prettier-ignore
    this.#mergedListNodePointer.className = 'absolute w-full top-0 h-full opacity-0';
    this.#mergedListNodePointer.innerHTML = `
      <div class="node-pointer">
        <span class="top-full absolute font-bold bg-code-bg">node</span>
      </div>
    `;

    this.#mergedListNodes.appendChild(this.#mergedListPointer);
    this.#mergedListNodes.appendChild(this.#mergedListNodePointer);
    this.#mergedList.appendChild(this.#mergedListNodes);
  }

  resetAnimations() {
    gsap.to(this.#mergedListPointer, { x: 0, duration: 0 });
    gsap.to(this.#mergedListNodePointer, {
      opacity: 0,
      x: 0,
      duration: 0,
    });
    gsap.to(this.#mergedListNodes, {
      opacity: 0,
      scale: 1.3,
      duration: 0,
    });
  }

  showMergedListNode(tl: GSAPTimeline) {
    tl.to(this.#mergedListNodes, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.2,
      delay: 0.2,
      ease: 'back.inOut(1.7)',
    });
  }

  get mergedList() {
    return this.#mergedList;
  }

  get mergedListPointer() {
    return this.#mergedListPointer;
  }

  get mergedListNodePointer() {
    return this.#mergedListNodePointer;
  }
}