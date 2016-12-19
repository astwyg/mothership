import React from 'react';
import { Well,Table,Button,Modal,Input } from 'react-bootstrap';
import CreateContainer from "./createcontainer";

const ContainerOp = React.createClass({
	getInitialState() {
    return {
      oprating:false,
      showModal:false,
      hostip:"",
			name:"",
			vnet:"",
			ip:"",
			gateway:""
    };
  },
	op(flag){
		this.setState({oprating:true});
		$.ajax({
			url:"/vm/op",
			method:"POST",
			data:{
				hostip:this.props.hostip,
				name: this.props.name,
				flag:flag
			},
			success:resp => {
				resp = JSON.parse(resp);
				if(resp.result == "success"){
					this.props.reload(this.props.hostip);
				} else{
					alert("操作失败, 请看console");
        	console.info(xml,e);
				}
				this.setState({oprating:false});
			},
			error: (xml,e) => {
        alert("操作失败, 请看console");
        console.info(xml,e);
        this.setState({oprating:false});
      }
		});
	},
	copy(name){
		$.ajax({
			url:"/vm/copy",
			method:"POST",
			data:{
				fromHostip:this.props.hostip,
				toHostip:this.state.hostip,
				fromName: this.props.name,
				toName: this.state.name,
				fromVnet:this.props.vnet,
				toVnet:this.state.vnet,
				fromIp:this.props.ip,
				toIp:this.state.ip,
				fromGateway:this.props.gateway,
				toGateway:this.state.gateway,
			},
			success:resp => {
				resp = JSON.parse(resp);
				this.setState({
					configName:resp.name,
					configVnet:resp.vnet,
					configIp:resp.ip,
					configGateway:resp.gateway
				});
			},
			error: (xml,e) => {
        alert("操作失败, 请看console");
        console.info(xml,e);
        this.setState({oprating:false});
      }
		});
	},
	render(){
		return (<div>
			{this.props.state == "STOPPED"?
			<Button bsStyle="success" bsSize="xs" onClick={this.op.bind(this,"up")} style={{marginRight:5}} disabled={this.state.oprating?true:false}>{this.state.oprating?"请等待..":"开机"}</Button>:
			<Button bsStyle="warning" bsSize="xs" onClick={this.op.bind(this,"down")} style={{marginRight:5}} disabled={this.state.oprating?true:false}>{this.state.oprating?"请等待..":"关机"}</Button>
			}
			<Button bsStyle="danger" bsSize="xs" onClick={this.op.bind(this,"del")} disabled={this.props.state == "STOPPED"?false:true} style={{marginRight:5}}>删除</Button>
			<Button bsStyle="info" bsSize="xs" onClick={()=>{this.setState({showModal:true})}} disabled={this.props.state == "STOPPED"?false:true} style={{marginRight:5}}>复制</Button>
			<Modal show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}}>
        <Modal.Header closeButton>
          <Modal.Title>请输入配置</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal">
	          <Input 
				    	type="text" 
				    	label="Host" 
				    	labelClassName="col-xs-2" 
				    	wrapperClassName="col-xs-10" 
				    	value={this.state.hostip}
				    	onChange={e=>{this.setState({hostip:e.target.value})}}/>
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
				    	onChange={e=>{this.setState({vnet:e.target.value})}}/>
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
          <Button bsStyle="primary" onClick={this.copy} disabled={this.state.hostip&&this.state.vnet&&this.state.ip&&this.state.gateway?false:true}>好</Button>
        </Modal.Footer>
      </Modal>
		</div>);
	}
});

const Containers = React.createClass({
	componentWillReceiveProps(nextProps){
		if(nextProps.hostip){
			this.listCotianer(nextProps.hostip)
		}
	},
	listCotianer(hostip){
		$.ajax({
			url:"/vm/getContainerList",
			method:"POST",
			data:{
				hostip:hostip
			},
			success: resp => {
				resp = JSON.parse(resp);
        if(resp.error){
        	this.setState({containerTable:<Well>获取容器列表失败, 请看console.</Well>});
        } else {
        	let containerList = [];
        	for(let c of resp.result){
        		containerList.push(
        			<tr key={c.key}>
				        <td>{c.name}</td>
				        <td>{c.state}</td>
				        <td>{c.ip}</td>
				        <td>{c.autostart}</td>
				        <td><ContainerOp hostip={hostip} name={c.name} vnet={c.vnet} ip={c.ip} gateway={c.gateway} state={c.state} reload={this.listCotianer}/></td>
				      </tr>
        		);
        	}
        	let containerTable = (<div>
        		<CreateContainer hostip={hostip} reload={this.listCotianer}/>
					  <Table striped bordered condensed hover>
					    <thead>
					      <tr>
					        <th>name</th>
					        <th>state</th>
					        <th>ip</th>
					        <th>autostart</th>
					        <th>oprate</th>
					      </tr>
					    </thead>
					    <tbody>
					      {containerList}
					    </tbody>
					  </Table>
        	</div>);
        	this.setState({containerTable:containerTable});
        }
      },
      error: (xml,e) => {
        alert("获取容器列表失败, 请看console");
        console.info(xml,e);
      }
		});
		this.setState({containerTable:<Well>正在和物理机通信..</Well>})
	},
	render(){
		let resp = this.props.hostip?
			this.state.containerTable:
			<Well>请在左上角选择物理机.</Well>
		return resp
	}
});

export default Containers;