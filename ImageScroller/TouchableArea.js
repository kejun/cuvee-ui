/** @jsx React.DOM */

var React = require('react');

var getAngle = function(startPos, endPos) {
  var x = endPos[0] - startPos[0];
  var y = endPos[1] - startPos[1];
  return Math.atan2(y, x) * 180 / Math.PI;
};

var getDirectionFromAngle = function(angle) {
  var directions = {
    up:    angle < -45 && angle > -135,
    down:  angle > 45 && angle < 135,
    right: angle >= -45 && angle <= 45,
    left:  angle >= 135 || angle <= -135
  };
  var direction, key;
  for (key in directions) {
    if (directions.hasOwnProperty(key) && directions[key]) {
      direction = key;
      break;
    }
  }
  return direction;
};

var TouchableArea = React.createClass({displayName: 'TouchableArea',
  getDefaultProps: function() {
    return {
      component: React.DOM.div,
      touchable: true
    };
  },

  handleTouchStart: function(e) {
    if (!this.props.scroller || !this.props.touchable) {
      return;
    }

    this.startPos = [e.touches[0].pageX, e.touches[0].pageY];
    this.props.scroller.doTouchStart(e.touches, e.timeStamp);
    e.preventDefault();
  },

  handleTouchMove: function(e) {
    if (!this.props.scroller || !this.props.touchable) {
      return;
    }

    e.preventDefault();

    this.startDirection = getDirectionFromAngle(getAngle(this.startPos, [e.touches[0].pageX, e.touches[0].pageY]));
    if (this.startDirection == 'left' || this.startDirection == 'right') {
      this.props.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
      e.stopPropagation();
    }

  },

  handleTouchEnd: function(e) {
    if (!this.props.scroller || !this.props.touchable) {
      return;
    }
    this.startDirection = null;
    this.props.scroller.doTouchEnd(e.timeStamp);
    e.preventDefault();
  },

  render: function() {
    var component = this.props.component;
    return this.transferPropsTo(
      component(
        {onTouchStart:this.handleTouchStart,
        onTouchMove:this.handleTouchMove,
        onTouchEnd:this.handleTouchEnd,
        onTouchCancel:this.handleTouchEnd}, 
        this.props.children
      )
    );
  }
});

module.exports = TouchableArea;
