import { DEFAULT_TOL } from '../util'
import { AcGeMatrix2d } from './AcGeMatrix2d'
import { AcGeQuaternion } from './AcGeQuaternion'
import { AcGeVector3d, AcGeVector3dLike } from './AcGeVector3d'

/**
 * The class representing a 4x4 matrix.
 */
export class AcGeMatrix3d {
  /**
   * Identity matrix.
   */
  static IDENTITY = Object.freeze(new AcGeMatrix3d())
  /**
   * A column-major list of matrix values.
   */
  public elements: number[]

  /**
   * Create a 4x4 matrix with the given arguments in row-major order. If no arguments are provided,
   * the constructor initializes the Matrix4 to the 4x4 identity matrix.
   *
   * @param n11 Input element in the first row and the first column
   * @param n12 Input element in the first row and the second column
   * @param n13 Input element in the first row and the third column
   * @param n14 Input element in the first row and the forth column
   * @param n21 Input element in the second row and the first column
   * @param n22 Input element in the second row and the second column
   * @param n23 Input element in the second row and the third column
   * @param n24 Input element in the second row and the forth column
   * @param n31 Input element in the third row and the first column
   * @param n32 Input element in the third row and the second column
   * @param n33 Input element in the third row and the third column
   * @param n34 Input element in the third row and the forth column
   * @param n41 Input element in the forth row and the first column
   * @param n42 Input element in the forth row and the second column
   * @param n43 Input element in the forth row and the third column
   * @param n44 Input element in the forth row and the forth column
   */
  constructor(
    n11?: number,
    n12?: number,
    n13?: number,
    n14?: number,
    n21?: number,
    n22?: number,
    n23?: number,
    n24?: number,
    n31?: number,
    n32?: number,
    n33?: number,
    n34?: number,
    n41?: number,
    n42?: number,
    n43?: number,
    n44?: number
  ) {
    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

    if (
      n11 != null &&
      n12 != null &&
      n13 != null &&
      n14 != null &&
      n21 != null &&
      n22 != null &&
      n23 != null &&
      n24 != null &&
      n31 != null &&
      n32 != null &&
      n33 != null &&
      n34 != null &&
      n41 != null &&
      n42 != null &&
      n43 != null &&
      n44 != null
    ) {
      this.set(
        n11,
        n12,
        n13,
        n14,
        n21,
        n22,
        n23,
        n24,
        n31,
        n32,
        n33,
        n34,
        n41,
        n42,
        n43,
        n44
      )
    }
  }

  /**
   * Set the elements of this matrix to the supplied row-major values n11, n12, ... n44.
   *
   * @param n11 Input element in the first row and the first column
   * @param n12 Input element in the first row and the second column
   * @param n13 Input element in the first row and the third column
   * @param n14 Input element in the first row and the forth column
   * @param n21 Input element in the second row and the first column
   * @param n22 Input element in the second row and the second column
   * @param n23 Input element in the second row and the third column
   * @param n24 Input element in the second row and the forth column
   * @param n31 Input element in the third row and the first column
   * @param n32 Input element in the third row and the second column
   * @param n33 Input element in the third row and the third column
   * @param n34 Input element in the third row and the forth column
   * @param n41 Input element in the forth row and the first column
   * @param n42 Input element in the forth row and the second column
   * @param n43 Input element in the forth row and the third column
   * @param n44 Input element in the forth row and the forth column
   * @returns Return this matrix
   */
  set(
    n11: number,
    n12: number,
    n13: number,
    n14: number,
    n21: number,
    n22: number,
    n23: number,
    n24: number,
    n31: number,
    n32: number,
    n33: number,
    n34: number,
    n41: number,
    n42: number,
    n43: number,
    n44: number
  ) {
    const te = this.elements

    te[0] = n11
    te[4] = n12
    te[8] = n13
    te[12] = n14
    te[1] = n21
    te[5] = n22
    te[9] = n23
    te[13] = n24
    te[2] = n31
    te[6] = n32
    te[10] = n33
    te[14] = n34
    te[3] = n41
    te[7] = n42
    te[11] = n43
    te[15] = n44

    return this
  }

  /**
   * Reset this matrix to the identity matrix.
   * @returns Return this matrix
   */
  identity() {
    this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    return this
  }

  clone() {
    return new AcGeMatrix3d().fromArray(this.elements)
  }

