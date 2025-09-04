import gsap from 'gsap';
import { Timeline } from '@components/controls/gsapTimeline';

export class LinkedListTimeline {
  #tl: GSAPTimeline;

  #allNodes: Array<HTMLElement>;

  #animationContainerEl: HTMLElement | null;

  #codeBlockPointerEl: HTMLElement | null;

  constructor(
    allNodes: Array<HTMLElement>,
    animationContainerEl: HTMLElement | null,
    codeBlockPointerEl: HTMLElement | null
  ) {
    const tl = new Timeline();
    this.#tl = tl.timeline;
    this.#animationContainerEl = animationContainerEl;
    this.#codeBlockPointerEl = codeBlockPointerEl;
    this.#allNodes = allNodes;
    this.#initializeAnimation();
  }

  #initializeAnimation() {
    gsap.fromTo(
      this.#allNodes,
      {
        scale: 1.2,
        opacity: 0,
        ease: 'back.inOut(1.7)',
      },
      {
        // prettier-ignore
        x: (i: number, el: HTMLElement) => `${100 * (parseInt(el.getAttribute('data-position') || '0') - 1)}%`,
        scale: 1,
        opacity: 1,
        stagger: { each: 0.02 },
        duration: 0.25,
        ease: 'back.inOut(1.7)',
      }
    );
  }

  compareNodes(target: Array<Element | null>) {
    this.#tl.to(target, {
      scale: 1.3,
      ease: 'sine.inOut',
      duration: 0.2,
    });
  }

  transformNode = (target: Array<ChildNode | null>, xPos: number) => {
    this.#tl.to(target, {
      opacity: 1,
      x: `${100 * xPos}%`,
      y: (i, el: HTMLElement) => `-${el.getAttribute('data-translate-y')}%`,
      ease: 'power4.out',
      duration: 0.5,
    });
  };

  transformNodeY = (target: Array<ChildNode | null>, yPos: number) => {
    this.#tl.to(target, {
      y: `${yPos}%`,
      ease: 'power4.out',
      duration: 0.5,
    });
  };

  moveCodeToLine = (toLine: number) => {
    this.#tl.to(this.#codeBlockPointerEl, {
      y: `${100 * toLine}%`,
      ease: 'sine.inOut',
      duration: 0.2,
      delay: 0.5,
    });
  };

  movePointer = (node: HTMLElement, position: number) => {
    this.#tl.to(node, {
      x: `${100 * position}%`,
      ease: 'sine.inOut',
      duration: 0.2,
    });
  };

  popOut(target: Array<ChildNode | null>) {
    const shifted = target.shift()!.firstChild;
    this.#tl.to(shifted, {
      scale: 1.5,
      ease: 'sine.inOut',
      duration: 0.1,
    });
    this.#tl.to(shifted, { scale: 1.3, ease: 'sine.inOut', duration: 0.1 });
  }

  fadeOut(target: Array<Element | null>) {
    this.#tl.to(target, { opacity: 0.5, ease: 'sine.inOut', duration: 0.2 });
  }

  shake(target: Array<ChildNode | null>) {
    this.#tl.to(target, {
      opacity: 0.5,
      ease: 'elastic',
      duration: 0.2,
      rotation: 30,
      repeat: 5,
    });
    this.#tl.to(
      target,
      {
        opacity: 0.5,
        ease: 'elastic',
        duration: 1,
        rotation: 0,
      },
      '-=90%'
    );
  }

  resetTransformations(target: Array<ChildNode | null>) {
    this.#tl.to(
      target,
      {
        x: 0,
        y: 0,
        opacity: 0,
        ease: 'back.inOut(1.7)',
        duration: 0.5,
      },
      '-=90%'
    );
  }

  resetNodeComparison(target: Array<Element | null>) {
    this.#tl.to(
      target,
      { scale: 1, ease: 'sine.inOut', duration: 0.2 },
      '>-50%'
    );
  }

  get timeline() {
    return this.#tl;
  }
}