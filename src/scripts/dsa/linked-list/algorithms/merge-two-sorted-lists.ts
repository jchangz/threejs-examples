import { generateArr } from '@scripts/dsa/linked-list/components/helpers';
import { ListNode } from '@scripts/dsa/linked-list/components/ListNode';
import { LinkedList } from '@scripts/dsa/linked-list/components/LinkedList';
import { LinkedListDOM } from '@scripts/dsa/linked-list/components/LinkedListDOM';
import { LinkedListAnimations } from '../components/LinkedListAnimations';
import { LinkedListTimeline } from '../components/LinkedListTimeline';
import { MergedList } from '../components/MergedList';

const linkedListAnimations = new LinkedListAnimations(2, 4, 'l');
const { animationContainerEl, codeBlockPointerEl } = linkedListAnimations;
const mergedLinkedList = new MergedList();
// prettier-ignore
const { mergedList, mergedListPointer, mergedListNodePointer } = mergedLinkedList;

function mergeTwoSortedLists(arr1: Array<number>, arr2: Array<number>) {
  // Keep track of x positions of pointer nodes for each list
  const pointerXPos = {
    mergedList: 1,
    list1: 0,
    list2: 0,
  };
  linkedListAnimations.initializeGSAPAnimations();

  const linkedList1 = new LinkedList(1);
  linkedList1.addAll(arr1);
  const linkedList2 = new LinkedList(2);
  linkedList2.addAll(arr2);

  // Get Nodes to be translated to new position of sorted list
  const list1Nodes = linkedList1.DOMAnimatedNode;
  const list2Nodes = linkedList2.DOMAnimatedNode;

  // Static Nodes to be animated when comparing nodes, array will be shifted so we make a copy below
  const list1StaticNodes = linkedList1.DOMStaticNode;
  const list2StaticNodes = linkedList2.DOMStaticNode;
  // Static Nodes copy to be used to hide the list when pointer reaches null
  const list1StaticNodesAll = [...list1StaticNodes];
  const list2StaticNodesAll = [...list2StaticNodes];

  linkedListAnimations.animateLinkedListNumbersEl([arr1, arr2]);

  const DOMLinkedList = new LinkedListDOM([linkedList1, linkedList2], 'l');
  const fragment = DOMLinkedList.documentFragment;
  fragment.prepend(mergedList);
  animationContainerEl!.replaceChildren(fragment);

  mergedLinkedList.resetAnimations();

  const allNodes = [
    ...linkedList1.DOMParentNodes,
    ...linkedList2.DOMParentNodes,
  ];
  const gsaptimeline = new LinkedListTimeline(
    allNodes,
    animationContainerEl,
    codeBlockPointerEl
  );
  const { timeline } = gsaptimeline;

  let list1 = linkedList1.LinkedListHead;
  let list2 = linkedList2.LinkedListHead;
  const list1Pointer = DOMLinkedList.linkedListPointers[1];
  const list2Pointer = DOMLinkedList.linkedListPointers[2];

  const node = new ListNode(null, null);
  let cur = node;

  gsaptimeline.moveCodeToLine(1);
  mergedLinkedList.showMergedListNode(timeline);

  while (list1 && list2) {
    gsaptimeline.moveCodeToLine(3);
    gsaptimeline.compareNodes([
      list1.DOMListNodeStatic.firstElementChild,
      list2.DOMListNodeStatic.firstElementChild,
    ]);
    gsaptimeline.moveCodeToLine(4);
    if (list1.val > list2.val) {
      gsaptimeline.moveCodeToLine(7);
      gsaptimeline.moveCodeToLine(8);
      gsaptimeline.popOut(list2StaticNodes);
      gsaptimeline.transformNode(
        list2Nodes,
        pointerXPos.mergedList - pointerXPos.list2
      );
      gsaptimeline.resetNodeComparison([
        list1.DOMListNodeStatic.firstElementChild,
        list2.DOMListNodeStatic.firstElementChild,
      ]);
      // If list 1 is in sorted list position, reset animations of list 1 nodes
      if (list1Nodes.length && pointerXPos.mergedList > 1) {
        gsaptimeline.resetTransformations(list1Nodes);
      }
      gsaptimeline.moveCodeToLine(9);

      const list2PointerXPos = parseInt(
        list2.DOMListNodeParent.getAttribute('data-position') || '0'
      );
      gsaptimeline.movePointer(list2Pointer, list2PointerXPos);
      // Remove first node from array of nodes to be animated
      list2Nodes.shift();
      pointerXPos.list2 += 1;
      cur.next = list2;
      list2.DOMListNodeParent!.style.zIndex = pointerXPos.mergedList.toString();
      list2 = list2.next;
    } else {
      gsaptimeline.moveCodeToLine(4);
      gsaptimeline.moveCodeToLine(5);
      gsaptimeline.popOut(list1StaticNodes);
      gsaptimeline.transformNode(
        list1Nodes,
        pointerXPos.mergedList - pointerXPos.list1
      );
      gsaptimeline.resetNodeComparison([
        list1.DOMListNodeStatic.firstElementChild,
        list2.DOMListNodeStatic.firstElementChild,
      ]);
      if (list2Nodes.length && pointerXPos.mergedList > 1) {
        gsaptimeline.resetTransformations(list2Nodes);
      }
      gsaptimeline.moveCodeToLine(6);

      const list1PointerXPos = parseInt(
        list1.DOMListNodeParent.getAttribute('data-position') || '0'
      );
      gsaptimeline.movePointer(list1Pointer, list1PointerXPos);
      list1Nodes.shift();
      pointerXPos.list1 += 1;
      cur.next = list1;
      list1.DOMListNodeParent!.style.zIndex = pointerXPos.mergedList.toString();
      list1 = list1.next;
    }

    if (!list1) gsaptimeline.fadeOut(list1StaticNodesAll);
    if (!list2) gsaptimeline.fadeOut(list2StaticNodesAll);
    cur = cur.next;
    gsaptimeline.moveCodeToLine(10);
    gsaptimeline.movePointer(mergedListPointer, pointerXPos.mergedList);

    pointerXPos.mergedList += 1;

    if (pointerXPos.mergedList === 2) {
      timeline.to(mergedListNodePointer, {
        opacity: 1,
        duration: 0.2,
      });
    }
  }
  if (list1) {
    gsaptimeline.moveCodeToLine(12);
    gsaptimeline.compareNodes([list1.DOMListNodeStatic.firstElementChild]);
    cur.next = list1;
    list1.DOMListNodeParent!.style.zIndex = pointerXPos.mergedList.toString();
    gsaptimeline.moveCodeToLine(13);
    gsaptimeline.popOut(list1StaticNodes);
    gsaptimeline.transformNode(
      list1Nodes,
      pointerXPos.mergedList - pointerXPos.list1
    );
    gsaptimeline.resetNodeComparison([
      list1.DOMListNodeStatic.firstElementChild,
    ]);
  }
  if (list2) {
    gsaptimeline.moveCodeToLine(14);
    gsaptimeline.compareNodes([list2.DOMListNodeStatic.firstElementChild]);
    cur.next = list2;
    list2.DOMListNodeParent!.style.zIndex = pointerXPos.mergedList.toString();
    gsaptimeline.moveCodeToLine(15);
    gsaptimeline.popOut(list2StaticNodes);
    gsaptimeline.transformNode(
      list2Nodes,
      pointerXPos.mergedList - pointerXPos.list2
    );
    gsaptimeline.resetNodeComparison([
      list2.DOMListNodeStatic.firstElementChild,
    ]);
  }
  // this.sortedList = node.next;
  gsaptimeline.moveCodeToLine(17);
  gsaptimeline.movePointer(mergedListNodePointer, 1);
  return true;
}

const randomize = () => {
  const arr1size = Math.floor(Math.random() * 4) + 1;
  const arr2size = 5 - arr1size;

  const newarr1 = generateArr(arr1size, 1, 9);
  const newarr2 = generateArr(arr2size, 1, 9);

  mergeTwoSortedLists(newarr1, newarr2);
};

document
  .querySelector<HTMLDivElement>('#randomize')!
  .addEventListener('click', randomize);

mergeTwoSortedLists([2, 3, 4], [1, 2]);