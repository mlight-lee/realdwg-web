import {
  AcGeBox2d,
  AcGeBox3d,
  AcGePoint2d,
  AcGePoint3d,
  AcGeVector2d
} from '@mlightcad/geometry-engine'
import { AcGiRenderer } from '@mlightcad/graphic-interface'
import { AcDbObjectId } from 'base'

import { AcDbEntity } from './AcDbEntity'

export enum AcDbRasterImageClipBoundaryType {
  /**
   * Undefined state
   */
  Invalid = 0,
  /**
   * Rectangle aligned with the image pixel coordinate system
   */
  Rect = 1,
  /**
   * Polygon with points entirely within the image boundary
   */
  Poly = 2
}

/**
 * The enum type to specify display options of one image.
 */
export enum AcDbRasterImageImageDisplayOpt {
  /**
   * Show image (or draw frame only)
   */
  Show = 1,
  /**
   * Show rotates images (or draw frame only)
   */
  ShowUnAligned = 2,
  /**
   * Clip image
   */
  Clip = 4,
  /**
   * Use transparent background for bitonal images (or use opaque background color)
   */
  Transparent = 8
}

/**
 * The AcDbRasterImage entity (or "image entity") works with the AcDbRasterImageDef object (or "image
 * definition object") to implement raster images inside AutoCAD. The relationship between these two
 * classes is much like the relationship between an AutoCAD block definition object and a block insert
 * entity.
 *
 * Two or more image entities can be linked to a single image definition object. Since each image entity
 * has its own clip boundary, this is an efficient way to display different regions of a single raster
 * image at different positions in the drawing.
 */
export class AcDbRasterImage extends AcDbEntity {
  private _brightness: number
  private _contrast: number
  private _fade: number
  private _width: number
  private _height: number
  private _position: AcGePoint3d
  private _rotation: number
  private _scale: AcGeVector2d
  private _clipBoundaryType: AcDbRasterImageClipBoundaryType
  private _clipBoundary: AcGePoint2d[]
  private _imageDefId: AcDbObjectId
  private _isClipped: boolean
  private _isImageShown: boolean
  private _isImageTransparent: boolean
  private _image?: Blob

  /**
   * Construct one instance of this class.
   */
  constructor() {
    super()
    this._brightness = 50
    this._contrast = 50
    this._fade = 0
    this._width = 0
    this._height = 0
    this._position = new AcGePoint3d()
    this._scale = new AcGeVector2d(1, 1)
    this._rotation = 0
    this._clipBoundaryType = AcDbRasterImageClipBoundaryType.Rect
    this._clipBoundary = []
    this._isClipped = false
    this._isImageShown = true
    this._isImageTransparent = false
    this._imageDefId = ''
  }

  /**
   * The current brightness value of the image.
   */
  get brightness() {
    return this._brightness
  }
  set brightness(value: number) {
    this._brightness = value
  }

  /**
   * The current contrast value of the image.
   */
  get contrast() {
    return this._contrast
  }
  set contrast(value: number) {
    this._contrast = value
  }

  /**
   * The current fade value of the image.
   */
  get fade() {
    return this._fade
  }
  set fade(value: number) {
    this._fade = value
  }

  /**
   * The height of the image.
   */
  get height() {
    return this._height
  }
  set height(value: number) {
    this._height = value
  }

  /**
   * The width of the image.
   */
  get width() {
    return this._width
  }
  set width(value: number) {
    this._width = value
  }

  /**
   * The position of the image in wcs.
   */
  get position() {
    return this._position
  }
  set position(value: AcGePoint3d) {
    this._position = value
  }

  /**
   * The rotation of the image.
   */
  get rotation() {
    return this._rotation
  }
  set rotation(value: number) {
    this._rotation = value
  }

  /**
   * The scale of the image.
   */
  get scale() {
    return this._scale
  }
  set scale(value: AcGeVector2d) {
    this._scale.copy(value)
  }

  /**
   * The current clip boundary type.
   */
  get clipBoundaryType() {
    return this._clipBoundaryType
  }
  set clipBoundaryType(value: AcDbRasterImageClipBoundaryType) {
    this._clipBoundaryType = value
  }

