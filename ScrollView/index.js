/** @jsx React.DOM */
var React               = require('react');
var TouchableArea       = require('react-touch/lib/primitives/TouchableArea');
var AnimatableContainer = require('react-touch/lib/primitives/AnimatableContainer');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      left: 0,
      top: 0
    };
  },
  componentWillMount: function() {
    this.scroller = new Scroller(this.handleScroll, this.props.options || {
      scrollingX: false
    });
  },
  componentDidMount: function() {
    this.setDimensions();
    this.screenWidth = screen.width;
    window.onorientationchange = function() {
      setTimeout(function() {
        if (this.screenWidth == screen.width) {
          return;
        }
        this.screenWidth = screen.width;
        this.setDimensions();
      }.bind(this), 250);
    }.bind(this);
  },
  setDimensions: function() {
    var containerWidth = this.getDOMNode().clientWidth;
    var containerHeight = this.getDOMNode().clientHeight;
    this.scroller.setDimensions(
      containerWidth,
      containerHeight,
      this.refs.content.getDOMNode().clientWidth,
      this.refs.content.getDOMNode().clientHeight
    );
    if (this.props.options && this.props.options.snapping) {
      this.scroller.setSnapSize(
          this.options.snapSizeWidth || containerWidth,
          this.options.snapSizeHeight || containerHeight);
    }
  },
  handleScroll: function(left, top, zoom) {
    this.setState({left: left, top: top});
  },
  render: function() {
    var containerStyle = {
      position:  'absolute',
      top:       0,
      left:      0,
      right:     0,
      bottom:    0
    };
    var animStyle = {
      position:  'absolute',
      top:       0,
      left:      0,
      right:     0,
      bottom:    0
    };
    return this.transferPropsTo(
      <TouchableArea className={this.props.className} scroller={this.scroller} style={containerStyle}>
      <AnimatableContainer
          translate={{x: -this.state.left, y:-this.state.top}}
          style={animStyle}>
      <ul ref="content">
      {this.props.children}
      </ul>
      </AnimatableContainer>
      </TouchableArea>
    );
  }
});
