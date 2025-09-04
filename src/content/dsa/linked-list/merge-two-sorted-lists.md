---
title: Merge Two Sorted Lists
slug: merge-two-sorted-lists
category: Linked List
description: Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.
---

```python
def mergeTwoLists(l1, l2):
    node = cur = ListNode()

    while l1 and l2:
        if l1.val < l2.val:
            cur.next = l1
            l1 = l1.next
        else:
            cur.next = l2
            l2 = l2.next
        cur = cur.next

    if l1:
        cur.next = l1
    if l2:
        cur.next = l2

    return node.next
```