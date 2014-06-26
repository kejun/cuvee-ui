/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      isClose: false
    };
  },
  render: function() {
    var lines = (
      <g>
      <path d="M1,2 L9,2"/>
      <path d="M1,5 L9,5"/>
      <path d="M1,8 L9,8"/>
      </g>
    );
    if (this.state.isClose) {
      lines = (
        // react暂不支持animate属性
      <g>
        <path d="M1,2 L9,2" dangerouslySetInnerHTML={{__html: '<animate dur=".5s" fill="freeze" attributeName="d" to="M2,2 L8,8" />'}} />
        <path d="M1,5 L9,5" dangerouslySetInnerHTML={{__html: '<animate dur=".5s" fill="freeze" attributeName="opacity" to="0" />'}} />
        <path d="M1,8 L9,8" dangerouslySetInnerHTML={{__html: '<animate dur=".5s" fill="freeze" attributeName="d" to="M2,8 L8,2" />'}} />
      </g>
      );
    }
    return this.transferPropsTo(
      <svg width="100%" height="100%" viewBox="0 0 10 10">
      <g stroke="#000" strokeWidth="1.5px" strokeLinecap="round">
        {lines}
      </g>
      </svg>
    );
  }
});
