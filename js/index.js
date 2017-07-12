"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var monitoredStreams = ["coremax7", "comster404", "freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.getTwitchData = _this.getTwitchData.bind(_this);
    _this.focus = _this.focus.bind(_this);
    _this.updateStreamInfo = _this.updateStreamInfo.bind(_this);
    _this.updateChannelInfo = _this.updateChannelInfo.bind(_this);
    _this.initStreamMonitor = _this.initStreamMonitor.bind(_this);
    _this.state = { streamMon: _this.initStreamMonitor(),
      requestedStatus: "Online" };
    _this.refresh = _this.refresh.bind(_this);

    return _this;
  }

  App.prototype.componentDidMount = function componentDidMount() {
    //console.log(this.state.streamMon);
    this.refresh();
  };

  App.prototype.render = function render() {
    return React.createElement(
      "div",
      { classname: "searchPanel", style: {} },
      React.createElement(
        "select",
        { value: this.state.requestedStatus, onChange: this.handleChange },
        React.createElement(
          "option",
          { value: "Online" },
          "Online"
        ),
        React.createElement(
          "option",
          { value: "Offline" },
          "Offline"
        ),
        React.createElement(
          "option",
          { value: "Either" },
          "Either"
        )
      ),
      React.createElement(
        "button",
        { onClick: this.refresh },
        "Refresh"
      ),
      React.createElement("br", null),
      React.createElement(ChannelDisplay, { streamMon: this.state.streamMon, requestedStatus: this.state.requestedStatus })
    );
  };

  App.prototype.focus = function focus() {
    this.textInput.focus();
  };

  App.prototype.getTwitchData = function getTwitchData() {
    var _this2 = this;

    var streamURL = "https://wind-bow.glitch.me/twitch-api/streams/";
    var channelURL = "https://wind-bow.glitch.me/twitch-api/channels/";
    var userURL = "https://wind-bow.glitch.me/twitch-api/users/";

    var streamerData = [];

    for (var i = 0; i < monitoredStreams.length; i++) {
      //console.log(monitoredStreams[i]);
      var status;
      var streamName = monitoredStreams[i];
      var game;
      var channelURL2;
      var name;
      var logo;
      var status2;
      var streamerData = [];
      //console.log(streamName);
      //fetch from stream
      fetch(streamURL + streamName).then(function (response) {
        return response.json();
      }).then(function (responseJson) {
        //console.log(responseJson);
        _this2.updateStreamInfo(responseJson);
        //console.log('got stream data');
      }).catch(function (error) {
        console.error(error);
      });
      fetch(channelURL + streamName).then(function (response) {
        return response.json();
      }).then(function (responseJson) {
        //console.log(responseJson);
        _this2.updateChannelInfo(responseJson);
        //console.log('got stream data');
      }).catch(function (error) {
        console.error(error);
      });
    }
    //return streamerData;
    //console.log(streamerData[0].logo);
  };

  App.prototype.handleChange = function handleChange(event) {
    this.setState({ requestedStatus: event.target.value });
  };

  App.prototype.updateStreamInfo = function updateStreamInfo(streamInfo) {
    //console.log(streamInfo);

    for (var i = 0; i < this.state.streamMon.length; i++) {
      var nameSearch = this.state.streamMon[i].name;

      var index = streamInfo._links.channel.lastIndexOf("/") + 1;
      var streamName = streamInfo._links.channel.substr(index);
      //console.log(nameSearch + "vs" + streamName);
      if (streamName === this.state.streamMon[i].name) {

        var newMon = JSON.parse(JSON.stringify(this.state.streamMon[i]));
        if (streamInfo.stream == null) {
          newMon.status = "Offline";
          newMon.game = "Not currently streaming";
          //console.log(newMon);
        } else {
            newMon.status = "Online";
            newMon.game = streamInfo.stream.game;
            newMon.channelURL = streamInfo.stream._links.self;
            //console.log(newMon);
          }
        //TODO: Compare new object to old object before updating it in state
        //console.log(newMon);
        var newMonitors = this.state.streamMon;
        newMonitors[i] = newMon;
        this.setState({ streamMon: newMonitors });
      }
    }
  };

  App.prototype.updateChannelInfo = function updateChannelInfo(channelInfo) {
    //console.log(channelInfo);

    for (var i = 0; i < this.state.streamMon.length; i++) {
      var nameSearch = this.state.streamMon[i].name;
      var streamName = channelInfo.name;
      //console.log(nameSearch + "vs" + streamName);
      if (streamName.toLowerCase() === this.state.streamMon[i].name.toLowerCase()) {
        //console.log('found it');
        var newMon = JSON.parse(JSON.stringify(this.state.streamMon[i]));
        //console.log(newMon);
        //console.log(streamInfo.stream);
        newMon.exists = true;
        //console.log(newMon);
        //logic for retired channels or missing logos

        newMon.logo = channelInfo.logo;

        var newMonitors = this.state.streamMon;
        newMonitors[i] = newMon;
        this.setState({ streamMon: newMonitors });
      }
      //TODO: Compare new object to old object before updating it in state
    }
  };

  App.prototype.initStreamMonitor = function initStreamMonitor() {
    var streamMonitors = [];
    for (var i = 0; i < monitoredStreams.length; i++) {
      //console.log(monitoredStreams[i]);
      var streamMonitor = {
        name: monitoredStreams[i],
        status: '',
        game: '',
        logo: '',
        channelURL: '',
        exists: false
      };
      streamMonitors.push(streamMonitor);
      //console.log(streamMonitor);
    }
    //console.log(streamMonitors[0].name);
    //console.log(streamMonitors);
    return streamMonitors;
    //console.log(this.state.streamMon[0].name);
    //console.log(this.state.streamMon[0].name)
  };

  App.prototype.refresh = function refresh() {
    this.getTwitchData();
  };

  return App;
}(React.Component);

