interface LinkedListProps {
  id: number;
  length: number;
}

export class ListNode {
  val: any;

  next: ListNode | null;

  #DOMParentNode: HTMLElement;

  #DOMAnimatedNode: HTMLElement;

  #DOMStaticNode: HTMLElement;

  constructor(val: any, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
    this.#DOMParentNode = document.createElement('div');
    this.#DOMAnimatedNode = document.createElement('div');
    this.#DOMStaticNode = document.createElement('div');
  }

  #createDOMNode(linkedListID: number, linkedListLength: number) {
    const length = String(linkedListLength);
    const id = String(linkedListID);
    const value = String(this.val);
    const innerNode = `<div class="node-number"><span>${value}</span><div class="node-arrow"></div></div>`;
    const nodeClass = 'node absolute';

    this.#DOMParentNode.className = 'absolute top-0 w-node max-w-node';
    this.#DOMParentNode.dataset.position = length;
    this.#DOMParentNode.dataset.pointer = id;

    this.#DOMAnimatedNode.className = nodeClass;
    this.#DOMAnimatedNode.dataset.position = length;
    this.#DOMAnimatedNode.innerHTML = innerNode;

    this.#DOMStaticNode.className = nodeClass;
    this.#DOMStaticNode.innerHTML = innerNode;

    this.#DOMParentNode.appendChild(this.#DOMAnimatedNode);
    this.#DOMParentNode.appendChild(this.#DOMStaticNode);
  }

  set createDOMListNode({ id, length }: LinkedListProps) {
    this.#createDOMNode(id, length);
  }

  get DOMListNodeParent() {
    return this.#DOMParentNode;
  }

  get DOMListNodeAnimated() {
    return this.#DOMAnimatedNode;
  }

  get DOMListNodeStatic() {
    return this.#DOMStaticNode;
  }
}