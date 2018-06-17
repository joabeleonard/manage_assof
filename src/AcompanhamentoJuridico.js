import $ from "jquery";
import InputCustomizado from "./componentes/InputCustomizado"
import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros'

class FormularioAcompanhamentoJuridico extends Component {
  constructor(props) {
    super(props);
    this.state = {titulo: '', data: '',detalhes:'',numeroProcesso:'', id_usuario: ''};
    this.handlAcompanhamentoJuridicoSubmit = this.handleAcompanhamentoJuridicoSubmit.bind(this);
  }
  
  
  salvaAlteracao(nomeInput,evento){
    var campoSendoAlterado = {};
    campoSendoAlterado[nomeInput] = evento.target.value;    
    this.setState(campoSendoAlterado);   
  }
  
  handleAcompanhamentoJuridicoSubmit(e) {
    e.preventDefault();

    $.ajax({
      url: 'http://assofce.kinghost.net:21314/acompanhamentoJuridico/cadastrar',
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({titulo: '', data: '',detalhes:'',numeroProcesso:'', id_usuario: ''}),
      success: function(novaListagem) {
          PubSub.publish( 'atualiza-lista-acompanhamentos',novaListagem);            
          this.setState({titulo:'',preco:'',autorId:''});
      },
      error: function(resposta){
        if(resposta.status === 400){
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: function(){
        PubSub.publish("limpa-erros",{});
      }            
    });  
    
    this.setState({titulo: '', preco: '', autorId: ''});
  }
  
  render() {
    var usuarios = this.props.usuarios.map(function(usuario){
      return <option key={usuario.id_usuario} value={usuario.id_usuario}>{usuario.nome}</option>;
    });
    return (
      <div className="autorForm">
        <form className="pure-form pure-form-aligned" onSubmit={this.handleLivroSubmit}>
          <InputCustomizado id="titulo" name="titulo" label="Titulo: " type="text" value={this.state.titulo} placeholder="Titulo" onChange={this.salvaAlteracao.bind(this,'titulo')} />
          <InputCustomizado id="detalhes" name="detalhes" label="Detalhes: " type="text" value={this.state.detalhes} placeholder="Detalhes" onChange={this.salvaAlteracao.bind(this,'detalhes')}  />
          <InputCustomizado id="numeroProcesso" name="numeroProcesso" label="Número do Processo: " type="text" value={this.state.numeroProcesso} placeholder="Número do Processo" onChange={this.salvaAlteracao.bind(this,'numeroProcesso')}  />

          <div className="pure-controls">
            <select value={this.state.id_usuario} name="id_usuario" onChange={this.id_usuario}>
              <option value="">Selecione</option>
              {usuarios}
            </select>
          </div>
          <div className="pure-control-group">                                  
            <label></label> 
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
          </div>          
        </form>             
      </div>
    );
  }
} 

class TabelaAcompanhamentoJuridico extends Component {
  
  render() {
    var acompanhamentos = this.props.lista.map(function(acompanhamento){
      return(
          <tr key={acompanhamento.id_acompanhamento_juridico}>
            <td>{acompanhamento.titulo}</td>
            <td>{acompanhamento.detalhes}</td>
            <td>{acompanhamento.numeroProcesso}</td>
          </tr>
        );
      });
    return(
      <table className="pure-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Detalhe</th>
            <th>Numero do processo</th>
          </tr>
        </thead>
        <tbody>
          {acompanhamentos}
        </tbody>
      </table>
    );
  }
}

export default class AcompanhamentoJuridicoAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {lista : [],usuarios:[]};
  }

  componentDidMount() {
    $.ajax({
      url: "http://assofce.kinghost.net:21314/acompanhamentoJuridico",
      dataType: 'json',
      success: function(data) {
        this.setState({lista: data});
      }.bind(this)
    });
    
    $.ajax({
      url: "http://assofce.kinghost.net:21314/usuarios",
      dataType: 'json',
      success: function(data) {
        this.setState({usuarios: data});
      }.bind(this)
    });

    PubSub.subscribe('atualiza-lista-acompanhamentos', function(topicName,lista){
      this.setState({lista:lista});
    }.bind(this));    
  }


  render() {
    return(
      <div>
        <div className="header">
          <h1>Cadastro de Acompanhamento Juridico</h1>
        </div>
        <div className="content" id="content">
          <FormularioAcompanhamentoJuridico usuarios={this.state.usuarios}/>
          <TabelaAcompanhamentoJuridico lista={this.state.lista}/>
        </div>
      </div>
    );
  }
} 