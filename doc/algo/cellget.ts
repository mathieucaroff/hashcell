/// /// ///
let isPowerOf2 = (value: number) => {
   return value != 0 && (value & (value - 1)) == 0
}
/// /// ///

// cellget
interface Cell {
   left: Cell
   right: Cell
   result: () => Cell
   get: (prop: GetProp) => Cell
}

interface GetProp {
   divisor: number
   widthNum: number
   xNum: number
   tNum: number
}

let fuse = (a: Cell, b: Cell): Cell => {
   return a
}

let createCell = (): Cell => {
   let _getFromResult = (prop: GetProp) => {
      let { divisor, widthNum, xNum, tNum } = prop
      return me
         .get({
            divisor,
            widthNum: widthNum * 2,
            tNum: tNum - widthNum / 4,
            xNum: xNum - widthNum / 4,
         })
         .result()
   }

   let _getFromFusion = (prop: GetProp) => {
      let { divisor, widthNum, xNum, tNum } = prop
      return fuse(
         me.get({
            divisor,
            widthNum: widthNum * 2,
            tNum: tNum - widthNum / 4,
            xNum: xNum - widthNum / 4,
         }),
         me.get({
            divisor,
            widthNum: widthNum * 2,
            tNum: tNum - widthNum / 4,
            xNum: xNum - widthNum / 4,
         }),
      )
   }

   let _getFromLeft = (prop: GetProp) => {
      return me.get({
         ...prop,
         widthNum: prop.widthNum * 2,
      }).left
   }

   let _getFromRight = (prop: GetProp) => {
      return me.get({
         ...prop,
         widthNum: prop.widthNum * 2,
         xNum: prop.xNum + prop.widthNum / 2,
      }).right
   }

   let _check = (prop: GetProp) => {
      let { divisor, widthNum, xNum, tNum } = prop

      if (!isPowerOf2(divisor)) throw new RangeError()

      if (!isPowerOf2(widthNum)) throw new RangeError()

      if (!(widthNum >= 2)) throw new RangeError()

      if (!(widthNum <= divisor)) throw new RangeError()

      if (!(tNum >= 0)) throw new RangeError()

      if (!(4 * tNum <= divisor)) throw new RangeError()

      if (!(xNum >= tNum)) throw new RangeError()

      if (!(xNum <= divisor - widthNum - tNum)) throw new RangeError()

      if (!((xNum + tNum) % 2 == 0)) throw new RangeError()
   }

   let _get = (prop: GetProp) => {
      let { divisor, widthNum, xNum, tNum } = prop

      if (tNum > 0) {
         // Case tNum > 0

         if (tNum > widthNum / 4) {
            // The target cell is small enougth that the antecedent is inside of `me`
            return _getFromResult(prop)
         } else {
            // The cell is not in my inputs but is too close to the input to be computed as the result their antecedent. We split them first to reduce the distance of the antecedent.
            //  The fusion of its two halves
            return _getFromFusion(prop)
         }
      } else {
         // Case tNum == 0

         if (xNum % widthNum != 0) {
            // Case xNum % widthNum != 0
            // i.e. bad alignment

            // The cell is not well aligned and needs to be cut until the targeted parts are small enough that they are aligned
            return _getFromFusion(prop)
         } else {
            if (widthNum == divisor) {
               //  The full cell itself
               return me as Cell
            } else if (xNum % (2 * widthNum) == 0) {
               //  The left part of a bigger cell
               return _getFromLeft(prop)
            } else if (xNum % (2 * widthNum) == widthNum) {
               //  The right part of a bigger cell
               return _getFromRight(prop)
            } else {
               throw new Error()
            }
         }
      }
   }

   let me: Partial<Cell> = {
      get: (prop: GetProp): Cell => {
         _check(prop)
         return _get(prop)
      },
   }

   return me as Cell
}
