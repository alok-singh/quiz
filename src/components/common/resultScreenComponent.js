import React, { Component } from 'react';

export default class ResultScreenComponent extends Component {

	renderHeader() {
		return <div className="row titlerow">
		    <div className="col-xs-3 col-md-2" >
		 		<img src="/images/br.png" className="img-responsive logo" />
	     	</div>
			<div className="col-xs-9 col-md-8 text-center" >
		 		<p style={{fontSize: '30px', color: '#333', margin: '0px'}}>Final Scores</p>
	     	</div>
			<div class="col-xs-2" style={{fontSize: '20px', textAlign: 'right', paddingTop: '7px'}}>
			    <a href={this.props.homeURL} style={{padding: '5px 10px', background: '#2fbf2d', color: '#fff', borderRadius: '5px'}}>Home</a>
			</div>
     	</div>
	}

	renderLeaders() {
		return <React.Fragment>
			<div className="row names">
  		     	<div className="col-xs-4 col-md-5 text-right topgap" >
			 		<h3>{(this.props.resultList[1] && this.props.resultList[1].name) ? this.props.resultList[1].name : 'NA'}</h3>
					<p>{(this.props.resultList[1] && this.props.resultList[1].score) ? this.props.resultList[1].score : '0'}</p>
    	     	</div>
				<div className="col-xs-4 col-md-2 text-center sidegap" >
			 		<h2>{(this.props.resultList[0] && this.props.resultList[0].name) ? this.props.resultList[0].name : 'NA'}</h2>
					<p>{(this.props.resultList[0] && this.props.resultList[0].score) ? this.props.resultList[0].score : '0'}</p>
    	     	</div>
				<div className="col-xs-4 col-md-5 text-left topgap" >
			 		<h3>{(this.props.resultList[2] && this.props.resultList[2].name) ? this.props.resultList[2].name : 'NA'}</h3>
					<p>{(this.props.resultList[2] && this.props.resultList[2].score) ? this.props.resultList[2].score : '0'}</p>
    	     	</div>
         	</div>
			<div className="row">
  		     	<div className="col-xs-12 " >
			 		<img src="/images/gth.png" className="img-responsive" style={{margin: '0 auto'}} />
    	     	</div>
         	</div>
		</React.Fragment>
	}

	renderTable() {
		return <div className="row tablerow" style={{padding: '10px'}}>
			<div className="col-md-3 hidden-sm hidden-xs" ></div>
			<div className="col-xs-12 col-md-6 " >
				<table className="table" style={{color: '#fff'}}>
					<thead>
						<tr>
							<th width="30%">Rank</th>
							<th width="40%">Name</th>
							<th width="30%">Score</th>
						</tr>
					</thead>
				</table>
				<div className="table-wrapper-scroll-y tablescroll" style={{maxHeight: '240px'}}>
					<table className="table">
						<tbody>
							{this.props.resultList.map((player, index) => {
								return <tr>
									<td width="30%">{parseInt(index) + 1}</td>
									<td width="40%">{player.name}</td>
									<td width="30%">{player.score}</td>
			 					</tr>
							})}
						</tbody>
					</table>
				</div>
	     	</div>	
		     <div className="col-md-3 hidden-sm hidden-xs" ></div>
     	</div>
	}

    render() {
        return <section id="titlebar" style={{background: '#7686cb', minHeight: '100vh'}}>
			<div className="container">
	 		 	{this.renderHeader()}
	 		 	{this.renderLeaders()}
				{this.renderTable()}
	    	</div>
		</section>
    }

}