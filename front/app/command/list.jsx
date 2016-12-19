import React from 'react';
import { 
	Button, 
	Input, 
	Row, 
	Grid, 
	Table, 
	Modal, 
	Form,
	FormGroup, 
	FormControl,
	ControlLabel, 
	Col,
} from 'react-bootstrap';

const CommandList = React.createClass({
	getInitialState() {
    return {
      target:"",
      order:"",
    };
  },
  run() {
  	this.setState({result:"请等待.."})
  	$.ajax({
			url:"/command/run",
			method:"POST",
			data:{
				target:this.state.target,
				order:this.state.order,
			},
			success:resp=>{
				this.setState({result:resp});
			},
			error: (xml,e) => {
        alert("操作失败, 请看console");
        console.info(xml,e);
        this.setState({oprating:false});
      }
		});
  },
	render(){
		return(<div>
			<Row>
				<Col xs={2} style={{textAlign:"right",paddingTop:7}}>
					<span>目标:{" "}</span>
				</Col>
				<Col xs={8}>
					<Input 
			    	type="text" 
			    	value={this.state.target}
			    	placeholder="10.144.240.160,"
			    	onChange={e=>{this.setState({target:e.target.value})}}/>
			  </Col>
	    </Row>
	    <Row>
				<Col xs={2} style={{textAlign:"right",paddingTop:7}}>
					<span>命令:{" "}</span>
				</Col>
				<Col xs={8}>
					<Input 
						style={{width:"100%"}}
			    	type="textarea" 
			    	value={this.state.order}
			    	placeholder="ls -l"
			    	onChange={e=>{this.setState({order:e.target.value})}}/>
			  </Col>
	    </Row>
	    <Row>
				<Col xsOffset={2} xs={10}>
					<Button bsStyle="primary" onClick={this.run}>就这么干!</Button> {" "}
					<Button href="https://leanote.com/blog/post/57d26bacab64416952000607">常用命令参考</Button>
			  </Col>
	    </Row>
	    <br />
	    <Row>
				<Col xs={12}>
					<pre>
						{this.state.result}
					</pre>
			  </Col>
	    </Row>
			
		</div>);
	}
});

export default CommandList