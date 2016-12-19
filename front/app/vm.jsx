import { Button, Input, Row, Grid } from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';

import HostChooser from './vm/host-chooser';
import Containers from "./vm/containers";
import CheckSSH from "./vm/checkssh";

const ThisPage = React.createClass({
	getInitialState() {
    return {
      hostip:null,
    };
  },
	render() {
		return(
			<Grid>
        <Row style={{textAlign:"right", margin:10}}>
        	<CheckSSH style={{float:"left", marginRight:5}}/>
          <HostChooser onChoose={ip=>this.setState({hostip:ip})} style={{float:"left"}}/>
        </Row>  
        <Row style={{margin:10}}>
        	<Containers hostip={this.state.hostip}/>
        </Row>
			</Grid>
		);
	}
});

ReactDOM.render(<ThisPage />, document.getElementById('page'));