  /**
   * Copy the elements of matrix m into this matrix.
   * @param m Input one matrix copied from
   * @returns Return this matrix
   */
  copy(m: AcGeMatrix3d) {
    const te = this.elements
    const me = m.elements

    te[0] = me[0]
    te[1] = me[1]
    te[2] = me[2]
    te[3] = me[3]
    te[4] = me[4]
    te[5] = me[5]
    te[6] = me[6]
    te[7] = me[7]
    te[8] = me[8]
    te[9] = me[9]
    te[10] = me[10]
    te[11] = me[11]
    te[12] = me[12]
    te[13] = me[13]
    te[14] = me[14]
    te[15] = me[15]

    return this
  }

  /**
   * Copy the translation component of the supplied matrix m into this matrix's translation component.
   * @param m Input the matrix copied from
   * @returns Return this matrix
   */
  copyPosition(m: AcGeMatrix3d) {
    const te = this.elements,
      me = m.elements

    te[12] = me[12]
    te[13] = me[13]
    te[14] = me[14]

    return this
  }

  /**
   * Set the upper 3x3 elements of this matrix to the values of the 3x3 matrix m.
   * @param m Input one 3x3 matrix
   * @returns Return this matrix
   */
  setFromMatrix3(m: AcGeMatrix2d) {
    const me = m.elements

    this.set(
      me[0],
      me[3],
      me[6],
      0,
      me[1],
      me[4],
      me[7],
      0,
      me[2],
      me[5],
      me[8],
      0,
      0,
      0,
      0,
      1
    )

    return this
  }

  /**
   * Create transform matrix according to the given the normalized extrusion vector
   * @param extrusion Input the normalized extrusion vector
   * @returns Return this matrix
   */
  setFromExtrusionDirection(extrusion: AcGeVector3d) {
    if (!DEFAULT_TOL.equalPoint3d(extrusion, AcGeVector3d.Z_AXIS)) {
      const xAxis = new AcGeVector3d(1, 0, 0)
      if (
        Math.abs(extrusion.x) < 1.0 / 64.0 &&
        Math.abs(extrusion.y) < 1.0 / 64.0
      ) {
        xAxis.crossVectors(AcGeVector3d.Y_AXIS, extrusion).normalize()
      } else {
        xAxis.crossVectors(AcGeVector3d.Z_AXIS, extrusion).normalize()
      }
      const yAxis = extrusion.clone().cross(xAxis).normalize()
      this.set(
        xAxis.x,
        xAxis.y,
        xAxis.z,
        0,
        yAxis.x,
        yAxis.y,
        yAxis.z,
        0,
        extrusion.x,
        extrusion.y,
        extrusion.z,
        0,
        0,
        0,
        0,
        1
      )
    } else {
      this.identity()
    }
    return this
  }

  /**
   * Extracts the basis of this matrix into the three axis vectors provided.
   * @param xAxis Input X axis vector
   * @param yAxis Input Y axis vector
   * @param zAxis Input Z axis vector
   * @returns Return this matrix
   */
  extractBasis(xAxis: AcGeVector3d, yAxis: AcGeVector3d, zAxis: AcGeVector3d) {
    xAxis.setFromMatrixColumn(this, 0)
    yAxis.setFromMatrixColumn(this, 1)
    zAxis.setFromMatrixColumn(this, 2)

    return this
  }

  /**
   * Set this to the basis matrix consisting of the three provided basis vectors:
   * @param xAxis Input X axis vector
   * @param yAxis Input Y axis vector
   * @param zAxis Input Z axis vector
   * @returns Return this matrix
   */
  makeBasis(
    xAxis: AcGeVector3dLike,
    yAxis: AcGeVector3dLike,
    zAxis: AcGeVector3dLike
  ) {
    this.set(
      xAxis.x,
      yAxis.x,
      zAxis.x,
      0,
      xAxis.y,
      yAxis.y,
      zAxis.y,
      0,
      xAxis.z,
      yAxis.z,
      zAxis.z,
      0,
      0,
      0,
      0,
      1
    )

    return this
  }

  /**
   * Extracts the rotation component of the supplied matrix m into this matrix's rotation component.
   * @param m Input one 4x4 matrix
   * @returns Return this matrix
   */
  extractRotation(m: AcGeMatrix3d) {
    // this method does not support reflection matrices

    const te = this.elements
    const me = m.elements

    const scaleX = 1 / _v1.setFromMatrixColumn(m, 0).length()
    const scaleY = 1 / _v1.setFromMatrixColumn(m, 1).length()
    const scaleZ = 1 / _v1.setFromMatrixColumn(m, 2).length()

    te[0] = me[0] * scaleX
    te[1] = me[1] * scaleX
    te[2] = me[2] * scaleX
    te[3] = 0

    te[4] = me[4] * scaleY
    te[5] = me[5] * scaleY
    te[6] = me[6] * scaleY
    te[7] = 0

    te[8] = me[8] * scaleZ
    te[9] = me[9] * scaleZ
    te[10] = me[10] * scaleZ
    te[11] = 0

    te[12] = 0
    te[13] = 0
    te[14] = 0
    te[15] = 1

    return this
  }

