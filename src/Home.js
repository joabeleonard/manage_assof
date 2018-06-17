import React,{Component} from 'react';
import $ from 'jquery';


export default class Home extends Component {

	constructor() {
    super();    
    this.state = {lista : []};    
  }

  componentDidMount(){  
    $.ajax({
        url:"http://assofce.kinghost.net:21314/arquivos",
        dataType: 'json',
        success:function(resposta){    
          this.setState({lista:resposta});
        }.bind(this)
      } 
    );          
	}
	render(){
		return (
	      <div>		
	          <div className="header">
	            <h1>Bem vindo ao sistema</h1>
	          </div>
	          <div className="content" id="content">  
							<TabelaImagens lista={this.state.lista}/>        

						                           
	          </div>
	      </div>

		);		
	}
}

class TabelaImagens extends Component{
	render(){
		return(
			<div>
				<table className="pure-table">
                        <thead>
                          <tr>
                            <th>Imagem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.props.lista.map(function(imagem){
                              return (
                                <tr key={imagem}>
                                  <td><img width='500px' src={'http://assofce.kinghost.net:21314/'+imagem} /></td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>  
			</div>
		);
	}
}