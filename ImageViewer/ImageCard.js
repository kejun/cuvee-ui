var ImageCard = React.createClass({
  displayName: 'ImageCard',
  getInitialState: function() {
    return {
      x: 0,
      y: 0,
      scale: 1,
    }
  },
  load: function() {
    var img = new Image;
    img.onload = function(e) {
      this.originWidth = e.target.width;
      this.originHeight = e.target.height;
      this.width = this.getDOMNode().clientWidth;
      this.height = this.getDOMNode().clientHeight;
    }.bind(this);
    img.src = this.props.src;
  },
  doTouchStart: function() {
    this.startX = this.state.x;
    this.startY = this.state.y;
    this.scale = this.state.scale;
  },
  doScale: function(delta) {
    if (this.originWidth < this.props.scope[2] && this.originHeight < this.props.scope[3]) {
      return;
    }
    var scale = Math.max(this.scale + delta / (this.props.scope[2] / 5), 1);
    scale = Math.min(scale, this.originWidth / this.props.scope[2]);
    var x = this.state.x;
    var y = this.state.y;
    var width = this.width * scale;
    var height = this.height * scale;
    var boundingOffsetX = width / 2 - (this.props.scope[2] / 2 + Math.abs(x)); 
    var boundingOffsetY = height / 2 - (this.props.scope[3] / 2 + Math.abs(y));
    if (boundingOffsetX <= 0) {
      x = x > 0 ? x + boundingOffsetX : x - boundingOffsetX;
    }
    if (boundingOffsetY <= 0 && height > this.props.scope[3]) {
      y = y > 0 ? y + boundingOffsetY : y - boundingOffsetY;
    } else if (height <= this.props.scope[3]) {
      y = 0;
    }
    this.setState({
      x: x,
      y: y,
      scale: scale 
    });
  },
  doMove: function(deltaX, deltaY) {
    var width = this.width * this.state.scale;
    var height = this.height * this.state.scale;
    var x = this.startX + deltaX;
    var y = this.startY + deltaY;
    if( width <= this.props.scope[2] && height <= this.props.scope[3] ) {
     return true;
    }
    var offsetX = Math.min(Math.abs(width / 2 - this.props.scope[2] / 2), Math.abs(x));
    var offsetY = Math.min(Math.abs(height / 2 - this.props.scope[3] / 2), Math.abs(y));
    x = x > 0 ? offsetX : -offsetX;
    y = y > 0 ? offsetY : -offsetY;
    this.setState({
      x: x,
      y: y
    });
    return false;
  },
  render: function() {
    var style = {
      '-webkit-transform': 'translate3d(' + this.state.x + 'px, ' + this.state.y + 'px,0) scale(' + this.state.scale + ')'
    }
    return React.DOM.img({
      src: this.props.src,
      style: style,
      onLoad: this.load
    });
  }
});

module.exports = ImageCard;
