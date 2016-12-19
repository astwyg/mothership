import { Button, Input, Row, Grid, Modal } from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';

import CommandList from './command/list';

const ThisPage = React.createClass({
	getInitialState() {
    return {
      modalVisible:true,
    };
  },
	render() {
		return(
			<Grid>
        <Row style={{textAlign:"right", margin:10}}>
        </Row>  
        <Row style={{margin:10}}>
        	<CommandList/>
        </Row>
        <Modal show={this.state.modalVisible} onHide={()=>{this.setState({ modalVisible: false })}}>
          <Modal.Header closeButton>
            <Modal.Title>使用条款</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>此功能将使用预留在容器中的后门, 直接以root权限操作容器, 使用不当可能对容器造成毁灭式影响, 可能无法恢复, 在生成环境中使用本功能, 可能导致生产事故并被扣除整个季度的绩效. 请务必确认选对了容器, 且操作命令正确!</p>
            <p>此功能将使用预留在容器中的后门, 直接以root权限操作容器, 使用不当可能对容器造成毁灭式影响, 可能无法恢复, 在生成环境中使用本功能, 可能导致生产事故并被扣除整个季度的绩效. 请务必确认选对了容器, 且操作命令正确!</p>
            <p>此功能将使用预留在容器中的后门, 直接以root权限操作容器, 使用不当可能对容器造成毁灭式影响, 可能无法恢复, 在生成环境中使用本功能, 可能导致生产事故并被扣除整个季度的绩效. 请务必确认选对了容器, 且操作命令正确!</p>
            <p>重要的事情要说三遍.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={()=>{this.setState({ modalVisible: false })}}>我知道了</Button>
          </Modal.Footer>
        </Modal>
			</Grid>
		);
	}
});

ReactDOM.render(<ThisPage />, document.getElementById('page'));