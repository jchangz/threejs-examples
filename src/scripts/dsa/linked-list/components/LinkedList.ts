import { ListNode } from './ListNode';

export class LinkedList {
  #id: number;

  #head: ListNode | null = null;

  #length: number;

  /** Array of Top Level DOM Nodes contaning animated and static nodes */
  #DOMNodes: Array<ListNode | null>;

  constructor(id: number) {
    this.#id = id;
    this.#head = null;
    this.#length = 1;
    this.#DOMNodes = [];
  }

  add(value: number) {
    const node = new ListNode(value);
    node.createDOMListNode = { id: this.#id, length: this.#length };
    this.#DOMNodes.push(node);

    let current = this.#head;
    if (this.#head == null) {
      this.#head = node;
    } else {
      while (current!.next) {
        current = current!.next;
      }
      current!.next = node;
    }

    this.#length += 1;
    return node;
  }

  addAll(arr: Array<number>) {
    for (let i = 0; i < arr.length; i++) {
      this.add(arr[i]);
    }
  }

  get LinkedListHead() {
    return this.#head;
  }

  get LinkedListID() {
    return this.#id;
  }

  /**
   * Return arr of top level DOM List Nodes contaning animated and static nodes.
   * Only animated at the start of the timeline.
   */
  get DOMParentNodes() {
    return this.#DOMNodes.map((elem) => elem!.DOMListNodeParent);
  }

  /**
   * Return array of HTMLElements of the DOM Nodes to be animated.
   */
  get DOMAnimatedNode() {
    return this.#DOMNodes.map((elem) => elem!.DOMListNodeAnimated);
  }

  /**
   * Returns array of HTMLElements of the Static DOM Nodes.
   * These nodes are animated during comparison and faded when list is null.
   */
  get DOMStaticNode() {
    return this.#DOMNodes.map((elem) => elem!.DOMListNodeStatic);
  }
}