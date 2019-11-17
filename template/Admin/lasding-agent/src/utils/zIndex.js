export default {
  zIndex: 100,
  nextZIndex () {
    this.zIndex += 2
    return this.zIndex
  }
}
