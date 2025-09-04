/* eslint max-classes-per-file: ["error", 2] */
/* https://codepen.io/pookagehayes/pen/ExQZmKq?editors=1010 */

import gsap from 'gsap';

const sliderTemplate = document.createElement('template');
sliderTemplate.innerHTML = `
  <div
    class="track"
    part="track"
  ></div>
  <range-input
    class="slider-input"
    part="progress slider"
    role="slider"
    tabindex="0"
    aria-valuemin=""
    aria-valuemax=""
    aria-valuenow=""
    aria-label=""
  ></range-input>
`;

export class RangeSlider extends HTMLElement {
  #input: Element | null;

  #clone: DocumentFragment;

  constructor() {
    super();

    this.#clone = document.importNode(sliderTemplate.content, true);
    this.#input = this.#clone.querySelector('.slider-input');
  }

  connectedCallback() {
    this.appendChild(this.#clone);
    const { min, max, label } = this.dataset;

    if (!min) this.setAttribute('data-min', '0');
    if (!max) this.setAttribute('data-max', '100');
    if (!label) this.setAttribute('data-label', 'Progress');
  }

  attributeChangedCallback(attribute: string, prev: string, next: string) {
    if (prev !== next && this.#input) {
      switch (attribute) {
        case 'data-min': {
          this.#input.setAttribute('aria-valuemin', next);
          this.#input.setAttribute('aria-valuenow', next);
          break;
        }
        case 'data-max': {
          this.#input.setAttribute('aria-valuemax', next);
          break;
        }
        case 'data-label': {
          this.#input.setAttribute('aria-label', next);
          break;
        }
        default:
      }
    }
  }

  static get observedAttributes() {
    return ['data-min', 'data-max', 'data-label'];
  }
}

export class RangeInput extends HTMLElement {
  #nextFrame: any;

  #slider__width: number;

  #slider__posX: number;

  #value: number;

  #min: number;

  #max: number;

  constructor() {
    super();
    this.#slider__width = 0;
    this.#slider__posX = 0;
    this.#value = 0;
    this.#min = 0;
    this.#max = 100;

    this.addEventListener('mousedown', this.#grabStart);
    this.addEventListener('focus', this.#addKeyboardListeners);
    this.addEventListener('blur', this.#removeKeyboardListeners);
    window.addEventListener('resize', this.#cacheDimensions);

    this.#cacheDimensions();
  }

  attributeChangedCallback(attribute: string, prev: string, next: string) {
    if (prev !== next) {
      switch (attribute) {
        case 'aria-valuemin':
        case 'aria-valuemax':
        case 'aria-valuenow': {
          this.#min = parseInt(this.getAttribute('aria-valuemin') || '0');
          this.#max = parseInt(this.getAttribute('aria-valuemax') || '100');
          this.#value = parseInt(this.getAttribute('aria-valuenow') || '0');

          // prettier-ignore
          const percentage = ((this.#value / (this.#max - this.#min)) * 100) / 2;

          this.setAttribute('aria-valuetext', `${this.#value}%`);
          gsap.to(this, { x: `${percentage}%`, ease: 'power4.out' });
          break;
        }
        default:
      }
    }
  }

  static get observedAttributes() {
    return ['aria-valuemin', 'aria-valuemax', 'aria-valuenow'];
  }

  disconnectedCallback() {
    window.removeEventListener('mousemove', this.#grabMove);
    window.removeEventListener('mouseup', this.#grabEnd);
    window.removeEventListener('resize', this.#cacheDimensions);
    window.removeEventListener('focus', this.#addKeyboardListeners);
    window.removeEventListener('blur', this.#removeKeyboardListeners);
    this.#removeKeyboardListeners();

    window.cancelAnimationFrame(this.#nextFrame);
  }

  #addKeyboardListeners = () => {
    window.addEventListener('keydown', this.#handleKeyPress);
  };

  #removeKeyboardListeners = () => {
    window.removeEventListener('keydown', this.#handleKeyPress);
  };

  #grabStart = () => {
    this.dispatchEvent(new CustomEvent('seekstart'));
    window.addEventListener('mousemove', this.#grabMove);
    window.addEventListener('mouseup', this.#grabEnd);
  };

  #grabEnd = () => {
    this.dispatchEvent(new CustomEvent('seekend'));
    window.removeEventListener('mousemove', this.#grabMove);
    window.removeEventListener('mouseup', this.#grabEnd);
  };

  autoAnimate = (value: number) => {
    this.#nextFrame = requestAnimationFrame(() => {
      this.setAttribute('aria-valuenow', value.toString());
    });
  };

  #cacheDimensions = () => {
    this.#nextFrame = requestAnimationFrame(() => {
      const { width, left } = this.parentElement!.getBoundingClientRect();

      this.#slider__width = width;
      this.#slider__posX = left;
    });
  };

  #dispatchSeekEvent = (value: number) => {
    this.dispatchEvent(
      new CustomEvent('seeking', {
        detail: { position: value },
      })
    );
  };

  #grabMove = (event: MouseEvent) => {
    this.#nextFrame = requestAnimationFrame(() => {
      const { clientX } = event;
      const fromLeft = clientX - this.#slider__posX;
      const percentage = gsap.utils.clamp(0, 1, fromLeft / this.#slider__width);
      const value = this.#max * percentage;

      this.#dispatchSeekEvent(value);
      this.setAttribute('aria-valuenow', value.toString());
    });
  };

  #handleKeyPress = (event: KeyboardEvent) => {
    event.preventDefault();
    const { shiftKey, key } = event;

    const step = shiftKey ? Math.floor(this.#max / 10) : 5;

    let value = this.#value;
    switch (key) {
      case 'ArrowLeft': {
        value = gsap.utils.clamp(this.#min, this.#max, value - step);
        break;
      }
      case 'ArrowRight': {
        value = gsap.utils.clamp(this.#min, this.#max, value + step);
        break;
      }
      case 'Home': {
        value = this.#min;
        break;
      }
      // case 'End': {
      //   value = this.#max;
      //   break;
      // }
      default:
    }

    this.#dispatchSeekEvent(value);
    this.setAttribute('aria-valuenow', value.toString());
  };
}

window.customElements.define('range-slider', RangeSlider);
window.customElements.define('range-input', RangeInput);