  /**
   * An array of clip boundary vertices in image pixel coordinates.
   */
  get clipBoundary() {
    return this._clipBoundary
  }
  set clipBoundary(value: AcGePoint2d[]) {
    this._clipBoundary = []
    this._clipBoundary.push(...value)
  }

  /**
   * The flag whether the image is clipped.
   */
  get isClipped() {
    return this._isClipped
  }
  set isClipped(value: boolean) {
    this._isClipped = value
  }

  /**
   * The flag whether the image is shown.
   */
  get isImageShown() {
    return this._isImageShown
  }
  set isImageShown(value: boolean) {
    this._isImageShown = value
  }

  /**
   * The flag whether the image is transparent.
   */
  get isImageTransparent() {
    return this._isImageTransparent
  }
  set isImageTransparent(value: boolean) {
    this._isImageTransparent = value
  }

  /**
   * The image data of this entity.
   */
  get image() {
    return this._image
  }
  set image(value: Blob | undefined) {
    this._image = value
  }

  /**
   * The object id of an image entity's image definition object.
   */
  get imageDefId() {
    return this._imageDefId
  }
  set imageDefId(value: AcDbObjectId) {
    this._imageDefId = value
  }

  /**
   * The file name of the image.
   */
  get imageFileName() {
    if (this._imageDefId) {
      const imageDef = this.database.dictionaries.imageDefs.getIdAt(
        this._imageDefId
      )
      if (imageDef) {
        return imageDef.sourceFileName
      }
    }
    return ''
  }

  /**
   * @inheritdoc
   */
  get geometricExtents(): AcGeBox3d {
    const extents = new AcGeBox3d()
    extents.min.copy(this._position)
    extents.max.set(
      this._position.x + this._width,
      this._position.y + this._height,
      0
    )
    return extents
  }

  /**
   * @inheritdoc
   */
  subGetGripPoints() {
    return this.boundaryPath()
  }

  /**
   * @inheritdoc
   */
  draw(renderer: AcGiRenderer) {
    const points = this.boundaryPath()
    if (this._image) {
      return renderer.image(this._image, {
        boundary: points,
        roation: this._rotation
      })
    } else {
      return renderer.lines(points, this.lineStyle)
    }
  }

  protected boundaryPath() {
    const points: AcGePoint3d[] = []
    if (this.isClipped && this._clipBoundary.length > 3) {
      const wcsWidth = this._width
      const wcsHeight = this._height

      // The left-bottom corner of the boundary is mapped to the insertion point of the image.
      // So calcuate the translation based on those two points.
      const ocsBox = new AcGeBox2d()
      ocsBox.setFromPoints(this._clipBoundary)
      const translation = new AcGePoint2d()
      translation.setX(this._position.x - ocsBox.min.x * wcsWidth)
      translation.setY(this._position.y - ocsBox.min.y * wcsHeight)

      this._clipBoundary.forEach(point => {
        // Clip boundary vertices are in image pixel coordinates. So we need to convert their coordniates
        // from the image pixel coordinate system to the world coordinate system.
        const x = point.x * wcsWidth + translation.x
        const y = point.y * wcsHeight + translation.y
        points.push(new AcGePoint3d(x, y, this._position.z))
      })
    } else {
      points.push(this._position)
      points.push(this._position.clone().setX(this._position.x + this._width))
      points.push(
        this._position
          .clone()
          .set(
            this._position.x + this._width,
            this._position.y + this._height,
            this._position.z
          )
      )
      points.push(this._position.clone().setY(this._position.y + this._height))

      if (this._rotation > 0) {
        _point1.copy(points[1])
        for (let index = 1; index < 4; index++) {
          _point2.copy(points[index])
          _point2.rotateAround(_point1, this._rotation)
          points[index].setX(_point2.x)
          points[index].setY(_point2.y)
        }
      }
      points.push(points[0])
    }

    return points
  }
}

const _point1 = /*@__PURE__*/ new AcGePoint2d()
const _point2 = /*@__PURE__*/ new AcGePoint2d()
