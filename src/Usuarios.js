import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from  './TratadorErros';

class TabelaAssociados extends Component {

	render() {
		return(
                    <div>            
                      <table className="pure-table">
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.props.lista.map(function(usuarios){
                              return (
                                <tr key={usuarios.id_usuario}>
                                  <td>{usuarios.nome}</td>
                                  <td>{usuarios.cpf}</td>
                                  <td>{usuarios.email}</td>
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


export default class AssociadosAdmin extends Component {

  constructor() {
    super();    
    this.state = {lista : []};    
  }

  componentDidMount(){  
    $.ajax({
        url:"http://assofce.kinghost.net:21314/usuarios",
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
          <h1>Associados Cadastrados</h1>
        </div>
        <div className="content" id="content">                            
          <TabelaAssociados lista={this.state.lista}/>        
        </div>      

      </div>
    );
  }
}