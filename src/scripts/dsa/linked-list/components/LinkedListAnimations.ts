import { gsap } from 'gsap';

function fillArr(arr: Array<number>, maxLength: number) {
  let { length } = arr;
  const filledArr = [...arr];
  while (length < maxLength) {
    filledArr.push(0);
    length += 1;
  }
  return filledArr;
}

export class LinkedListAnimations {
  #numberOfLL: number;

  #maxLengthOfLL: number;

  #animationContainerEl: HTMLElement | null;

  #astroCodeEl: HTMLCollectionOf<Element>;

  #codeBlockPointerEl: HTMLElement | null;

  #timelineControlsEL: HTMLElement | null;

  #linkedListDescriptionDOMNodes: Array<HTMLSpanElement>;

  #nodesWithClosingBracket: Array<HTMLSpanElement>;

  constructor(numberOfLL: number, maxLengthOfLL: number, prefix: string) {
    this.#numberOfLL = numberOfLL;
    this.#maxLengthOfLL = maxLengthOfLL;
    this.#nodesWithClosingBracket = [];

    this.#animationContainerEl = document.getElementById(
      'linked-list-animation'
    );
    this.#astroCodeEl = document.getElementsByClassName('astro-code');
    this.#codeBlockPointerEl = document.getElementById('code-block-pointer');
    this.#timelineControlsEL = document.getElementById('timeline-controls');

    this.#linkedListDescriptionDOMNodes = [];

    this.#createLinkedListNumbersEl(prefix);
    this.#updateShikiCodeEl();
  }

  #createLinkedListNumbersEl(prefix: string) {
    const linkedListDescriptionEl = document.getElementById('linked-lists');
    const linkedListDescriptionFragment = document.createDocumentFragment();

    Array(this.#numberOfLL)
      .fill(0)
      .forEach((_, i) => {
        const newdiv = document.createElement('p');
        newdiv.className = 'linked-list-description';
        if (this.#numberOfLL > 1) {
          newdiv.innerHTML = `<span>${prefix}${i + 1} = [</span>`;
        } else {
          newdiv.innerHTML = `<span>${prefix} = [</span>`;
        }
        Array(this.#maxLengthOfLL)
          .fill(0)
          .forEach(() => {
            const newarr = document.createElement('span');
            newarr.innerText = '0';
            this.#linkedListDescriptionDOMNodes.push(newarr);
            newdiv.appendChild(newarr);
          });
        linkedListDescriptionFragment.appendChild(newdiv);
      });

    linkedListDescriptionEl!.replaceChildren(linkedListDescriptionFragment);
  }

  animateLinkedListNumbersEl(llArr: Array<Array<number>>) {
    if (this.#nodesWithClosingBracket) this.#removeNodesWithClosingBracket();

    let linkedListDescriptionValues: Array<number> = [];
    const lastNodeArray = Array(this.#numberOfLL * this.#maxLengthOfLL).fill(0);

    llArr.forEach((ll, i) => {
      const newArr = fillArr(ll, this.#maxLengthOfLL);
      linkedListDescriptionValues = linkedListDescriptionValues.concat(newArr);

      const lastNode = ll.length + this.#maxLengthOfLL * i - 1;
      lastNodeArray[lastNode] = 1;
    });

    this.#linkedListDescriptionDOMNodes.forEach((el, i) => {
      gsap.to(el, {
        textContent: linkedListDescriptionValues[i],
        opacity: linkedListDescriptionValues[i] ? 1 : 0,
        snap: { textContent: 1 },
      });

      if (lastNodeArray[i]) {
        el.classList.add('ll-last-node');
        this.#nodesWithClosingBracket.push(el);
      }
    });
  }

  #removeNodesWithClosingBracket() {
    this.#nodesWithClosingBracket.forEach((el) => {
      el.classList.remove('ll-last-node');
    });

    this.#nodesWithClosingBracket = [];
  }

  #updateShikiCodeEl() {
    // Get the width of the actual code
    // prettier-ignore
    const astroCodeElWidth = this.#astroCodeEl[0].children[0].getBoundingClientRect().width;
    // Set code overlay line width
    this.#codeBlockPointerEl!.style.width = `${astroCodeElWidth}px`;
  }

  initializeGSAPAnimations() {
    // Reset code highlight to initial position
    gsap.to(this.#codeBlockPointerEl, { y: 0, opacity: 1, duration: 0.2 });
    gsap.to(this.#timelineControlsEL, {
      opacity: 1,
    });
  }

  get codeBlockPointerEl() {
    return this.#codeBlockPointerEl;
  }

  get animationContainerEl() {
    return this.#animationContainerEl;
  }
}