  // makeRotationFromEuler(euler) {
  //   const te = this.elements

  //   const x = euler.x,
  //     y = euler.y,
  //     z = euler.z
  //   const a = Math.cos(x),
  //     b = Math.sin(x)
  //   const c = Math.cos(y),
  //     d = Math.sin(y)
  //   const e = Math.cos(z),
  //     f = Math.sin(z)

  //   if (euler.order === 'XYZ') {
  //     const ae = a * e,
  //       af = a * f,
  //       be = b * e,
  //       bf = b * f

  //     te[0] = c * e
  //     te[4] = -c * f
  //     te[8] = d

  //     te[1] = af + be * d
  //     te[5] = ae - bf * d
  //     te[9] = -b * c

  //     te[2] = bf - ae * d
  //     te[6] = be + af * d
  //     te[10] = a * c
  //   } else if (euler.order === 'YXZ') {
  //     const ce = c * e,
  //       cf = c * f,
  //       de = d * e,
  //       df = d * f

  //     te[0] = ce + df * b
  //     te[4] = de * b - cf
  //     te[8] = a * d

  //     te[1] = a * f
  //     te[5] = a * e
  //     te[9] = -b

  //     te[2] = cf * b - de
  //     te[6] = df + ce * b
  //     te[10] = a * c
  //   } else if (euler.order === 'ZXY') {
  //     const ce = c * e,
  //       cf = c * f,
  //       de = d * e,
  //       df = d * f

  //     te[0] = ce - df * b
  //     te[4] = -a * f
  //     te[8] = de + cf * b

  //     te[1] = cf + de * b
  //     te[5] = a * e
  //     te[9] = df - ce * b

  //     te[2] = -a * d
  //     te[6] = b
  //     te[10] = a * c
  //   } else if (euler.order === 'ZYX') {
  //     const ae = a * e,
  //       af = a * f,
  //       be = b * e,
  //       bf = b * f

  //     te[0] = c * e
  //     te[4] = be * d - af
  //     te[8] = ae * d + bf

  //     te[1] = c * f
  //     te[5] = bf * d + ae
  //     te[9] = af * d - be

  //     te[2] = -d
  //     te[6] = b * c
  //     te[10] = a * c
  //   } else if (euler.order === 'YZX') {
  //     const ac = a * c,
  //       ad = a * d,
  //       bc = b * c,
  //       bd = b * d

  //     te[0] = c * e
  //     te[4] = bd - ac * f
  //     te[8] = bc * f + ad

  //     te[1] = f
  //     te[5] = a * e
  //     te[9] = -b * e

  //     te[2] = -d * e
  //     te[6] = ad * f + bc
  //     te[10] = ac - bd * f
  //   } else if (euler.order === 'XZY') {
  //     const ac = a * c,
  //       ad = a * d,
  //       bc = b * c,
  //       bd = b * d

  //     te[0] = c * e
  //     te[4] = -f
  //     te[8] = d * e

  //     te[1] = ac * f + bd
  //     te[5] = a * e
  //     te[9] = ad * f - bc

  //     te[2] = bc * f - ad
  //     te[6] = b * e
  //     te[10] = bd * f + ac
  //   }

  //   // bottom row
  //   te[3] = 0
  //   te[7] = 0
  //   te[11] = 0

  //   // last column
  //   te[12] = 0
  //   te[13] = 0
  //   te[14] = 0
  //   te[15] = 1

  //   return this
  // }

  /**
   * Set the rotation component of this matrix to the rotation specified by q
   * @param q Input one uaternion
   * @returns Return this matrix
   */
  makeRotationFromQuaternion(q: AcGeQuaternion) {
    return this.compose(_zero, q, _one)
  }

