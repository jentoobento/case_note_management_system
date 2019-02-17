import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
// import { getCurrentProfile } from '../../actions/dashboardActions';
// import { getClientList } from '../../actions/dashboardActions';
import { getDashboard, getClients } from "../../actions/dashboardActions";
import Spinner from "../common/Spinner";
import { Image, Item, Responsive, Segment, Form, Button, Grid, Search, Header } from "semantic-ui-react";
import Client from "./Client";

class Dashboard extends Component {
  constructor(props) {
    super();
    this.state = {
      clients: [],
      sortDirection: "DESC",
      loading: false,
      errors: {},
      homeActive: true,
      addFellowActive: false
    };

    // this.onChange = this.onChange.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.clients.length === 0) {
      // if the page is refreshed
      this.props.getClients(); // call axios from redux -> update props
    }
    this.setState({
      clients: this.props.clients,
      isLoading: false, results: [], value: '' // reset search component
    });

    // this.props.getDashboard();
    // axios
    //     .get('/api/users/register', userData)
    //     .then(res => history.push('/login'))
    //     .catch(err =>
    //         dispatch({
    //             type: GET_ERRORS,
    //             payload: err.response.data
    //         })
    //     );

    // axios
    //     .get('/api/dashboard/all')
    //     .then(response => {this.setState({clients: response.data})
    // })
  }

  componentWillReceiveProps(nextProps){
    // updated props if page is refreshed
    if(this.props !== nextProps){
      this.setState({
        clients: nextProps.clients
      });
    }
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  homeFunc() {
    this.setState({ homeActive: true, addFellowActive: false });
  }

  addFellow() {
    this.setState({ homeActive: false, addFellowActive: true });
    this.props.history.push("/addfellow");
  }

  sort = (field, direction) => {
    this.setState({
      clients: this.state.clients.sort(function(a, b) {
        if (a[field] > b[field]) {
          return direction == "DESC" ? 1 : -1;
        } else if (a[field] < b[field]) {
          return direction == "DESC" ? -1 : 1;
        }
        return 0;
      }),
      sortDirection: direction == "DESC" ? "ASC" : "DESC"
    });
  };

  resetSearchComponent = () => this.setState({ searchIsLoading: false, searchResults: [], searchValue: '' })

  handleResultSelect = (e, { result }) => {
    console.log('search bar selected item:', result)
  }

  // handles filtering of clients
  handleSearchChange = (e, { value }) => {
    value = value.toLowerCase()
    this.setState({ searchIsLoading: true, searchValue: value })
    let searchResults = this.state.clients.filter(client => {
      if(client.first_name.toLowerCase().includes(value) || client.last_name.toLowerCase().includes(value)){
        return client
      }
    }).map(person => {
      return {
        title: `${person.first_name} ${person.last_name}`, 
        description: '1234', 
        image: 'https://pngimage.net/wp-content/uploads/2018/06/generic-person-png-4.png', 
        key: person.id
      }
    })
    setTimeout(() => {
      if(this.state.searchValue.length < 1){
        return this.resetSearchComponent()
      }
      this.setState({ 
        searchIsLoading: false,
        searchValue: value,
        searchResults: searchResults
      })
    }, 300)
  }

  render() {
    var clients = this.state.clients;

    return (
      <div>
        <div className="ui inverted segment">
          <div className="ui inverted secondary pointing menu">
            <a
              className={this.state.homeActive ? "item active" : "item"}
              onClick={() => this.homeFunc()}
            >
              Home
            </a>
            <a
              className={this.state.addFellowActive ? "item active" : "item"}
              onClick={() => this.addFellow()}
            >
              Add Fellow
            </a>
            <a
              href="/login"
              className="right menu item"
              onClick={this.onLogoutClick.bind(this)}
            >
              <div className="ui primary button">Log Out</div>
            </a>
          </div>
        </div>
        <h1>Client List</h1>
        <Button 
          icon={this.state.sortDirection == 'ASC' ? 'sort alphabet ascending' : 'sort alphabet descending'} 
          onClick={e => this.sort("last_name", this.state.sortDirection)} 
          content='Sort by Last Name'
        />
        <Search
          loading={this.state.searchIsLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.handleSearchChange}
          results={this.state.searchResults}
          value={this.state.searchValue}
          {...this.props}
        />
        <div />
        <div className="ui filterContainer catalogue_items">
          <Item.Group>
            {clients.map((client, index) => (
              <Client
                key={index}
                first_name={client.first_name}
                last_name={client.last_name}
                email={client.email}
                phone={client.phone}
                count={index + 1}
              />
            ))}
          </Item.Group>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getClients: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  clients: state.dashboard.allClients
});

export default connect(
  mapStateToProps,
  { logoutUser, getClients }
)(Dashboard);
