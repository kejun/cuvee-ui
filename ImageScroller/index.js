/** @jsx React.DOM */
var React               = require('react');
var TouchableArea       = require('./TouchableArea');
var AnimatableContainer = require('react-touch/lib/primitives/AnimatableContainer');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      left: 0
    };
  },
  componentWillMount: function() {
    this.scroller = new Scroller(this.handleScroll, {
      snapping: true,
      scrollingX: true, 
      scrollingY: false
    });
  },
  componentDidMount: function() {
    this.setDimensions();
  },
  setDimensions: function() {
    var nodeWidth = this.getDOMNode().clientWidth;
    var nodeHeight = this.getDOMNode().clientHeight;
    var contentWidth = this.refs.content.getDOMNode().clientWidth;
    var contentHeight = this.refs.content.getDOMNode().clientHeight;
    this.scroller.setDimensions(
      nodeWidth,
      nodeHeight,
      contentWidth,
      contentHeight
    );
    this.scroller.setSnapSize(this.props.snapWidth || nodeWidth, nodeHeight);
  },
  handleScroll: function(left, top) {
    this.setState({
      left: left
    });
  },
  render: function() {
   var containerStyle = {
     overflow: 'hidden'
   };
   var contentStyle = {
     width: this.props.snapWidth * this.props.children.length,
     left: 0,
     bottom: 0
   }; 
   return this.transferPropsTo(
     <TouchableArea scroller={this.scroller} style={containerStyle}>
     <AnimatableContainer
       translate={{x:-this.state.left}}>
     <div className="imageview-content" style={contentStyle} ref="content">
     {this.props.children}
     </div>
     </AnimatableContainer>
     </TouchableArea>
   );
  }
});