  /**
   * Construct a rotation matrix, looking from eye towards target oriented by the up vector.
   * @param eye Input eye vector
   * @param target Input target vector
   * @param up Input up vector
   * @returns Return this matrix
   */
  lookAt(eye: AcGeVector3d, target: AcGeVector3d, up: AcGeVector3d) {
    const te = this.elements

    _z.subVectors(eye, target)

    if (_z.lengthSq() === 0) {
      // eye and target are in the same position

      _z.z = 1
    }

    _z.normalize()
    _x.crossVectors(up, _z)

    if (_x.lengthSq() === 0) {
      // up and z are parallel

      if (Math.abs(up.z) === 1) {
        _z.x += 0.0001
      } else {
        _z.z += 0.0001
      }

      _z.normalize()
      _x.crossVectors(up, _z)
    }

    _x.normalize()
    _y.crossVectors(_z, _x)

    te[0] = _x.x
    te[4] = _y.x
    te[8] = _z.x
    te[1] = _x.y
    te[5] = _y.y
    te[9] = _z.y
    te[2] = _x.z
    te[6] = _y.z
    te[10] = _z.z

    return this
  }

  /**
   * Post-multiply this matrix by m.
   * @param m Input one 4x4 matrix
   * @returns Return this matrix
   */
  multiply(m: AcGeMatrix3d) {
    return this.multiplyMatrices(this, m)
  }

  /**
   * Pre-multiply this matrix by m.
   * @param m Input one 4x4 matrix
   * @returns Return this matrix
   */
  premultiply(m: AcGeMatrix3d) {
    return this.multiplyMatrices(m, this)
  }

  /**
   * Set this matrix to a x b.
   * @param a Input one 4x4 matrix
   * @param b Input one 4x4 matrix
   * @returns Return this matrix
   */
  multiplyMatrices(a: AcGeMatrix3d, b: AcGeMatrix3d) {
    const ae = a.elements
    const be = b.elements
    const te = this.elements

    const a11 = ae[0],
      a12 = ae[4],
      a13 = ae[8],
      a14 = ae[12]
    const a21 = ae[1],
      a22 = ae[5],
      a23 = ae[9],
      a24 = ae[13]
    const a31 = ae[2],
      a32 = ae[6],
      a33 = ae[10],
      a34 = ae[14]
    const a41 = ae[3],
      a42 = ae[7],
      a43 = ae[11],
      a44 = ae[15]

    const b11 = be[0],
      b12 = be[4],
      b13 = be[8],
      b14 = be[12]
    const b21 = be[1],
      b22 = be[5],
      b23 = be[9],
      b24 = be[13]
    const b31 = be[2],
      b32 = be[6],
      b33 = be[10],
      b34 = be[14]
    const b41 = be[3],
      b42 = be[7],
      b43 = be[11],
      b44 = be[15]

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44

    return this
  }

  /**
   * Multiply every component of the matrix by a scalar value s.
   * @param s Input one scalar value
   * @returns Return this matrix
   */
  multiplyScalar(s: number) {
    const te = this.elements

    te[0] *= s
    te[4] *= s
    te[8] *= s
    te[12] *= s
    te[1] *= s
    te[5] *= s
    te[9] *= s
    te[13] *= s
    te[2] *= s
    te[6] *= s
    te[10] *= s
    te[14] *= s
    te[3] *= s
    te[7] *= s
    te[11] *= s
    te[15] *= s

    return this
  }

  /**
   * Compute and return the determinant of this matrix.
   * @returns Return the determinant of this matrix.
   */
  determinant() {
    const te = this.elements

    const n11 = te[0],
      n12 = te[4],
      n13 = te[8],
      n14 = te[12]
    const n21 = te[1],
      n22 = te[5],
      n23 = te[9],
      n24 = te[13]
    const n31 = te[2],
      n32 = te[6],
      n33 = te[10],
      n34 = te[14]
    const n41 = te[3],
      n42 = te[7],
      n43 = te[11],
      n44 = te[15]

    //TODO: make this more efficient
    //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

    return (
      n41 *
        (+n14 * n23 * n32 -
          n13 * n24 * n32 -
          n14 * n22 * n33 +
          n12 * n24 * n33 +
          n13 * n22 * n34 -
          n12 * n23 * n34) +
      n42 *
        (+n11 * n23 * n34 -
          n11 * n24 * n33 +
          n14 * n21 * n33 -
          n13 * n21 * n34 +
          n13 * n24 * n31 -
          n14 * n23 * n31) +
      n43 *
        (+n11 * n24 * n32 -
          n11 * n22 * n34 -
          n14 * n21 * n32 +
          n12 * n21 * n34 +
          n14 * n22 * n31 -
          n12 * n24 * n31) +
      n44 *
        (-n13 * n22 * n31 -
          n11 * n23 * n32 +
          n11 * n22 * n33 +
          n13 * n21 * n32 -
          n12 * n21 * n33 +
          n12 * n23 * n31)
    )
  }

