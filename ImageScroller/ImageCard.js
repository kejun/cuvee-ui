/** @jsx React.DOM */
var React   = require('react');
var Loading = require('../Indicator/CircleLoading');

module.exports = React.createClass({
  getInitialState: function() {
    return { loaded: false };
  },
  handleLoad: function() {
    this.setState({ loaded: true });
  },
  render: function() {
    var imgLoadingStyle = {
      display: 'table-cell',
      'text-align': 'center',
      'vertical-align': 'middle',
      width: this.props.width || 'auto',
      height: this.props.height || 'auto',
    };
    var imgStyle = {
      width: this.props.width || 'auto',
      height: this.props.height || 'auto',
      overflow: 'hidden'
    };
    var cardStyle = {
      position: 'relative',
      display: 'inline-block',
      'vertical-align': 'top',
      width: this.props.width || 'auto',
    };
    var img = (
      <div className="imagecard-img" style={imgLoadingStyle}>
      <img src={this.props.src} style={{position: 'absolute', visibility: 'hidden'}} onLoad={this.handleLoad} />
      <Loading />
      </div>
    );

    if (this.state.loaded) {
      img = (
        <div className="imagecard-img" style={imgStyle}>
        <img src={this.props.src} width={this.props.width || '100%'} />
        </div>
      );
    }

    var text;
    if (this.props.text) {
      text = (
        <div className="imagecard-text">
          {this.props.text}
        </div>
      );
    }
    return (
        <div className="imagecard" style={cardStyle}>
        {img}
        {text}
        </div>
    );
  }
});