function ChannelDisplay(props) {
  return React.createElement(
    "div",
    { style: { backgroundColor: 'skyblue', border: '3px solid black', padding: '10px', display: 'inline-block' } },
    React.createElement(
      "table",
      { style: { borderCollapse: 'collapse' } },
      props.streamMon.map(function (Mon) {
        console.log(Mon);
        var logoLink;
        var game;
        var accountName;
        var accountStatus;
        var accountExists;
        var channelURL;

        accountExists = Mon.exists;
        accountName = Mon.name;
        accountStatus = Mon.status;
        logoLink = Mon.logo;
        channelURL = Mon.channelURL;

        if (accountExists == false) {
          game = "No Account";
          logoLink = "https://thumb.ibb.co/m6WOnv/na.jpg";
        } else if (Mon.logo == "" || Mon.logo == null) {
          logoLink = "https://thumb.ibb.co/g6N7Ea/sorry.jpg";
          game = Mon.game;
        } else {
          game = Mon.game;
        }

        if (Mon.status === props.requestedStatus || props.requestedStatus === "Either") {
          return React.createElement(
            "tr",
            { style: { border: '1px solid grey', justifyContent: 'space-between' } },
            React.createElement(
              "td",
              { style: { height: 70, width: 70, border: '1px solid grey' } },
              React.createElement("img", { src: logoLink, style: { height: 70, width: 70 } })
            ),
            React.createElement(
              "td",
              { style: { border: '1px solid grey' } },
              React.createElement(
                "p",
                null,
                accountName
              )
            ),
            React.createElement(
              "td",
              { style: { border: '1px solid grey' } },
              React.createElement(
                "p",
                null,
                game
              )
            ),
            channelURL != "" ? React.createElement(
              "td",
              { style: { backgroundColor: 'green', border: '1px solid grey' } },
              React.createElement(
                "p",
                null,
                React.createElement(
                  "a",
                  { href: channelURL },
                  accountStatus
                )
              )
            ) : React.createElement(
              "td",
              { style: { backgroundColor: 'red', border: '1px solid grey' } },
              React.createElement(
                "p",
                null,
                accountStatus
              )
            )
          );
        }
      })
    )
  );
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));