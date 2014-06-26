var ImageCard = require('./ImageCard');

function getDistance(pos1, pos2) {
  var x = pos2[0] - pos1[0];
  var y = pos2[1] - pos2[1];
  return Math.sqrt(x * x + y * y);
}

var ImageViewer = React.createClass({
  displayName: 'ImageViewer',
  getInitialState: function() {
    return {
      currentIndex: 0,
      offsetX: 0,
      images: [],
      imageAll: this.props.images,
      total: 0 
    };
  },
  getDefaultProps: function() {
    return {
      preload: 2
    };
  },
  componentWillMount: function() {
    this.scroller = new Scroller(this.handleScroll, {
      snapping: true,
      scrollingY: false,
      scrollingComplete: this.handleScrollEnd
    });
  },
  componentDidMount: function() {
    this.setState({
      total: this.state.imageAll.length,
      images: this.state.images.concat(this.state.imageAll.splice(0, this.props.preload))
    });
    this.initScroller();
  },
  handleScroll: function(x, y, zoom) {
    this.setState({
      offsetX: x
    });
  },
  handleScrollEnd: function() {
    var left = this.scroller.getValues().left;
    if (left % this.scroller.__snapWidth == 0) {
      this.setState({
        currentIndex: left / this.scroller.__snapWidth
      });
    }
    if (
           this.state.currentIndex == this.state.images.length - 1
        && this.state.imageAll.length
    ) {
      this.setState({
        images: this.state.images.concat(this.state.imageAll.splice(0, this.props.preload))
      });
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.images.length != this.state.images.length) {
      this.initScroller();
    }
  },
  initScroller: function() {
    var container = this.refs.container.getDOMNode();
    var content = this.refs.content.getDOMNode();
    var scroller = this.scroller;
    scroller.setDimensions(
          container.clientWidth,
          container.clientHeight,
          content.clientWidth,
          content.clientHeight
        );
    scroller.setSnapSize(container.clientWidth, container.clientHeight);
    if ('ontouchstart' in window) {
      container.addEventListener('touchstart', function(e) {
        if (e.target.tagName.match(/textarea|input|select/ig))  return;
        e.preventDefault();
        this.refs['image_' + this.state.currentIndex].doTouchStart();
        if (e.touches.length == 1) {
          this.startPos = [e.touches[0].pageX, e.touches[0].pageY];
          scroller.doTouchStart(e.touches, e.timeStamp);
        } else {
          this.startDelta = Math.abs(getDistance([e.touches[0].pageX, e.touches[0].pageY], [e.touches[1].pageX, e.touches[1].pageY])); 
        }
      }.bind(this), false);
      document.addEventListener('touchmove', function(e) {
        if (e.touches.length == 1) {
          if (this.refs['image_' + this.state.currentIndex].doMove(e.touches[0].pageX - this.startPos[0], e.touches[0].pageY - this.startPos[1])) {
            scroller.doTouchMove(e.touches, e.timeStamp);
          }
        } else {
          var endDelta = Math.abs(getDistance([e.touches[0].pageX, e.touches[0].pageY], [e.touches[1].pageX, e.touches[1].pageY]));
          this.refs['image_' + this.state.currentIndex].doScale(endDelta - this.startDelta); 
        }
      }.bind(this), false);
      document.addEventListener('touchend', function(e) {
        scroller.doTouchEnd(e.timeStamp);
        this.startPos = [0, 0];
        this.startDelta = 0;
      }.bind(this), false);
    } else {
      var mousedown = false;
      container.addEventListener('mousedown', function(e) {
        if (e.target.tagName.match(/textarea|input|select/ig)) {
          return;
        }
        scroller.doTouchStart([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);
        mousedown = true;
      }, false);
      document.addEventListener('mousemove', function(e) {
        scroller.doTouchMove([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);
        mousedown = true;
      }, false);
      document.addEventListener('mouseup', function(e) {
        scroller.doTouchEnd(e.timeStamp);
        mousedown = false;
      }, false);
    }
  },
  render: function() {
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    return React.DOM.div(
        {
          className: 'imageview-container',
          ref: 'container'
        },
        React.DOM.div({className: 'imageview-title'}, (this.state.currentIndex + 1) + ' / ' + this.state.total),
        React.DOM.div(
          {
            className: 'imageview-content',
            ref: 'content',
            style: {
              width: width * this.state.images.length,
              '-webkit-transform': 'translate3d(-' + this.state.offsetX + 'px, 0, 0) scale(1)'
            }
          },
          this.state.images.map(function(e, i) {
            return React.DOM.div({
                className: 'imageview-card',
                key: i,
                style: {
                  width: width
                }
              }, ImageCard({src: e, scope: [0, 0, width, height], ref: 'image_' + i}));
          }.bind(this))
        )
      );
  }
});

module.exports = ImageViewer;