  /**
   * Transposes this matrix.
   * @returns Return this matrix
   */
  transpose() {
    const te = this.elements
    let tmp

    tmp = te[1]
    te[1] = te[4]
    te[4] = tmp
    tmp = te[2]
    te[2] = te[8]
    te[8] = tmp
    tmp = te[6]
    te[6] = te[9]
    te[9] = tmp

    tmp = te[3]
    te[3] = te[12]
    te[12] = tmp
    tmp = te[7]
    te[7] = te[13]
    te[13] = tmp
    tmp = te[11]
    te[11] = te[14]
    te[14] = tmp

    return this
  }

  /**
   * Set the position component for this matrix from vector v, without affecting the rest of the matrix.
   * @param x Input one number or one vector
   * @param y Input one number
   * @param z Input one number
   * @returns Return this matrix
   */
  setPosition(x: number | AcGeVector3d, y: number, z: number) {
    const te = this.elements

    if (x instanceof AcGeVector3d) {
      te[12] = x.x
      te[13] = x.y
      te[14] = x.z
    } else {
      te[12] = x
      te[13] = y
      te[14] = z
    }

    return this
  }

  /**
   * Invert this matrix, using the analytic method. You can not invert with a determinant of zero.
   * If you attempt this, the method produces a zero matrix instead.
   * @returns Return this matrix
   */
  invert() {
    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const te = this.elements,
      n11 = te[0],
      n21 = te[1],
      n31 = te[2],
      n41 = te[3],
      n12 = te[4],
      n22 = te[5],
      n32 = te[6],
      n42 = te[7],
      n13 = te[8],
      n23 = te[9],
      n33 = te[10],
      n43 = te[11],
      n14 = te[12],
      n24 = te[13],
      n34 = te[14],
      n44 = te[15],
      t11 =
        n23 * n34 * n42 -
        n24 * n33 * n42 +
        n24 * n32 * n43 -
        n22 * n34 * n43 -
        n23 * n32 * n44 +
        n22 * n33 * n44,
      t12 =
        n14 * n33 * n42 -
        n13 * n34 * n42 -
        n14 * n32 * n43 +
        n12 * n34 * n43 +
        n13 * n32 * n44 -
        n12 * n33 * n44,
      t13 =
        n13 * n24 * n42 -
        n14 * n23 * n42 +
        n14 * n22 * n43 -
        n12 * n24 * n43 -
        n13 * n22 * n44 +
        n12 * n23 * n44,
      t14 =
        n14 * n23 * n32 -
        n13 * n24 * n32 -
        n14 * n22 * n33 +
        n12 * n24 * n33 +
        n13 * n22 * n34 -
        n12 * n23 * n34

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14

    if (det === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)

    const detInv = 1 / det

    te[0] = t11 * detInv
    te[1] =
      (n24 * n33 * n41 -
        n23 * n34 * n41 -
        n24 * n31 * n43 +
        n21 * n34 * n43 +
        n23 * n31 * n44 -
        n21 * n33 * n44) *
      detInv
    te[2] =
      (n22 * n34 * n41 -
        n24 * n32 * n41 +
        n24 * n31 * n42 -
        n21 * n34 * n42 -
        n22 * n31 * n44 +
        n21 * n32 * n44) *
      detInv
    te[3] =
      (n23 * n32 * n41 -
        n22 * n33 * n41 -
        n23 * n31 * n42 +
        n21 * n33 * n42 +
        n22 * n31 * n43 -
        n21 * n32 * n43) *
      detInv

    te[4] = t12 * detInv
    te[5] =
      (n13 * n34 * n41 -
        n14 * n33 * n41 +
        n14 * n31 * n43 -
        n11 * n34 * n43 -
        n13 * n31 * n44 +
        n11 * n33 * n44) *
      detInv
    te[6] =
      (n14 * n32 * n41 -
        n12 * n34 * n41 -
        n14 * n31 * n42 +
        n11 * n34 * n42 +
        n12 * n31 * n44 -
        n11 * n32 * n44) *
      detInv
    te[7] =
      (n12 * n33 * n41 -
        n13 * n32 * n41 +
        n13 * n31 * n42 -
        n11 * n33 * n42 -
        n12 * n31 * n43 +
        n11 * n32 * n43) *
      detInv

    te[8] = t13 * detInv
    te[9] =
      (n14 * n23 * n41 -
        n13 * n24 * n41 -
        n14 * n21 * n43 +
        n11 * n24 * n43 +
        n13 * n21 * n44 -
        n11 * n23 * n44) *
      detInv
    te[10] =
      (n12 * n24 * n41 -
        n14 * n22 * n41 +
        n14 * n21 * n42 -
        n11 * n24 * n42 -
        n12 * n21 * n44 +
        n11 * n22 * n44) *
      detInv
    te[11] =
      (n13 * n22 * n41 -
        n12 * n23 * n41 -
        n13 * n21 * n42 +
        n11 * n23 * n42 +
        n12 * n21 * n43 -
        n11 * n22 * n43) *
      detInv

    te[12] = t14 * detInv
    te[13] =
      (n13 * n24 * n31 -
        n14 * n23 * n31 +
        n14 * n21 * n33 -
        n11 * n24 * n33 -
        n13 * n21 * n34 +
        n11 * n23 * n34) *
      detInv
    te[14] =
      (n14 * n22 * n31 -
        n12 * n24 * n31 -
        n14 * n21 * n32 +
        n11 * n24 * n32 +
        n12 * n21 * n34 -
        n11 * n22 * n34) *
      detInv
    te[15] =
      (n12 * n23 * n31 -
        n13 * n22 * n31 +
        n13 * n21 * n32 -
        n11 * n23 * n32 -
        n12 * n21 * n33 +
        n11 * n22 * n33) *
      detInv

    return this
  }

