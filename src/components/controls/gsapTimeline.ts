import type { RangeInput } from '@components/controls/customElements';
import gsap from 'gsap';

const resumeEl = document.getElementById('resume');
const restartEl = document.getElementById('restart');
const randomizeEl = document.getElementById('randomize');
const controlsEl = document.getElementById('controls');

const rangeSliderEl = document.createElement('range-slider');
rangeSliderEl.className = 'slider';

controlsEl!.appendChild(rangeSliderEl);

export class Timeline {
  #tl: GSAPTimeline;

  #activeState: boolean;

  #slider: RangeInput;

  #boundPlay: (this: HTMLElement, ev: MouseEvent) => any;

  #boundRestart: (this: HTMLElement, ev: MouseEvent) => any;

  #boundRandomize: (this: HTMLElement, ev: MouseEvent) => any;

  #boundSeekStart: (this: HTMLElement, ev: Event) => any;

  #boundSeekEnd: (this: HTMLElement, ev: Event) => any;

  #boundSeeking: (this: HTMLElement, ev: Event) => any;

  constructor() {
    this.#activeState = true;

    this.#boundPlay = () => this.#setPlay();
    this.#boundRestart = () => this.#setReset();
    this.#boundRandomize = () => this.#setRandomize();

    this.#boundSeekStart = () => this.#setSeekStart();
    this.#boundSeekEnd = () => this.#setSeekEnd();
    this.#boundSeeking = (e) => this.#setSeeking(e);

    this.#slider = rangeSliderEl.getElementsByTagName(
      'range-input'
    )[0] as RangeInput;

    this.#slider.addEventListener('seekstart', this.#boundSeekStart);
    this.#slider.addEventListener('seekend', this.#boundSeekEnd);
    this.#slider.addEventListener('seeking', this.#boundSeeking);

    this.#tl = gsap.timeline({
      onUpdate: () => {
        this.#slider.autoAnimate(Math.round(this.#tl.progress() * 100));
      },
    });

    resumeEl?.addEventListener('click', this.#boundPlay);
    restartEl?.addEventListener('click', this.#boundRestart);
    randomizeEl?.addEventListener('click', this.#boundRandomize);
  }

  #setSeekStart() {
    this.#tl.pause();
  }

  #setSeekEnd() {
    if (this.#activeState) this.#tl.play();
  }

  #setSeeking(e: Event) {
    // prettier-ignore
    const time = (Math.round((<CustomEvent>e).detail.position) / 100) * this.#tl.duration();
    this.#tl.seek(time);
  }

  #setPlay() {
    if (this.#activeState) {
      this.#tl.pause();
      resumeEl!.innerText = 'Play';
      this.#activeState = false;
    } else {
      this.#tl.play();
      resumeEl!.innerText = 'Pause';
      this.#activeState = true;
    }
  }

  #setReset() {
    this.#tl.restart();
    resumeEl!.innerText = 'Pause';
    this.#activeState = true;
  }

  #setRandomize() {
    this.#removeEventListeners();
    this.#tl.kill();
    // @ts-ignore
    this.#tl = null;
    resumeEl!.innerText = 'Pause';
    randomizeEl!.removeEventListener('click', this.#boundRandomize);
  }

  #removeEventListeners() {
    restartEl?.removeEventListener('click', this.#boundRestart);
    resumeEl?.removeEventListener('click', this.#boundPlay);

    this.#slider.removeEventListener('seekstart', this.#boundSeekStart);
    this.#slider.removeEventListener('seekend', this.#boundSeekEnd);
    this.#slider.removeEventListener('seeking', this.#boundSeeking);
  }

  get timeline() {
    return this.#tl;
  }
}