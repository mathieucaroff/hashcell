# Algo CellGet

This recursive algorithm extracts a subcell from a parent cell.

The subcell being extracted is called the **target cell**.

It accepts five parameters:

- `me`, the parent cell
- `divisor`, an integer that is a power of 2 and at is least 2. This specifies a level of division of the time and space inside the parent cell. More specifically, `divisor` is `2 * 2 ** minLevel` where minLevel is the threshold for the level of the parent cell, `me`. Since `divisor` cannot be smaller than 2, the level of the parent cell cannot be smaller than 1 (it can't be 0).
- `widthNum`, the width of the top of target cell, in number of divisors. This must be a power of 2, between 2 and `divisor`.
- `tNum` (or `yNum`), the time position of the target cell, in number of divisions. This is an integer between 0 and `divisor / 4`.
- `xNum`, the spatial position of the target cell. This is an integer between `tNum` and `divisor - widthNum - tNum`. Furthermore we must have `(tNum + xNum) % 2 == 0`.

Note:

- `divisor` cannot be less than 4 because `widthNum` cannot be less than 4, and must be less than `divisor`.
- `widthNum` cannot be less than 4 because `heightNum = widthNum / 4` and heightNum shall be whole.

The algorithm is simple to describe:

- (Check that the input is valid, and throw if it's not)
- Resolve the target cell as:
  - If tNum > 0:
    // Case tNum > 0
    - If tNum > widthNum / 4: // The antecedent is inside of `me`
      - The result of their antecedent
    - Else:
      // The cell is not in my inputs but is too close to the input to be computed as the result their antecedent. We split them first to reduce the distance of the antecedent.
      - The fusion of its two halves
  - Else:
    // Case tNum == 0
    - If widthNum == div:
      - The full cell itself
    - Else if xNum % (2 \* widthNum) == 0:
      - The left part of a bigger cell
    - Else if xNum % (2 \* widthNum) == widthNum:
      - The right part of a bigger cell
    - Else:
      // The cell is not well aligned and needs to be cut until the considered parts are small enough that they are aligned
      - The fusion of its two halves

Each of the above four resolutions can be computed like so:

```ts
// result of antecedent
return me.get(div, widthNum * 2, tNum - widthNum / 4, xNum - width / 4).result()

// fusion of halves
return fuse(
  me.get(div, widthNum / 2, tNum, xNum),
  me.get(div, widthNum / 2, tNum, xNum + widthNum / 2),
)

// the full cell itself
return me

// left part
return me.get(div, widthNum * 2, tNum, xNum).left

// right part
return me.get(div, widthNum * 2, tNum, xNum - widthNum).right
```

## Proof of sanity

(_Proof that if called with valid parameters, any recursive call made by the
algorithm will have valid parameters_)

## Proof of termination

This proof might be tricky because the width of the cell seem to be potentially varying in both directions, getting bigger and smaller. Things get easier when the the algorithm is seen as being made of three steps:

- (1) when tNum > 0
- (2) when tNum == 0 and xNum % width != 0
- (3) when tNum == 0 and xNum % width == 0

We can proove that step (1) will lead to step (2):

- At each step, the recursive call is made on a pair of numbers (tNum, width) that is smaller. `width` has a minimum value and `tNum` has a minimum value too, thus this step of the algorithm cannot run forever (if sane).

The proof of termination of step (2) is a bit trickier, since it's based on the `xNum` alignment of cells, depending on their width.

## Proof of validity

Such a proof is mostly uninteresting compared to writing tests to ensure the validity. I won't do it.