  /**
   * Multiply the columns of this matrix by vector v.
   * @param v Input one vector
   * @returns Return this matrix
   */
  scale(v: AcGeVector3d) {
    const te = this.elements
    const x = v.x,
      y = v.y,
      z = v.z

    te[0] *= x
    te[4] *= y
    te[8] *= z
    te[1] *= x
    te[5] *= y
    te[9] *= z
    te[2] *= x
    te[6] *= y
    te[10] *= z
    te[3] *= x
    te[7] *= y
    te[11] *= z

    return this
  }

  /**
   * Get the maximum scale value of the 3 axes.
   * @returns Return the maximum scale value of the 3 axes.
   */
  getMaxScaleOnAxis() {
    const te = this.elements

    const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2]
    const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6]
    const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10]

    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq))
  }

  /**
   * Set this matrix as a translation transform from vector v, or numbers x, y and z.
   * @param x Input one vector or one number
   * @param y Input one number
   * @param z Input one number
   * @returns Return this matrix
   */
  makeTranslation(x: number | AcGeVector3d, y?: number, z?: number) {
    if (x instanceof AcGeVector3d) {
      this.set(1, 0, 0, x.x, 0, 1, 0, x.y, 0, 0, 1, x.z, 0, 0, 0, 1)
    } else {
      this.set(1, 0, 0, x, 0, 1, 0, y!, 0, 0, 1, z!, 0, 0, 0, 1)
    }

    return this
  }

  /**
   * Set this matrix as a rotational transformation around the X axis by theta (θ) radians.
   * @param theta Input rotation angle in radians.
   * @returns Return this matrix
   */
  makeRotationX(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta)

    this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1)

    return this
  }

  /**
   * Set this matrix as a rotational transformation around the Y axis by theta (θ) radians.
   * @param theta Input rotation angle in radians.
   * @returns Return this matrix
   */
  makeRotationY(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta)

    this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1)

    return this
  }

  /**
   * Set this matrix as a rotational transformation around the Z axis by theta (θ) radians.
   * @param theta Input rotation angle in radians.
   * @returns Return this matrix
   */
  makeRotationZ(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta)

    this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)

    return this
  }

  /**
   * Set this matrix as rotation transform around axis by theta radians.
   * @param axis Input rotation axis, should be normalized.
   * @param angle Input rotation angle in radians.
   * @returns Return this matrix
   */
  makeRotationAxis(axis: AcGeVector3d, angle: number) {
    // Based on http://www.gamedev.net/reference/articles/article1199.asp

    const c = Math.cos(angle)
    const s = Math.sin(angle)
    const t = 1 - c
    const x = axis.x,
      y = axis.y,
      z = axis.z
    const tx = t * x,
      ty = t * y

    this.set(
      tx * x + c,
      tx * y - s * z,
      tx * z + s * y,
      0,
      tx * y + s * z,
      ty * y + c,
      ty * z - s * x,
      0,
      tx * z - s * y,
      ty * z + s * x,
      t * z * z + c,
      0,
      0,
      0,
      0,
      1
    )

    return this
  }

  /**
   * Set this matrix as scale transform.
   * @param x Input x scale
   * @param y Input y scale
   * @param z Input z scale
   * @returns Return this matrix
   */
  makeScale(x: number, y: number, z: number) {
    this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1)

    return this
  }

  /**
   * Set this matrix as a shear transform.
   * @param xy Input the amount to shear X by Y.
   * @param xz Input the amount to shear X by Z.
   * @param yx Input the amount to shear Y by X.
   * @param yz Input the amount to shear Y by Z.
   * @param zx Input the amount to shear Z by X.
   * @param zy Input the amount to shear Z by Y.
   * @returns Return this matrix
   */
  makeShear(
    xy: number,
    xz: number,
    yx: number,
    yz: number,
    zx: number,
    zy: number
  ) {
    this.set(1, yx, zx, 0, xy, 1, zy, 0, xz, yz, 1, 0, 0, 0, 0, 1)

    return this
  }

  /**
   * Set this matrix to the transformation composed of position, quaternion and scale.
   * @param position Input position
   * @param quaternion Input quaternion
   * @param scale Input scale
   * @returns Return this matrix
   */
  compose(
    position: AcGeVector3d,
    quaternion: AcGeQuaternion,
    scale: AcGeVector3d
  ) {
    const te = this.elements

    const x = quaternion.x,
      y = quaternion.y,
      z = quaternion.z,
      w = quaternion.w
    const x2 = x + x,
      y2 = y + y,
      z2 = z + z
    const xx = x * x2,
      xy = x * y2,
      xz = x * z2
    const yy = y * y2,
      yz = y * z2,
      zz = z * z2
    const wx = w * x2,
      wy = w * y2,
      wz = w * z2

    const sx = scale.x,
      sy = scale.y,
      sz = scale.z

    te[0] = (1 - (yy + zz)) * sx
    te[1] = (xy + wz) * sx
    te[2] = (xz - wy) * sx
    te[3] = 0

    te[4] = (xy - wz) * sy
    te[5] = (1 - (xx + zz)) * sy
    te[6] = (yz + wx) * sy
    te[7] = 0

    te[8] = (xz + wy) * sz
    te[9] = (yz - wx) * sz
    te[10] = (1 - (xx + yy)) * sz
    te[11] = 0

    te[12] = position.x
    te[13] = position.y
    te[14] = position.z
    te[15] = 1

    return this
  }

  /**
   * Decompose this matrix into its position, quaternion and scale components.
   *
   * Note: Not all matrices are decomposable in this way. For example, if an object has a non-uniformly
   * scaled parent, then the object's world matrix may not be decomposable, and this method may not be
   * appropriate.
   * @param position Input position to output
   * @param quaternion Input quaternion to output
   * @param scale Input scale to output
   * @returns Return this matrix
   */
  decompose(
    position: AcGeVector3d,
    quaternion: AcGeQuaternion,
    scale: AcGeVector3d
  ) {
    const te = this.elements

    let sx = _v1.set(te[0], te[1], te[2]).length()
    const sy = _v1.set(te[4], te[5], te[6]).length()
    const sz = _v1.set(te[8], te[9], te[10]).length()

    // if determine is negative, we need to invert one scale
    const det = this.determinant()
    if (det < 0) sx = -sx

    position.x = te[12]
    position.y = te[13]
    position.z = te[14]

    // scale the rotation part
    _m1.copy(this)

    const invSX = 1 / sx
    const invSY = 1 / sy
    const invSZ = 1 / sz

    _m1.elements[0] *= invSX
    _m1.elements[1] *= invSX
    _m1.elements[2] *= invSX

    _m1.elements[4] *= invSY
    _m1.elements[5] *= invSY
    _m1.elements[6] *= invSY

    _m1.elements[8] *= invSZ
    _m1.elements[9] *= invSZ
    _m1.elements[10] *= invSZ

    quaternion.setFromRotationMatrix(_m1)

    scale.x = sx
    scale.y = sy
    scale.z = sz

    return this
  }

  // makePerspective(
  //   left,
  //   right,
  //   top,
  //   bottom,
  //   near,
  //   far,
  //   coordinateSystem = WebGLCoordinateSystem
  // ) {
  //   const te = this.elements
  //   const x = (2 * near) / (right - left)
  //   const y = (2 * near) / (top - bottom)

  //   const a = (right + left) / (right - left)
  //   const b = (top + bottom) / (top - bottom)

  //   let c, d

  //   if (coordinateSystem === WebGLCoordinateSystem) {
  //     c = -(far + near) / (far - near)
  //     d = (-2 * far * near) / (far - near)
  //   } else if (coordinateSystem === WebGPUCoordinateSystem) {
  //     c = -far / (far - near)
  //     d = (-far * near) / (far - near)
  //   } else {
  //     throw new Error(
  //       'THREE.Matrix4.makePerspective(): Invalid coordinate system: ' +
  //         coordinateSystem
  //     )
  //   }

  //   te[0] = x
  //   te[4] = 0
  //   te[8] = a
  //   te[12] = 0
  //   te[1] = 0
  //   te[5] = y
  //   te[9] = b
  //   te[13] = 0
  //   te[2] = 0
  //   te[6] = 0
  //   te[10] = c
  //   te[14] = d
  //   te[3] = 0
  //   te[7] = 0
  //   te[11] = -1
  //   te[15] = 0

  //   return this
  // }

  // makeOrthographic(
  //   left,
  //   right,
  //   top,
  //   bottom,
  //   near,
  //   far,
  //   coordinateSystem = WebGLCoordinateSystem
  // ) {
  //   const te = this.elements
  //   const w = 1.0 / (right - left)
  //   const h = 1.0 / (top - bottom)
  //   const p = 1.0 / (far - near)

  //   const x = (right + left) * w
  //   const y = (top + bottom) * h

  //   let z, zInv

  //   if (coordinateSystem === WebGLCoordinateSystem) {
  //     z = (far + near) * p
  //     zInv = -2 * p
  //   } else if (coordinateSystem === WebGPUCoordinateSystem) {
  //     z = near * p
  //     zInv = -1 * p
  //   } else {
  //     throw new Error(
  //       'THREE.Matrix4.makeOrthographic(): Invalid coordinate system: ' +
  //         coordinateSystem
  //     )
  //   }

  //   te[0] = 2 * w
  //   te[4] = 0
  //   te[8] = 0
  //   te[12] = -x
  //   te[1] = 0
  //   te[5] = 2 * h
  //   te[9] = 0
  //   te[13] = -y
  //   te[2] = 0
  //   te[6] = 0
  //   te[10] = zInv
  //   te[14] = -z
  //   te[3] = 0
  //   te[7] = 0
  //   te[11] = 0
  //   te[15] = 1

  //   return this
  // }

  /**
   * Return true if this matrix and m are equal.
   * @param matrix Input one matrix to compare
   * @returns Return true if this matrix and m are equal.
   */
  equals(matrix: AcGeMatrix3d) {
    const te = this.elements
    const me = matrix.elements

    for (let i = 0; i < 16; i++) {
      if (te[i] !== me[i]) return false
    }

    return true
  }

  /**
   * Set the elements of this matrix based on an array in column-major format.
   * @param array Input the array to read the elements from.
   * @param offset Input (optional) offset into the array. Default is 0.
   * @returns
   */
  fromArray(array: number[], offset = 0) {
    for (let i = 0; i < 16; i++) {
      this.elements[i] = array[i + offset]
    }

    return this
  }

  /**
   * Write the elements of this matrix to an array in column-major format.
   * @param array Input (optional) array to store the resulting vector in.
   * @param offset Input (optional) offset in the array at which to put the result.
   * @returns Return an array in column-major format by writing the elements of this matrix to it
   */
  toArray(array: number[] = [], offset: number = 0) {
    const te = this.elements

    array[offset] = te[0]
    array[offset + 1] = te[1]
    array[offset + 2] = te[2]
    array[offset + 3] = te[3]

    array[offset + 4] = te[4]
    array[offset + 5] = te[5]
    array[offset + 6] = te[6]
    array[offset + 7] = te[7]

    array[offset + 8] = te[8]
    array[offset + 9] = te[9]
    array[offset + 10] = te[10]
    array[offset + 11] = te[11]

    array[offset + 12] = te[12]
    array[offset + 13] = te[13]
    array[offset + 14] = te[14]
    array[offset + 15] = te[15]

    return array
  }
}

const _v1 = /*@__PURE__*/ new AcGeVector3d()
const _m1 = /*@__PURE__*/ new AcGeMatrix3d()
const _zero = /*@__PURE__*/ new AcGeVector3d(0, 0, 0)
const _one = /*@__PURE__*/ new AcGeVector3d(1, 1, 1)
const _x = /*@__PURE__*/ new AcGeVector3d()
const _y = /*@__PURE__*/ new AcGeVector3d()
const _z = /*@__PURE__*/ new AcGeVector3d()
