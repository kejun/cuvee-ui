/** @jsx React.DOM */
var React               = require('react');
var TouchableArea       = require('react-touch/lib/primitives/TouchableArea');
var AnimatableContainer = require('react-touch/lib/primitives/AnimatableContainer');

var touchBehavior = {
  side: {
    translate: function(width, scrollLeft) {
      return {x: parseInt(width, 10) - 0.5 * scrollLeft};
    },
    opacity: function(width, scrollLeft) {
      return 1 - scrollLeft / parseInt(width, 10);
    }
  },
  main: {
    translate: function(width, scrollLeft) {
      return {x: parseInt(width, 10) - scrollLeft};
    }
  }
};

module.exports = React.createClass({
  getInitialState: function() {
    return {
      scrollLeft: 0 
    };
  },
  isClose: function() {
    return this.state.scrollLeft == parseInt(this.props.width, 10);
  },
  toggle: function() {
    if (this.isClose()) {
      this.scroller.scrollTo(0, 0, true);
      return;
    }
    this.closeSide();
  },
  handleScroll: function(left, top) {
    this.setState({
      scrollLeft: left
    });
    if (this.isClose()) {
      this.props.onClose && this.props.onClose();
    } else if (this.state.scrollLeft == 0) {
      this.props.onOpen && this.props.onOpen();
    }
  },
  closeSide: function() {
    this.scroller.scrollTo(this.props.width, 0, true);
  },
  componentWillMount: function() {
    this.scroller = new Scroller(this.handleScroll, {
      bouncing: false,
      scrollingX: true,
      scrollingY: false,
      snapping: true
    });
  },
  componentDidMount: function() {
    this.setDimensions();
  },
  componentDidUpdate: function(prevProps) {
    if (this.props.width != prevProps.width) {
      this.setDimensions();
    }
  },
  setDimensions: function() {
    var viewportWidth = this.getDOMNode().clientWidth;
    var viewportHeight = this.getDOMNode().clientHeight;
    this.scroller.setDimensions(
      viewportWidth,
      viewportHeight,
      viewportWidth + parseInt(this.props.width, 10),
      viewportHeight
    );
    this.scroller.setSnapSize(this.props.width || viewportWidth, viewportHeight);
    this.scroller.scrollTo(this.props.width, 0, false);
  },
  render: function() {
    var sideStyle = {
      position: 'absolute',
      width: this.props.width,
      height: this.props.height,
      left: -this.props.width,
      top: 0,
      bottom: 0
    };
    var mainStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      '-webkit-box-shadow': '0 0 20px rgba(0,0,0,.5)',
      '-webkit-backface-visibility': 'hidden',
      'z-index': 2000
    };
    var maskStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      'z-index': 3000
    };
    var mask;
    if (!this.isClose()) {
      mask = <div style={maskStyle} onTouchTap={this.toggle}/>;
    }
    return (
      <div>
      <AnimatableContainer
        className="offcanvas-side"
        style={sideStyle}
        translate={touchBehavior.side.translate(this.props.width, this.state.scrollLeft)}
        opacity={touchBehavior.side.opacity(this.props.width, this.state.scrollLeft)} >
          {this.props.sideContent}
      </AnimatableContainer>
      <AnimatableContainer
        style={mainStyle}
        translate={touchBehavior.main.translate(this.props.width, this.state.scrollLeft)}>
        <TouchableArea scroller={this.scroller} touchable={!this.isClose()}>
        {this.props.children}
        {mask}
        </TouchableArea>
      </AnimatableContainer>
      </div>
    );
  }
});
