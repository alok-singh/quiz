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
			<div className="col-xs-2 hidden-sm hidden-xs"></div>
     	</div>
	}

	renderLeaders() {
		return <React.Fragment>
			<div className="row names">
  		     	<div className="col-xs-4 col-md-5 text-right topgap" >
			 		<h3>{(this.props.resultList[1] && this.props.resultList[1].name) ? this.props.resultList[1].name : 'NA'}</h3>
					<p>{(this.props.resultList[1] && this.props.resultList[1].score) ? this.props.resultList[1].score : 'NA'}</p>
    	     	</div>
				<div className="col-xs-4 col-md-2 text-center sidegap" >
			 		<h2>{(this.props.resultList[0] && this.props.resultList[0].name) ? this.props.resultList[0].name : 'NA'}</h2>
					<p>{(this.props.resultList[0] && this.props.resultList[0].score) ? this.props.resultList[0].score : 'NA'}</p>
    	     	</div>
				<div className="col-xs-4 col-md-5 text-left topgap" >
			 		<h3>{(this.props.resultList[2] && this.props.resultList[2].name) ? this.props.resultList[2].name : 'NA'}</h3>
					<p>{(this.props.resultList[2] && this.props.resultList[2].score) ? this.props.resultList[2].score : 'NA'}</p>
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
							<th>Rank</th>
							<th>Name</th>
							<th>Score</th>
						</tr>
					</thead>
				</table>
				<div className="table-wrapper-scroll-y tablescroll" style={{maxHeight: '240px'}}>
					<table className="table">
						<tbody>
							{this.props.resultList.map((player, index) => {
								return <tr>
									<th>{parseInt(index) + 1}</th>
									<td>{player.name}</td>
									<td>{player.score}</td>
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