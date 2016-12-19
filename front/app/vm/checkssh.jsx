import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';

const CheckSSH = React.createClass({
	getInitialState() {
    return { 
    	showModal: false,
    	body:null
    };
  },
  doCheck(){
  	this.setState({ showModal: true, sshTable:<p>正在通信..</p> });
  	$.ajax({
  		url:"/vm/getSSHState",
			success: resp => {
				resp = JSON.parse(resp);
				let sshList = [];
				for(let c of resp.result){
      		sshList.push(
      			<tr key={"ssh" + c.key}>
      				<td>{c.ip}</td>
			        <td>{c.status}</td>
			      </tr>
      		);
      	}
      	let sshTable = (
					<Table striped bordered condensed hover>
				    <thead>
				      <tr>
				        <th>ip</th>
				        <th>状态</th>
				      </tr>
				    </thead>
				    <tbody>
				      {sshList}
				    </tbody>
				  </Table>
      	);
      	this.setState({sshTable:sshTable});
      },
      error: (xml,e) => {
        alert("获取SSH状态失败, 请看console");
        console.info(xml,e);
      }
  	});
  },
  reconnectSSH(){
  	$.ajax({
  		url:"/vm/reconnectSSH",
			success: resp => {
				resp = JSON.parse(resp);
				if(resp.result == "success"){
					alert("SSH正在重置, 请稍后查看状态.");
					this.setState({showModal:false});
				}
      },
      error: (xml,e) => {
        alert("获取SSH状态失败, 请看console");
        console.info(xml,e);
      }
  	});
  },
	render(){
		return(<div style={this.props.style}>
			<Button
        bsStyle="primary"
        onClick={this.doCheck}
      >
        检查物理机SSH连接
      </Button>
      <Modal show={this.state.showModal} onHide={()=>this.setState({showModal:false})}>
        <Modal.Header closeButton>
          <Modal.Title>物理机SSH连接情况</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.sshTable}
        </Modal.Body>
        <Modal.Footer>
        	<Button bsStyle="danger" onClick={this.reconnectSSH}>重连SSH</Button>
          <Button bsStyle="primary" onClick={()=>this.setState({showModal:false})}>好</Button>
        </Modal.Footer>
      </Modal>
		</div>);
	}
});

export default CheckSSH