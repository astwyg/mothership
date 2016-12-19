import React from 'react';
import { DropdownButton,MenuItem } from 'react-bootstrap';

const HostChooser = React.createClass({
	getInitialState() {
    return {
      hosts:[],
      currentHost:"选择物理机",
    };
  },
	componentDidMount(){
		$.ajax({
			url:"/vm/getHosts",
			success: data => {
        this.setState({
          hosts:JSON.parse(data),
        });
      },
      error: (xml,e) => {
        alert("获取主机失败, 请看console");
        console.info(xml,e);
      }
		});
	},
	render(){
		let menuItems = [];
		let key=0;
		for(let host of this.state.hosts){
			menuItems.push(<MenuItem key={key++} eventKey={key} onClick={this.chooseHost.bind(this, host.ip)}>{host.ip}</MenuItem>)
		}
		return(<div style={this.props.style}>
			<DropdownButton title={this.state.currentHost} id="host-choose">
		    {menuItems}
		  </DropdownButton>
		</div>);
	},
	chooseHost(ip, e){
		e.preventDefault();
		this.setState({currentHost:ip});
		this.props.onChoose(ip);
	}
})

export default HostChooser