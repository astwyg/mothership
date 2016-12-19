import React from 'react';
import { Well,Table,Button,Modal,Input } from 'react-bootstrap';

const ContainerOp = React.createClass({
	getInitialState() {
    return { 
    	showModal: false,
    	loading: false,
    	name: "",
    	vnet: "lxcbr0",
    	ip: "",
    	gateway: "",
    };
  },
  create() {
  	this.setState({loading:true});
  	$.ajax({
			url:"/vm/createContainer",
			method:"POST",
			data:{
				ip:this.state.ip,
				name:this.state.name,
				vnet:this.state.vnet,
				gateway:this.state.gateway,
				hostip:this.props.hostip
			},
			success: resp => {
				resp = JSON.parse(resp);
        if(resp.result == "success"){
        	this.setState({showModal:false});
        	this.props.reload(this.props.hostip);
        } else {
        	alert("开通容器失败, 请看console");
        	console.info(resp.error);
        }
      },
      error: (xml,e) => {
        alert("开通容器失败, 请看console");
        console.info(xml,e);
      },
      complete: ()=>{
      	this.setState({loading:false});
      }
		});
  },
	render() {
		return(<div>
			<Button
				style={{float:"right",marginBottom:5}}
        bsStyle="success"
        onClick={()=>{this.setState({showModal:true})}}>
        创建新容器
      </Button>
      <Modal show={this.state.showModal} onHide={()=>this.setState({showModal:false})}>
        <Modal.Header closeButton>
          <Modal.Title>创建新容器</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal">
				    <Input 
				    	type="text" 
				    	label="Name" 
				    	labelClassName="col-xs-2" 
				    	wrapperClassName="col-xs-10" 
				    	value={this.state.name}
				    	onChange={e=>{this.setState({name:e.target.value})}}/>
				    <Input 
				    	type="text" 
				    	label="Vnet" 
				    	labelClassName="col-xs-2" 
				    	wrapperClassName="col-xs-10" 
				    	value={this.state.vnet}
				    	onChange={e=>{this.setState({vent:e.target.value})}}/>
				    <Input 
				    	type="text" 
				    	label="IP" 
				    	labelClassName="col-xs-2" 
				    	wrapperClassName="col-xs-10" 
				    	value={this.state.ip}
				    	onChange={e=>{this.setState({ip:e.target.value})}}/>
				    <Input 
				    	type="text" 
				    	label="Gateway" 
				    	labelClassName="col-xs-2" 
				    	wrapperClassName="col-xs-10" 
				    	value={this.state.gateway}
				    	onChange={e=>{this.setState({gateway:e.target.value})}}/>
				  </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.create} disabled={this.state.name&&this.state.vnet&&this.state.ip&&this.state.gateway&&!this.state.loading?false:true}>{this.state.loading?"请等待":"好"}</Button>
        </Modal.Footer>
      </Modal>
    </div>);
	}
});

export default ContainerOp;