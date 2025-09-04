import type { LinkedList } from './LinkedList';

interface Pointer {
  [key: number]: HTMLElement;
}

export class LinkedListDOM {
  linkedLists: Array<LinkedList>;

  #DOMFragment: DocumentFragment;

  #DOMLinkedListPointers: Pointer;

  constructor(linkedLists: Array<LinkedList>, prefix: string) {
    this.linkedLists = linkedLists;
    this.#DOMFragment = document.createDocumentFragment();
    this.#DOMLinkedListPointers = {};
    this.#createDOMFragment(prefix);
  }

  /**
   * Create Pointer Node & add to #DOMLinkedListPointers.
   * @param id - id of the linked list
   * @returns pointer div element
   */
  #createPointerElement(id: number, caption: string) {
    const pointerWrapper = document.createElement('div');
    pointerWrapper.className = 'absolute w-full top-0 h-full';

    const pointerElement = document.createElement('div');
    pointerElement.className = 'node-pointer';
    if (id) pointerElement.dataset.pointer = String(id);
    /** Add pointer to linked list obj for access */
    pointerElement.innerHTML = `<span class="top-full absolute font-bold">${caption}</span>`;

    pointerWrapper.appendChild(pointerElement);
    if (id) this.#DOMLinkedListPointers[id] = pointerWrapper;
    return pointerWrapper;
  }

  #createDOMFragment(prefix: string) {
    this.linkedLists.forEach((list, i) => {
      // Set the data-translate-y property on the nodes.
      list.DOMAnimatedNode.forEach((node) => {
        const distance = 100 * (i + 1);
        node.dataset.translateY = distance.toString(); // eslint-disable-line no-param-reassign
      });

      const borderStyle = i % 2 ? 'list-dotted' : 'list-solid';
      const linkedListContainer = document.createElement('div');
      linkedListContainer.className = 'relative';
      linkedListContainer.classList.add(borderStyle);

      let linkedListCaption;
      if (this.linkedLists.length > 1) linkedListCaption = `${prefix}${i + 1}`;
      else linkedListCaption = prefix;

      const linkedListPointer = this.#createPointerElement(
        list.LinkedListID,
        linkedListCaption
      );

      const linkedListNodes = document.createElement('div');
      linkedListNodes.className = 'nodes';

      /** Non-animated relative node to keep aspect ratio of the block, contains pointer node */
      const reflowNode = document.createElement('div');
      reflowNode.className = 'relative w-node max-w-node';
      reflowNode.innerHTML = '<div class="node"></div>';
      reflowNode.appendChild(linkedListPointer);

      linkedListNodes.appendChild(reflowNode);
      list.DOMParentNodes.forEach((node) => {
        linkedListNodes.appendChild(node);
      });

      linkedListContainer.appendChild(linkedListNodes);
      this.#DOMFragment.appendChild(linkedListContainer);
    });
  }

  get documentFragment() {
    return this.#DOMFragment;
  }

  get linkedListPointers() {
    return this.#DOMLinkedListPointers;
  }
}